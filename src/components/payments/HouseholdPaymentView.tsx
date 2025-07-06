import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PaymentModal from "./PaymentModal";
import { ArrowLeft, Plus, Send, FileText, CheckCircle, Clock, AlertCircle, X } from "lucide-react";

interface Household {
  id: string;
  name: string;
  rent_amount: number;
  due_day: number;
}

interface HouseholdMember {
  id: string;
  user_id: string;
  display_name: string;
  email: string;
  role: string;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  paid_at: string | null;
  due_date: string;
  created_at: string;
  resident_id: string;
  tx_id: string | null;
  paymob_order_id: string | null;
  payment_token: string | null;
}

interface HouseholdPaymentViewProps {
  household: Household;
  userType: string;
  onBack: () => void;
}

const HouseholdPaymentView: React.FC<HouseholdPaymentViewProps> = ({ household, userType, onBack }) => {
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCreatePaymentOpen, setIsCreatePaymentOpen] = useState(false);
  const [newPaymentData, setNewPaymentData] = useState({
    amount: household.rent_amount,
    dueDate: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
    fetchPayments();
  }, [household.id]);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('household_members')
        .select('*')
        .eq('household_id', household.id)
        .order('display_name');

      if (error) throw error;
      setMembers(data || []);
    } catch (error: any) {
      console.error('Error fetching members:', error);
      toast({
        title: "Error",
        description: "Failed to load household members.",
        variant: "destructive",
      });
    }
  };

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('household_id', household.id)
        .order('due_date', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error: any) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to load payments.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePayments = async () => {
    if (!newPaymentData.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please select a due date.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.rpc('create_household_payments', {
        target_household_id: household.id,
        target_due_date: newPaymentData.dueDate,
        target_amount: newPaymentData.amount
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; message?: string };
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Payment requests created for all household members.",
        });
        setIsCreatePaymentOpen(false);
        fetchPayments();
      } else {
        throw new Error(result.error || 'Failed to create payments');
      }
    } catch (error: any) {
      console.error('Error creating payments:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create payment requests.",
        variant: "destructive",
      });
    }
  };

  const sendReminder = async (memberId: string, memberEmail: string) => {
    try {
      // Create notification for the member
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: members.find(m => m.id === memberId)?.user_id,
          type: 'payment_reminder',
          title: 'Payment Reminder',
          message: `Reminder: Your rent payment of ${formatCurrency(household.rent_amount / members.length)} for ${household.name} is due soon.`,
          read: false
        });

      if (error) throw error;

      toast({
        title: "Reminder Sent",
        description: `Payment reminder sent to ${memberEmail}`,
      });
    } catch (error: any) {
      console.error('Error sending reminder:', error);
      toast({
        title: "Error",
        description: "Failed to send reminder.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'failed':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
      failed: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getMembersWithPayments = () => {
    return members.map(member => {
      const memberPayments = payments.filter(p => p.resident_id === member.id);
      const latestPayment = memberPayments[0]; // Already sorted by due_date desc
      
      return {
        ...member,
        payment: latestPayment,
        totalPaid: memberPayments.filter(p => p.status === 'paid').length
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{household.name}</h2>
            <p className="text-gray-600">
              Monthly Rent: {formatCurrency(household.rent_amount)} • Due: {household.due_day} of each month
            </p>
          </div>
        </div>

        {userType === 'renter' && (
          <Dialog open={isCreatePaymentOpen} onOpenChange={setIsCreatePaymentOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Payment Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Payment Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Total Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newPaymentData.amount}
                    onChange={(e) => setNewPaymentData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newPaymentData.dueDate}
                    onChange={(e) => setNewPaymentData(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
                <div className="text-sm text-gray-600">
                  This will create individual payment requests of {formatCurrency(newPaymentData.amount / members.length)} for each of the {members.length} household members.
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setIsCreatePaymentOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={handleCreatePayments}>
                    Create Payments
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Members and Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Payment Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Last Paid</TableHead>
                {userType === 'renter' && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {getMembersWithPayments().map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.display_name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    {member.payment ? formatCurrency(member.payment.amount) : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {member.payment && getStatusIcon(member.payment.status)}
                      {member.payment ? getStatusBadge(member.payment.status) : '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {member.payment ? formatDate(member.payment.due_date) : '-'}
                  </TableCell>
                  <TableCell>
                    {member.payment?.paid_at ? formatDate(member.payment.paid_at) : '-'}
                  </TableCell>
                  {userType === 'renter' && (
                    <TableCell>
                      <div className="flex gap-2">
                        {member.payment && member.payment.status !== 'paid' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendReminder(member.id, member.email)}
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Remind
                          </Button>
                        )}
                        {member.payment && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedPayment(member.payment);
                              setIsPaymentModalOpen(true);
                            }}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Details
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {members.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No household members found.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Modal */}
      {selectedPayment && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedPayment(null);
          }}
          payment={selectedPayment}
          household={household}
          userType={userType}
          onPaymentUpdate={fetchPayments}
        />
      )}
    </div>
  );
};

export default HouseholdPaymentView;