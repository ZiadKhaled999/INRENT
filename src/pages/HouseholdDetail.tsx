import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Home, DollarSign, Users, ArrowLeft, Plus, UserMinus } from "lucide-react";
import InviteResidentModal from "@/components/InviteResidentModal";
import LeaveHouseholdModal from "@/components/LeaveHouseholdModal";
import AppLogoWithBg from "@/components/AppLogoWithBg";
import RentPeriodManager from "@/components/RentPeriodManager";
import OverduePaymentNotifier from "@/components/OverduePaymentNotifier";
import HouseholdDeletionScheduler from "@/components/HouseholdDeletionScheduler";

interface Household {
  id: string;
  name: string;
  rent_amount: number;
  due_day: number;
  created_by: string;
  scheduled_for_deletion: boolean | null;
  deletion_reason: string | null;
  deletion_scheduled_at: string | null;
}

interface HouseholdMember {
  id: string;
  household_id: string;
  user_id: string;
  display_name: string;
  email: string;
  role: string;
}

interface Bill {
  id: string;
  household_id: string;
  month_year: string;
  due_date: string;
  total_amount: number;
  status: string;
  bill_splits: BillSplit[];
}

interface BillSplit {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  paid_at: string | null;
  payment_method: string | null;
}

const HouseholdDetail = () => {
  const { id: householdId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [household, setHousehold] = useState<Household | null>(null);
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingBill, setCreatingBill] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  useEffect(() => {
    if (householdId && user) {
      fetchHouseholdData();
    }
  }, [householdId, user]);

  const fetchHouseholdData = async () => {
    try {
      // Fetch household details
      const { data: householdData, error: householdError } = await supabase
        .from('households')
        .select('*')
        .eq('id', householdId)
        .single();

      if (householdError) throw householdError;
      setHousehold(householdData);

      // Fetch household members
      const { data: membersData, error: membersError } = await supabase
        .from('household_members')
        .select('*')
        .eq('household_id', householdId)
        .order('joined_at', { ascending: true });

      if (membersError) throw membersError;
      setMembers(membersData || []);

      // Fetch bills
      const { data: billsData, error: billsError } = await supabase
        .from('bills')
        .select(`
          *,
          bill_splits (
            id,
            user_id,
            amount,
            status,
            paid_at,
            payment_method
          )
        `)
        .eq('household_id', householdId)
        .order('due_date', { ascending: false });

      if (billsError) throw billsError;
      setBills(billsData || []);

    } catch (error: any) {
      console.error('Error fetching household data:', error);
      toast({
        title: "Error loading household",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createBill = async () => {
    if (!household || !user) return;

    setCreatingBill(true);
    try {
      const now = new Date();
      const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      // Check if bill already exists for this month
      const { data: existingBill, error: checkError } = await supabase
        .from('bills')
        .select('id, month_year')
        .eq('household_id', household.id)
        .eq('month_year', monthYear)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingBill) {
        toast({
          title: "Bill already exists",
          description: `A bill for ${monthYear} has already been created for this household.`,
          variant: "destructive",
        });
        return;
      }

      const dueDate = new Date(now.getFullYear(), now.getMonth(), household.due_day);

      // Create bill
      const { data: billData, error: billError } = await supabase
        .from('bills')
        .insert([
          {
            household_id: household.id,
            month_year: monthYear,
            due_date: dueDate.toISOString().split('T')[0],
            total_amount: household.rent_amount,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (billError) throw billError;

      // Create bill splits for each resident
      const residents = members.filter(member => member.role === 'resident');
      const amountPerResident = Number(household.rent_amount) / residents.length;

      const billSplits = residents.map(resident => ({
        bill_id: billData.id,
        user_id: resident.user_id,
        amount: amountPerResident,
        status: 'pending'
      }));

      const { error: splitsError } = await supabase
        .from('bill_splits')
        .insert(billSplits);

      if (splitsError) throw splitsError;

      toast({
        title: "Bill created successfully",
        description: `Monthly bill for ${monthYear} has been created and split among residents.`,
      });

      await fetchHouseholdData();
    } catch (error: any) {
      console.error('Error creating bill:', error);
      toast({
        title: "Failed to create bill",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCreatingBill(false);
    }
  };

  const getUserRole = () => {
    if (!user) return null;
    const member = members.find(m => m.user_id === user.id);
    return member?.role || null;
  };

  const isCreator = () => {
    return household?.created_by === user?.id;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AppLogoWithBg size={60} />
          <p className="text-gray-600 mt-4">Loading household details...</p>
        </div>
      </div>
    );
  }

  if (!household) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Household not found</h2>
          <p className="text-gray-600 mb-4">The household you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const userRole = getUserRole();
  const currentUserIsCreator = isCreator();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')} className="flex-shrink-0">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <AppLogoWithBg size={40} className="flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">{household.name}</h1>
                <p className="text-sm lg:text-base text-gray-600">
                  Monthly Rent: ${household.rent_amount.toLocaleString()} • Due: {household.due_day}th
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {currentUserIsCreator && (
                <>
                  <InviteResidentModal
                    householdId={household.id}
                    householdName={household.name}
                  />
                  <Button 
                    onClick={createBill} 
                    disabled={creatingBill}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {creatingBill ? 'Creating...' : 'Create Bill'}
                  </Button>
                </>
              )}
              {!currentUserIsCreator && userRole === 'resident' && (
                <LeaveHouseholdModal
                  householdId={household.id}
                  householdName={household.name}
                  onLeave={() => navigate('/dashboard')}
                />
              )}
            </div>
          </div>
          
          {/* Show deletion warning if scheduled */}
          {household.scheduled_for_deletion && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-800">Household Scheduled for Deletion</h3>
                  <p className="text-sm text-red-700">
                    This household will be deleted at the end of the current rent period.
                    {household.deletion_reason && ` Reason: ${household.deletion_reason}`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Monthly Rent</p>
                      <p className="text-xl font-bold">${household.rent_amount.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Residents</p>
                      <p className="text-xl font-bold">{members.filter(m => m.role === 'resident').length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Home className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Due Day</p>
                      <p className="text-xl font-bold">{household.due_day}th</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rent Period Manager */}
            <RentPeriodManager 
              householdId={household.id} 
              isCreator={currentUserIsCreator} 
            />

            {/* Bills Section */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Bills</CardTitle>
                <CardDescription>Track rent payments and bill splits</CardDescription>
              </CardHeader>
              <CardContent>
                {bills.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">No bills created yet</p>
                    {currentUserIsCreator && (
                      <p className="text-sm text-gray-500">Create your first monthly bill to start tracking payments</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bills.map((bill) => (
                      <div key={bill.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{bill.month_year}</h3>
                            <p className="text-sm text-gray-600">
                              Due: {new Date(bill.due_date).toLocaleDateString()} • 
                              Total: ${Number(bill.total_amount).toLocaleString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            bill.status === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {bill.status}
                          </span>
                        </div>
                        
                        {bill.bill_splits && bill.bill_splits.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-700">Payment Splits:</h4>
                            {bill.bill_splits.map((split) => {
                              const member = members.find(m => m.user_id === split.user_id);
                              return (
                                <div key={split.id} className="flex items-center justify-between text-sm">
                                  <span>{member?.display_name || 'Unknown'}</span>
                                  <div className="flex items-center space-x-2">
                                    <span>${Number(split.amount).toLocaleString()}</span>
                                    <span className={`px-2 py-1 rounded text-xs ${
                                      split.status === 'paid' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                      {split.status}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Members List */}
            <Card>
              <CardHeader>
                <CardTitle>Household Members</CardTitle>
                <CardDescription>{members.length} member(s)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{member.display_name}</p>
                        <p className="text-sm text-gray-600 truncate">{member.email}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${
                        member.role === 'resident' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Management Tools for Creator */}
            {currentUserIsCreator && (
              <>
                <OverduePaymentNotifier 
                  householdId={household.id} 
                  isCreator={currentUserIsCreator} 
                />
                
                <HouseholdDeletionScheduler 
                  householdId={household.id}
                  householdName={household.name}
                  isCreator={currentUserIsCreator}
                  scheduledForDeletion={household.scheduled_for_deletion}
                  deletionReason={household.deletion_reason}
                  deletionScheduledAt={household.deletion_scheduled_at}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <InviteResidentModal
        householdId={household.id}
        householdName={household.name}
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />

      <LeaveHouseholdModal
        householdId={household.id}
        householdName={household.name}
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onLeave={() => navigate('/dashboard')}
      />
    </div>
  );
};

export default HouseholdDetail;
