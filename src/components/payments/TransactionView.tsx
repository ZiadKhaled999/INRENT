import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar, CreditCard, Home, DollarSign } from "lucide-react";
import PaymentModal from "./PaymentModal";

interface Transaction {
  id: string;
  amount: number;
  status: string;
  paid_at: string | null;
  due_date: string;
  created_at: string;
  tx_id: string | null;
  method: string | null;
  resident_id: string;
  paymob_order_id: string | null;
  payment_token: string | null;
  household: {
    id: string;
    name: string;
  };
  household_members: {
    display_name: string;
    email: string;
  };
}

interface GroupedTransactions {
  [householdId: string]: {
    household: { id: string; name: string };
    months: {
      [monthYear: string]: {
        [day: string]: Transaction[];
      };
    };
  };
}

interface TransactionViewProps {
  userType: string;
  userId: string;
}

const TransactionView: React.FC<TransactionViewProps> = ({ userType, userId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [groupedTransactions, setGroupedTransactions] = useState<GroupedTransactions>({});
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Transaction | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [totalCollected, setTotalCollected] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, [userId, userType]);

  const fetchTransactions = async () => {
    try {
      let query = supabase
        .from('payments')
        .select(`
          *,
          households!inner(id, name),
          household_members!inner(display_name, email)
        `);

      if (userType === 'renter') {
        // Get all payments for households created by this renter
        query = query.eq('households.created_by', userId);
      } else {
        // Get payments for this specific resident
        query = query.eq('household_members.user_id', userId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTransactions = (data || []).map(payment => ({
        ...payment,
        household: payment.households,
        household_members: payment.household_members
      }));

      setTransactions(formattedTransactions);
      groupTransactionsByHouseholdAndDate(formattedTransactions);
      calculateTotals(formattedTransactions);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const groupTransactionsByHouseholdAndDate = (transactions: Transaction[]) => {
    const grouped: GroupedTransactions = {};

    transactions.forEach(transaction => {
      const householdId = transaction.household.id;
      const date = new Date(transaction.created_at);
      const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      const day = date.toLocaleDateString('en-US', { day: 'numeric', weekday: 'short' });

      if (!grouped[householdId]) {
        grouped[householdId] = {
          household: transaction.household,
          months: {}
        };
      }

      if (!grouped[householdId].months[monthYear]) {
        grouped[householdId].months[monthYear] = {};
      }

      if (!grouped[householdId].months[monthYear][day]) {
        grouped[householdId].months[monthYear][day] = [];
      }

      grouped[householdId].months[monthYear][day].push(transaction);
    });

    setGroupedTransactions(grouped);
  };

  const calculateTotals = (transactions: Transaction[]) => {
    const collected = transactions
      .filter(t => t.status === 'paid')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const paid = userType === 'resident' 
      ? transactions.filter(t => t.status === 'paid').reduce((sum, t) => sum + Number(t.amount), 0)
      : 0;

    setTotalCollected(collected);
    setTotalPaid(paid);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodIcon = (method: string | null) => {
    if (!method) return <CreditCard className="w-4 h-4" />;
    return <CreditCard className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userType === 'renter' ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(totalCollected)}</div>
                <p className="text-xs text-muted-foreground">From all properties</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <CreditCard className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{transactions.length}</div>
                <p className="text-xs text-muted-foreground">All payment records</p>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
                <p className="text-xs text-muted-foreground">Successfully paid</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Transactions</CardTitle>
                <CreditCard className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{transactions.length}</div>
                <p className="text-xs text-muted-foreground">Payment records</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Transactions List */}
      {Object.keys(groupedTransactions).length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transactions Yet</h3>
            <p className="text-gray-600 text-center">
              {userType === 'renter' 
                ? "No payments have been made to your properties yet."
                : "You haven't made any payments yet."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {Object.entries(groupedTransactions).map(([householdId, householdData]) => (
                <AccordionItem key={householdId} value={householdId}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      <span>{householdData.household.name}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Accordion type="multiple" className="pl-6">
                      {Object.entries(householdData.months).map(([monthYear, monthData]) => (
                        <AccordionItem key={monthYear} value={monthYear}>
                          <AccordionTrigger className="text-sm">
                            {monthYear}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4">
                              {Object.entries(monthData).map(([day, dayTransactions]) => (
                                <div key={day} className="pl-4">
                                  <h4 className="font-medium text-sm text-gray-700 mb-2">{day}</h4>
                                  <div className="space-y-2">
                                    {dayTransactions.map((transaction) => (
                                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                          {getMethodIcon(transaction.method)}
                                          <div>
                                            <p className="font-medium">{formatCurrency(Number(transaction.amount))}</p>
                                            <p className="text-sm text-gray-600">
                                              {userType === 'renter' ? transaction.household_members.display_name : 'Rent Payment'}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Badge className={getStatusColor(transaction.status)}>
                                            {transaction.status}
                                          </Badge>
                                          {userType === 'resident' && transaction.status === 'pending' && (
                                            <Button 
                                              size="sm"
                                              onClick={() => {
                                                setSelectedPayment(transaction);
                                                setIsPaymentModalOpen(true);
                                              }}
                                            >
                                              Pay Now
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Payment Modal */}
      {selectedPayment && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedPayment(null);
          }}
          payment={selectedPayment}
          household={{
            id: selectedPayment.household.id,
            name: selectedPayment.household.name,
            rent_amount: 0,
            due_day: 1
          }}
          userType={userType}
          onPaymentUpdate={fetchTransactions}
        />
      )}
    </div>
  );
};

export default TransactionView;