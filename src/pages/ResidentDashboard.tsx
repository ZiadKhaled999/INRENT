
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Users, DollarSign, Calendar, Clock, Check, Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface Household {
  id: string;
  name: string;
  rent_amount: number;
  due_day: number;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  bill: {
    month_year: string;
    due_date: string;
    household: {
      name: string;
    };
  };
}

const ResidentDashboard = () => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only fetch data when user is loaded and authenticated
    if (!authLoading && user?.id) {
      fetchResidentData();
    } else if (!authLoading && !user) {
      // User is not authenticated, redirect to login
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const fetchResidentData = async () => {
    if (!user?.id) {
      console.error('User ID is not available');
      return;
    }

    try {
      console.log('Fetching resident data for user:', user.id);
      
      // Fetch households user is a member of
      const { data: memberData, error: memberError } = await supabase
        .from('household_members')
        .select(`
          household:households (
            id,
            name,
            rent_amount,
            due_day
          )
        `)
        .eq('user_id', user.id);

      if (memberError) {
        console.error('Error fetching household members:', memberError);
        throw memberError;
      }

      console.log('Member data:', memberData);
      const householdsData = memberData?.map(m => m.household).filter(Boolean) || [];
      setHouseholds(householdsData as Household[]);

      // Fetch user's payment history
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('bill_splits')
        .select(`
          id,
          amount,
          status,
          bill:bills (
            month_year,
            due_date,
            household:households (
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (paymentsError) {
        console.error('Error fetching payments:', paymentsError);
        throw paymentsError;
      }

      console.log('Payments data:', paymentsData);
      setPayments(paymentsData || []);

    } catch (error: any) {
      console.error('Error fetching resident data:', error);
      toast({
        title: "Failed to load dashboard",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markPaymentPaid = async (paymentId: string) => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to mark payments as paid.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('bill_splits')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
          payment_method: 'manual'
        })
        .eq('id', paymentId)
        .eq('user_id', user.id); // Ensure user can only update their own payments

      if (error) throw error;

      toast({
        title: "Payment marked!",
        description: "Your payment has been marked as paid.",
      });

      fetchResidentData();
    } catch (error: any) {
      console.error('Error marking payment:', error);
      toast({
        title: "Failed to mark payment",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const totalOwed = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  // Show loading while auth is loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If no user after auth loading is complete, return null (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Resident Dashboard</h1>
                <p className="text-gray-600">Your payment overview</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/join/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Join Household
              </Button>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Households</p>
                  <p className="text-2xl font-bold text-gray-900">{households.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount Owed</p>
                  <p className="text-2xl font-bold text-gray-900">${totalOwed.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Recent Payments</p>
                  <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Households */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>My Households</CardTitle>
            <CardDescription>Households you're a member of</CardDescription>
          </CardHeader>
          <CardContent>
            {households.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No households yet</h3>
                <p className="text-gray-600 mb-6">Join a household to start tracking your rent payments</p>
                <Button onClick={() => navigate('/join/new')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Join Household
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {households.map((household) => (
                  <Card key={household.id} className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => navigate(`/household/${household.id}`)}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{household.name}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Total Rent: ${household.rent_amount.toLocaleString()}</p>
                        <p>Due: {household.due_day}th of each month</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your recent rent payments</CardDescription>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No payments yet</h3>
                <p className="text-gray-600">Your payment history will appear here</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Household</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.bill.month_year}</TableCell>
                      <TableCell>{payment.bill.household.name}</TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {payment.status === 'paid' ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-orange-600" />
                          )}
                          <span className="capitalize">{payment.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {payment.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => markPaymentPaid(payment.id)}
                          >
                            Mark Paid
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
      </div>
    </div>
  );
};

export default ResidentDashboard;
