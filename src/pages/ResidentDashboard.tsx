import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import JoinHouseholdForm from "@/components/JoinHouseholdForm";
import UserProfile from "@/components/UserProfile";
import AppLogoWithBg from "@/components/AppLogoWithBg";
import DashboardHeader from "@/components/resident/DashboardHeader";
import StatsCards from "@/components/resident/StatsCards";
import HouseholdsList from "@/components/resident/HouseholdsList";
import RecentPayments from "@/components/resident/RecentPayments";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  } | null;
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
  } | null;
}

const ResidentDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [memberData, setMemberData] = useState<HouseholdMember[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchResidentData();
      fetchUserProfile();
    }
  }, [user]);

  // Add real-time subscription for household changes
  useEffect(() => {
    if (!user?.id) return;

    let isSubscribed = true;

    // Subscribe to household deletions with better error handling
    const householdChannel = supabase
      .channel(`household-changes-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'households'
        },
        (payload) => {
          if (!isSubscribed) return;
          
          console.log('Household deleted:', payload);
          // Remove the deleted household from memberData
          setMemberData(prev => prev.filter(member => member.household_id !== payload.old?.id));
          
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
          if (!isSubscribed) return;
          
          console.log('Member removed:', payload);
          // Remove the member from memberData
          setMemberData(prev => prev.filter(member => member.id !== payload.old?.id));
          
          toast({
            title: "Removed from household",
            description: "You have been removed from a household.",
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'household_members',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (!isSubscribed) return;
          
          console.log('Member data updated:', payload);
          toast({
            title: "Household Updated",
            description: "Your household information has been updated.",
          });
          
          // Debounce the refresh to avoid excessive API calls
          setTimeout(() => {
            if (isSubscribed) {
              fetchResidentData();
            }
          }, 1000);
        }
      )
      .subscribe();

    return () => {
      isSubscribed = false;
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
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setUserProfile(data);
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      toast({
        title: "Profile Error",
        description: "Failed to load user profile. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  const fetchResidentData = async () => {
    if (!user?.id) return;

    try {
      console.log('Fetching resident data for user:', user.id);
      
      // Use Promise.all for parallel queries to improve performance
      const [membersResult, paymentsResult] = await Promise.all([
        // Fetch household memberships
        supabase
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
          .eq('user_id', user.id),
        
        // Fetch recent payments/bill splits
        supabase
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
          .limit(5)
      ]);

      if (membersResult.error) {
        console.error('Error fetching members:', membersResult.error);
        throw membersResult.error;
      }

      if (paymentsResult.error) {
        console.error('Error fetching payments:', paymentsResult.error);
        throw paymentsResult.error;
      }

      console.log('Member data:', membersResult.data);
      console.log('Payments data:', paymentsResult.data);
      
      // Filter out any members where household is null (deleted households)
      const validMembers = (membersResult.data || []).filter(member => member.household !== null);
      setMemberData(validMembers);
      setPayments(paymentsResult.data || []);

    } catch (error: any) {
      console.error('Error fetching resident data:', error);
      toast({
        title: "Error loading data",
        description: "Failed to load dashboard data. Please refresh the page to try again.",
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
      // Additional safety check for household
      if (!member.household) return;
      
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
      // Additional safety check for household
      if (!member.household) return total;
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
  
  const handleJoinSuccess = () => {
    fetchResidentData();
    setIsJoinDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <DashboardHeader userProfile={userProfile} />

        <StatsCards 
          totalRent={totalRent}
          nextDueDate={nextDueDate}
          pendingPayments={pendingPayments}
        />

        {memberData.length === 0 ? (
          <JoinHouseholdForm />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2 space-y-4">
              <HouseholdsList memberData={memberData} />
            </div>
            <div className="space-y-4">
              <RecentPayments payments={payments} />
              <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Join Another Household
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Join a new household</DialogTitle>
                  </DialogHeader>
                  <JoinHouseholdForm onJoin={handleJoinSuccess} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidentDashboard;
