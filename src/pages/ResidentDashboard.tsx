
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Home, DollarSign, Calendar, Users, Bell, User, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JoinHouseholdForm from "@/components/JoinHouseholdForm";
import NotificationCenter from "@/components/NotificationCenter";
import UserProfile from "@/components/UserProfile";
import AppLogoWithBg from "@/components/AppLogoWithBg";

interface HouseholdMember {
  id: string;
  household_id: string;
  display_name: string;
  email: string;
  role: string;
  household: {
    id: string;
    name: string;
    rent_amount: number;
    due_day: number;
  };
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  paid_at: string | null;
  bill: {
    month_year: string;
    due_date: string;
    household: {
      name: string;
    };
  };
}

const ResidentDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [memberData, setMemberData] = useState<HouseholdMember[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (user) {
      fetchResidentData();
      fetchUserProfile();
    }
  }, [user]);

  // Add real-time subscription for household changes
  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to household deletions
    const householdChannel = supabase
      .channel('household-changes')
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'households'
        },
        (payload) => {
          console.log('Household deleted:', payload);
          // Remove the deleted household from memberData
          setMemberData(prev => prev.filter(member => member.household_id !== payload.old.id));
          
          toast({
            title: "Household removed",
            description: "A household you were part of has been deleted.",
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'household_members',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Member removed:', payload);
          // Remove the member from memberData
          setMemberData(prev => prev.filter(member => member.id !== payload.old.id));
          
          toast({
            title: "Removed from household",
            description: "You have been removed from a household.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(householdChannel);
    };
  }, [user?.id, toast]);

  const fetchUserProfile = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchResidentData = async () => {
    if (!user?.id) return;

    try {
      console.log('Fetching resident data for user:', user.id);
      
      // Fetch household memberships
      const { data: members, error: membersError } = await supabase
        .from('household_members')
        .select(`
          id,
          household_id,
          display_name,
          email,
          role,
          household:households (
            id,
            name,
            rent_amount,
            due_day
          )
        `)
        .eq('user_id', user.id);

      if (membersError) throw membersError;

      console.log('Member data:', members);
      
      // Filter out any members where household is null (deleted households)
      const validMembers = (members || []).filter(member => member.household !== null);
      setMemberData(validMembers);

      // Fetch recent payments/bill splits
      const { data: billSplits, error: paymentsError } = await supabase
        .from('bill_splits')
        .select(`
          id,
          amount,
          status,
          paid_at,
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
        .limit(5);

      if (paymentsError) throw paymentsError;

      console.log('Payments data:', billSplits);
      setPayments(billSplits || []);

    } catch (error: any) {
      console.error('Error fetching resident data:', error);
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getNextDueDate = () => {
    if (memberData.length === 0) return null;
    
    // Get the earliest due date from all households
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    let nextDue = null;
    
    memberData.forEach(member => {
      const dueDay = member.household.due_day;
      let dueDate = new Date(currentYear, currentMonth, dueDay);
      
      // If due date has passed this month, use next month
      if (dueDate < today) {
        dueDate = new Date(currentYear, currentMonth + 1, dueDay);
      }
      
      if (!nextDue || dueDate < nextDue) {
        nextDue = dueDate;
      }
    });
    
    return nextDue;
  };

  const getTotalRent = () => {
    return memberData.reduce((total, member) => {
      return total + Number(member.household.rent_amount);
    }, 0);
  };

  const getPendingPayments = () => {
    return payments.filter(payment => payment.status === 'pending').length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <AppLogoWithBg size={60} />
          <p className="text-gray-600 mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const nextDueDate = getNextDueDate();
  const totalRent = getTotalRent();
  const pendingPayments = getPendingPayments();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Mobile-Optimized Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <AppLogoWithBg size={40} className="sm:hidden" />
            <AppLogoWithBg size={48} className="hidden sm:block" />
            <div className="flex-1 sm:flex-none">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">Resident Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600 leading-tight">Manage your rent payments and household memberships</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4"
            >
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Profile</span>
            </Button>
            <NotificationCenter />
          </div>
        </div>

        {/* Profile Section */}
        {showProfile && (
          <div className="flex justify-center px-2">
            <div className="w-full max-w-md">
              <UserProfile userProfile={userProfile} />
            </div>
          </div>
        )}

        {/* Mobile-First Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">Total Monthly Rent</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">${totalRent.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">Next Due Date</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                    {nextDueDate ? nextDueDate.toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">Pending Payments</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{pendingPayments}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile-Responsive Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Join Household Form - Full width on mobile when no households */}
          {memberData.length === 0 ? (
            <div className="xl:col-span-2">
              <JoinHouseholdForm />
            </div>
          ) : (
            <div className="order-2 xl:order-1">
              <JoinHouseholdForm />
            </div>
          )}

          {/* Households Card - Responsive layout */}
          <Card className="order-1 xl:order-2">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                My Households
              </CardTitle>
              <CardDescription className="text-sm">
                Households you're a member of
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {memberData.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2 text-sm sm:text-base">No households yet</p>
                  <p className="text-xs sm:text-sm text-gray-500">Use the form above to join a household</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {memberData.map((member) => (
                    <div 
                      key={member.id}
                      className="p-3 sm:p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors active:bg-gray-100 touch-manipulation"
                      onClick={() => navigate(`/household/${member.household_id}`)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{member.household.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            Rent: ${member.household.rent_amount.toLocaleString()} • Due: {member.household.due_day}th
                          </p>
                        </div>
                        <div className="flex justify-between sm:justify-end items-center">
                          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {member.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Payments - Mobile Optimized */}
        {payments.length > 0 && (
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">Recent Payments</CardTitle>
              <CardDescription className="text-sm">Your latest rent payment activity</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{payment.bill.household.name}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {payment.bill.month_year} • Due: {new Date(payment.bill.due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex justify-between sm:justify-end items-center gap-3">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">${Number(payment.amount).toLocaleString()}</p>
                      <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : payment.status === 'verified'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResidentDashboard;
