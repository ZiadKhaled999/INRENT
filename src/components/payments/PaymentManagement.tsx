import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HouseholdPaymentView from "./HouseholdPaymentView";
import PaymentExport from "./PaymentExport";
import { LogOut, Home, CreditCard, Users, AlertCircle } from "lucide-react";

interface UserProfile {
  id: string;
  user_type: string;
  payment_pin_hash: string | null;
}

interface PaymentManagementProps {
  userProfile: UserProfile;
  onSignOut: () => void;
}

interface Household {
  id: string;
  name: string;
  rent_amount: number;
  due_day: number;
  created_at: string;
}

interface PaymentStats {
  totalCollected: number;
  totalPending: number;
  totalOverdue: number;
  activeHouseholds: number;
}

const PaymentManagement: React.FC<PaymentManagementProps> = ({ userProfile, onSignOut }) => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PaymentStats>({
    totalCollected: 0,
    totalPending: 0,
    totalOverdue: 0,
    activeHouseholds: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchHouseholds();
    fetchPaymentStats();
  }, []);

  const fetchHouseholds = async () => {
    try {
      let query = supabase.from('households').select('*');
      
      if (userProfile.user_type === 'renter') {
        // Renters see only ACTIVE households they created (not scheduled for deletion)
        query = query
          .eq('created_by', userProfile.id)
          .eq('scheduled_for_deletion', false);
      } else {
        // Residents see only ACTIVE households they're members of
        const { data: memberData } = await supabase
          .from('household_members')
          .select('household_id, households!inner(scheduled_for_deletion)')
          .eq('user_id', userProfile.id)
          .eq('households.scheduled_for_deletion', false);
        
        if (memberData && memberData.length > 0) {
          const householdIds = memberData.map(m => m.household_id);
          query = query
            .in('id', householdIds)
            .eq('scheduled_for_deletion', false);
        } else {
          setHouseholds([]);
          setLoading(false);
          return;
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setHouseholds(data || []);
    } catch (error: any) {
      console.error('Error fetching households:', error);
      toast({
        title: "Error",
        description: "Failed to load households. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentStats = async () => {
    if (userProfile.user_type !== 'renter') return;

    try {
      // Get households created by this renter
      const { data: householdData } = await supabase
        .from('households')
        .select('id')
        .eq('created_by', userProfile.id);

      if (!householdData || householdData.length === 0) return;

      const householdIds = householdData.map(h => h.id);

      // Get payment statistics
      const { data: paymentData, error } = await supabase
        .from('payments')
        .select('amount, status')
        .in('household_id', householdIds);

      if (error) throw error;

      const newStats = paymentData?.reduce((acc, payment) => {
        const amount = parseFloat(payment.amount.toString());
        switch (payment.status) {
          case 'paid':
            acc.totalCollected += amount;
            break;
          case 'pending':
            acc.totalPending += amount;
            break;
          case 'overdue':
            acc.totalOverdue += amount;
            break;
        }
        return acc;
      }, {
        totalCollected: 0,
        totalPending: 0,
        totalOverdue: 0,
        activeHouseholds: householdIds.length
      }) || { totalCollected: 0, totalPending: 0, totalOverdue: 0, activeHouseholds: householdIds.length };

      setStats(newStats);
    } catch (error: any) {
      console.error('Error fetching payment stats:', error);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600">Loading payment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Dashboard</h1>
            <p className="text-gray-600 mt-1">
              {userProfile.user_type === 'renter' ? 'Manage rent collections' : 'View your payments'}
            </p>
          </div>
          <Button variant="outline" onClick={onSignOut} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Exit Payments
          </Button>
        </div>

        {/* Stats Cards (Renter Only) */}
        {userProfile.user_type === 'renter' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
                <CreditCard className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalCollected)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.totalPending)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalOverdue)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Households</CardTitle>
                <Home className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.activeHouseholds}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        {households.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Home className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Households Found</h3>
              <p className="text-gray-600 text-center">
                {userProfile.user_type === 'renter' 
                  ? "You haven't created any households yet. Create a household to start managing payments."
                  : "You're not a member of any households yet. Ask your landlord for an invitation."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="households" className="space-y-4">
            <TabsList>
              <TabsTrigger value="households" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Households
              </TabsTrigger>
              {userProfile.user_type === 'renter' && (
                <TabsTrigger value="export" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Export Data
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="households" className="space-y-4">
              {selectedHousehold ? (
                <HouseholdPaymentView
                  household={selectedHousehold}
                  userType={userProfile.user_type}
                  onBack={() => setSelectedHousehold(null)}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {households.map((household) => (
                    <Card key={household.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{household.name}</CardTitle>
                          <Badge variant="outline">
                            {userProfile.user_type === 'renter' ? 'Managing' : 'Member'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            Rent: <span className="font-semibold">{formatCurrency(household.rent_amount)}</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Due Day: <span className="font-semibold">{household.due_day} of each month</span>
                          </p>
                          <Button 
                            className="w-full mt-4"
                            onClick={() => setSelectedHousehold(household)}
                          >
                            <Users className="h-4 w-4 mr-2" />
                            View Payments
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {userProfile.user_type === 'renter' && (
              <TabsContent value="export">
                <PaymentExport households={households} />
              </TabsContent>
            )}
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;