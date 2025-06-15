import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Home, DollarSign, Calendar, Users, Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JoinHouseholdForm from "@/components/JoinHouseholdForm";
import NotificationCenter from "@/components/NotificationCenter";
import UserProfile from "@/components/UserProfile";

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
      setMemberData(members || []);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const nextDueDate = getNextDueDate();
  const totalRent = getTotalRent();
  const pendingPayments = getPendingPayments();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resident Dashboard</h1>
            <p className="text-gray-600">Manage your rent payments and household memberships</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Profile
            </Button>
            <NotificationCenter />
          </div>
        </div>

        {/* Profile Section */}
        {showProfile && (
          <div className="flex justify-center">
            <UserProfile userProfile={userProfile} />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Monthly Rent</p>
                  <p className="text-2xl font-bold text-gray-900">${totalRent.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Next Due Date</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {nextDueDate ? nextDueDate.toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingPayments}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Join Household Form */}
          {memberData.length === 0 ? (
            <div className="lg:col-span-2">
              <JoinHouseholdForm />
            </div>
          ) : (
            <JoinHouseholdForm />
          )}

          {/* Households */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                My Households
              </CardTitle>
              <CardDescription>
                Households you're a member of
              </CardDescription>
            </CardHeader>
            <CardContent>
              {memberData.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">No households yet</p>
                  <p className="text-sm text-gray-500">Use the form above to join a household</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {memberData.map((member) => (
                    <div 
                      key={member.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/household/${member.household_id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{member.household.name}</h3>
                          <p className="text-sm text-gray-600">
                            Rent: ${member.household.rent_amount.toLocaleString()} • Due: {member.household.due_day}th
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
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

        {/* Recent Payments */}
        {payments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Your latest rent payment activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{payment.bill.household.name}</p>
                      <p className="text-sm text-gray-600">
                        {payment.bill.month_year} • Due: {new Date(payment.bill.due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${Number(payment.amount).toLocaleString()}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
