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
import { ArrowLeft, Plus, FileText, CheckCircle, Clock, AlertCircle, X } from "lucide-react";

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
  household_members: {
    display_name: string;
    email: string;
  };
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
        .select(`
          *,
          household_members!inner(display_name, email)
        `)
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

  const createPayments = async () => {
    try {
      const { data, error } = await supabase.rpc('create_household_payments', {
        target_household_id: household.id,
        target_due_date: newPaymentData.dueDate,
        target_amount: household.rent_amount // Always use the actual rent amount
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Monthly payments generated successfully for all residents.",
      });

      setIsCreatePaymentOpen(false);
      setNewPaymentData({ dueDate: '' });
      fetchPayments(); // Refresh the payments list
    } catch (error: any) {
      console.error('Error creating payments:', error);
      toast({
        title: "Error",
        description: "Failed to generate payments. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getMemberName = (residentId: string) => {
    const member = members.find(m => m.id === residentId);
    return member ? member.display_name : 'Unknown';
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'pending':
        return <Clock className="h-3 w-3 mr-1" />;
      case 'overdue':
        return <AlertCircle className="h-3 w-3 mr-1" />;
      default:
        return <X className="h-3 w-3 mr-1" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600">Loading payment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{household.name}</h2>
            <p className="text-gray-600">
              Rent: {formatCurrency(household.rent_amount)} • Due: {household.due_day}th of each month
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Automatic payment generation for renters only */}
          {userType === 'renter' && (
            <Dialog open={isCreatePaymentOpen} onOpenChange={setIsCreatePaymentOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Generate Monthly Payments
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate Monthly Payments</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newPaymentData.dueDate}
                      onChange={(e) => setNewPaymentData({
                        ...newPaymentData,
                        dueDate: e.target.value
                      })}
                    />
                  </div>
                  <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
                    <p><strong>Total Rent:</strong> {formatCurrency(household.rent_amount)}</p>
                    <p><strong>Members:</strong> {members.length}</p>
                    <p><strong>Amount per member:</strong> {formatCurrency(household.rent_amount / Math.max(members.length, 1))}</p>
                    <p className="text-xs mt-2 text-gray-500">
                      This will create individual payment requests for each resident automatically.
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreatePaymentOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createPayments} disabled={!newPaymentData.dueDate}>
                      Generate Payments
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount), 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + Number(p.amount), 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payments Yet</h3>
              <p className="text-gray-600">
                {userType === 'renter' 
                  ? "Generate monthly payments to start collecting rent from residents."
                  : "No payment requests have been created yet."
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resident</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.household_members.display_name}
                    </TableCell>
                    <TableCell>{formatCurrency(Number(payment.amount))}</TableCell>
                    <TableCell>{new Date(payment.due_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(payment.status)}>
                        {getStatusIcon(payment.status)}
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      {userType === 'resident' && payment.status === 'pending' ? (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            setSelectedPayment(payment);
                            setIsPaymentModalOpen(true);
                          }}
                        >
                          Pay Now
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedPayment(payment);
                            setIsPaymentModalOpen(true);
                          }}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
          onPaymentUpdate={() => {
            fetchPayments();
            setSelectedPayment(null);
            setIsPaymentModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default HouseholdPaymentView;