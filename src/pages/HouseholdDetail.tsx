import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Users, DollarSign, Calendar, Plus, Check, Clock, Share } from "lucide-react";
import InviteLink from "@/components/InviteLink";
import InviteResidentModal from "@/components/InviteResidentModal";

interface Household {
  id: string;
  name: string;
  rent_amount: number;
  due_day: number;
  created_by: string;
}

interface Member {
  id: string;
  display_name: string;
  email: string;
  user_id: string;
}

interface BillSplit {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  user_profile?: {
    full_name?: string;
    email?: string;
  };
}

interface Bill {
  id: string;
  month_year: string;
  total_amount: number;
  due_date: string;
  status: string;
  splits: BillSplit[];
}

const HouseholdDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [household, setHousehold] = useState<Household | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    if (id) {
      fetchHouseholdData();
      fetchUserProfile();
    }
  }, [id]);

  const fetchUserProfile = async () => {
    if (!user?.id) {
      console.log('No user ID available');
      return;
    }

    try {
      console.log('Fetching user profile for user:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      console.log('User profile data:', data);
      setUserProfile(data);
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchHouseholdData = async () => {
    try {
      // Fetch household details
      const { data: householdData, error: householdError } = await supabase
        .from('households')
        .select('*')
        .eq('id', id)
        .single();

      if (householdError) throw householdError;
      setHousehold(householdData);

      // Fetch members
      const { data: membersData, error: membersError } = await supabase
        .from('household_members')
        .select('*')
        .eq('household_id', id);

      if (membersError) throw membersError;
      setMembers(membersData);

      // Fetch bills
      const { data: billsData, error: billsError } = await supabase
        .from('bills')
        .select('*')
        .eq('household_id', id)
        .order('created_at', { ascending: false });

      if (billsError) throw billsError;

      // Fetch bill splits and profiles separately
      if (billsData && billsData.length > 0) {
        const billIds = billsData.map(bill => bill.id);
        
        // Fetch splits
        const { data: splitsData, error: splitsError } = await supabase
          .from('bill_splits')
          .select('*')
          .in('bill_id', billIds);

        if (splitsError) throw splitsError;

        // Fetch all profiles for users in splits
        const userIds = splitsData?.map(split => split.user_id) || [];
        const uniqueUserIds = [...new Set(userIds)];
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', uniqueUserIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        }

        // Create a map of user profiles for quick lookup
        const profilesMap = new Map();
        profilesData?.forEach(profile => {
          profilesMap.set(profile.id, profile);
        });

        // Transform bills data with splits and profile information
        const transformedBills: Bill[] = billsData.map(bill => ({
          id: bill.id,
          month_year: bill.month_year,
          total_amount: bill.total_amount,
          due_date: bill.due_date,
          status: bill.status,
          splits: splitsData?.filter(split => split.bill_id === bill.id).map(split => {
            const profile = profilesMap.get(split.user_id);
            return {
              id: split.id,
              user_id: split.user_id,
              amount: split.amount,
              status: split.status,
              user_profile: profile ? {
                full_name: profile.full_name || 'Unknown User',
                email: profile.email || 'Unknown'
              } : {
                full_name: 'Unknown User',
                email: 'Unknown'
              }
            };
          }) || []
        }));

        setBills(transformedBills);
      } else {
        setBills([]);
      }

    } catch (error: any) {
      console.error('Error fetching household data:', error);
      toast({
        title: "Failed to load household",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCurrentBill = async () => {
    if (!household || !user) return;

    try {
      const now = new Date();
      const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const dueDate = new Date(now.getFullYear(), now.getMonth(), household.due_day);

      // Create bill
      const { data: bill, error: billError } = await supabase
        .from('bills')
        .insert({
          household_id: household.id,
          month_year: monthYear,
          total_amount: household.rent_amount,
          due_date: dueDate.toISOString().split('T')[0],
          status: 'pending'
        })
        .select()
        .single();

      if (billError) throw billError;

      // Create equal splits for all members
      const splitAmount = household.rent_amount / members.length;
      const splits = members.map(member => ({
        bill_id: bill.id,
        user_id: member.user_id,
        amount: splitAmount,
        status: 'pending'
      }));

      const { error: splitsError } = await supabase
        .from('bill_splits')
        .insert(splits);

      if (splitsError) throw splitsError;

      toast({
        title: "Bill created!",
        description: `${monthYear} bill created with equal splits.`,
      });

      fetchHouseholdData();
    } catch (error: any) {
      console.error('Error creating bill:', error);
      toast({
        title: "Failed to create bill",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const markSplitPaid = async (splitId: string) => {
    try {
      const { error } = await supabase
        .from('bill_splits')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
          payment_method: 'manual'
        })
        .eq('id', splitId);

      if (error) throw error;

      toast({
        title: "Payment marked!",
        description: "Payment has been marked as paid.",
      });

      fetchHouseholdData();
    } catch (error: any) {
      console.error('Error marking payment:', error);
      toast({
        title: "Failed to mark payment",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const inviteMember = async () => {
    if (!inviteEmail || !household) return;

    try {
      // For now, we'll just add the email as a placeholder member
      // In a real app, you'd send an invitation email
      const { error } = await supabase
        .from('household_members')
        .insert({
          household_id: household.id,
          user_id: 'pending', // Placeholder for pending invites
          display_name: inviteEmail.split('@')[0],
          email: inviteEmail
        });

      if (error) throw error;

      toast({
        title: "Invitation sent!",
        description: `Invitation sent to ${inviteEmail}`,
      });

      setInviteEmail('');
      fetchHouseholdData();
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Failed to send invitation",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isRenter = userProfile?.user_type === 'renter';
  const isCreator = household?.created_by === user?.id;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg mx-auto mb-4"></div>
          <p className="text-gray-600">Loading household...</p>
        </div>
      </div>
    );
  }

  if (!household) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Household not found</h1>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                ← Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{household.name}</h1>
                <p className="text-gray-600">${household.rent_amount.toLocaleString()} • Due {household.due_day}th</p>
              </div>
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
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Members</p>
                  <p className="text-2xl font-bold text-gray-900">{members.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Per Person</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${members.length > 0 ? (household.rent_amount / members.length).toFixed(0) : '0'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Next Due</p>
                  <p className="text-2xl font-bold text-gray-900">{household.due_day}th</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invite Section - Only show to renters/creators */}
        {(isRenter || isCreator) && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Share className="w-5 h-5 text-blue-600" />
                <CardTitle>Invite Roommates</CardTitle>
              </div>
              <CardDescription>
                Use the button below to generate a secure, one-time invitation link for a roommate.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-700">
                To invite a roommate, use the "Invite Resident" button. Each invite is secure and can only be used once.
              </p>
              <InviteResidentModal householdId={household.id} householdName={household.name} />
            </CardContent>
          </Card>
        )}

        {/* Members Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Members ({members.length})</CardTitle>
            <CardDescription>Current household members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{member.display_name}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {member.user_id === user?.id && (
                      <span className="text-sm text-blue-600 font-medium">You</span>
                    )}
                    {member.user_id === household.created_by && (
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">Renter</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bills Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Bills & Payments</CardTitle>
                <CardDescription>Track monthly rent splits</CardDescription>
              </div>
              {/* Only renters/creators can create bills */}
              {(isRenter || isCreator) && (
                <Button onClick={createCurrentBill}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create This Month's Bill
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {bills.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No bills yet</h3>
                <p className="text-gray-600 mb-6">
                  {isRenter || isCreator 
                    ? "Create your first monthly bill to start splitting rent" 
                    : "Wait for the renter to create this month's bill"
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {bills.map((bill) => (
                  <div key={bill.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{bill.month_year}</h3>
                        <p className="text-gray-600">Due: {new Date(bill.due_date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">${bill.total_amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-600 capitalize">{bill.status}</p>
                      </div>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Member</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bill.splits?.map((split) => (
                          <TableRow key={split.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{split.user_profile?.full_name || 'Unknown'}</p>
                                <p className="text-sm text-gray-600">{split.user_profile?.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>${split.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {split.status === 'paid' ? (
                                  <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Clock className="w-4 h-4 text-orange-600" />
                                )}
                                <span className="capitalize">{split.status}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {split.status === 'pending' && split.user_id === user?.id && (
                                <Button
                                  size="sm"
                                  onClick={() => markSplitPaid(split.id)}
                                >
                                  Mark Paid
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HouseholdDetail;
