
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Home, DollarSign, Calendar, Plus, Users, Trash } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import AppLogoWithBg from "@/components/AppLogoWithBg";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import RenterDashboardHeader from '@/components/renter/DashboardHeader';

interface Household {
  id: string;
  name: string;
  rent_amount: number;
  due_day: number;
  created_at: string;
  resident_count: number;
}

const RenterDashboard = () => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && user?.id) {
      fetchRenterData();
      fetchUserProfile();
    } else if (!authLoading && !user) {
      navigate('/login');
    }
    // eslint-disable-next-line
  }, [user, authLoading, navigate]);

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

  const fetchRenterData = async () => {
    if (!user?.id) {
      console.error('User ID is not available');
      return;
    }
    setLoading(true);
    try {
      // Fetch households created by this renter and count only residents (exclude renter)
      const { data: householdsData, error: householdsError } = await supabase
        .from('households')
        .select(`
          id,
          name,
          rent_amount,
          due_day,
          created_at,
          household_members!inner (
            user_id,
            role
          )
        `)
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (householdsError) {
        console.error('Error fetching households:', householdsError);
        throw householdsError;
      }

      console.log('Households data:', householdsData);
      
      // Transform data to include only resident count (exclude renter)
      const transformedHouseholds = householdsData?.map(household => {
        // Count only residents, exclude the renter (created_by user)
        const residentCount = household.household_members?.filter(member => 
          member.user_id !== user.id && member.role === 'resident'
        ).length || 0;
        
        return {
          ...household,
          resident_count: residentCount
        };
      }) || [];

      setHouseholds(transformedHouseholds);

    } catch (error: any) {
      console.error('Error fetching renter data:', error);
      toast({
        title: "Failed to load dashboard",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalRentCollected = households.reduce((sum, h) => sum + Number(h.rent_amount), 0);

  const handleDeleteProperty = (household: Household) => {
    setDeleteTargetId(household.id);
  };

  const sendDeletionNotifications = async (householdId: string, householdName: string) => {
    try {
      // Get all residents in the household
      const { data: residents, error: residentsError } = await supabase
        .from('household_members')
        .select('user_id, display_name')
        .eq('household_id', householdId)
        .eq('role', 'resident');

      if (residentsError) throw residentsError;

      if (residents && residents.length > 0) {
        // Create notifications for all residents
        const notifications = residents.map(resident => ({
          user_id: resident.user_id,
          type: 'property_deleted',
          title: 'Property Deleted',
          message: `The property "${householdName}" has been deleted by the renter on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}.`,
          read: false
        }));

        const { error: notificationError } = await supabase
          .from('notifications')
          .insert(notifications);

        if (notificationError) {
          console.error('Error creating notifications:', notificationError);
        } else {
          console.log('Deletion notifications sent to residents');
        }
      }
    } catch (error: any) {
      console.error('Error sending deletion notifications:', error);
    }
  };

  const sendFailureNotifications = async (householdId: string, householdName: string, reason: string) => {
    try {
      // Get all residents in the household
      const { data: residents, error: residentsError } = await supabase
        .from('household_members')
        .select('user_id, display_name')
        .eq('household_id', householdId)
        .eq('role', 'resident');

      if (residentsError) throw residentsError;

      if (residents && residents.length > 0) {
        // Create failure notifications for all residents
        const notifications = residents.map(resident => ({
          user_id: resident.user_id,
          type: 'deletion_failed',
          title: 'Property Deletion Failed',
          message: `The renter attempted to delete the property "${householdName}" but failed due to ${reason}. The property remains active.`,
          read: false
        }));

        const { error: notificationError } = await supabase
          .from('notifications')
          .insert(notifications);

        if (notificationError) {
          console.error('Error creating failure notifications:', notificationError);
        } else {
          console.log('Deletion failure notifications sent to residents');
        }
      }
    } catch (error: any) {
      console.error('Error sending failure notifications:', error);
    }
  };

  const confirmDelete = async (householdId: string) => {
    setDeleting(true);
    try {
      // Find the household to check resident count
      const household = households.find(h => h.id === householdId);
      
      if (!household) {
        toast({
          title: "Error",
          description: "Household not found.",
          variant: "destructive",
        });
        setDeleting(false);
        setDeleteTargetId(null);
        return;
      }

      // If there are residents, check payment conditions first
      if (household.resident_count > 0) {
        // Check payment conditions
        const { data: bills, error: billsError } = await supabase
          .from('bills')
          .select('id, status')
          .eq('household_id', householdId);

        if (billsError) throw billsError;

        const hasPending = bills && bills.some((bill) => (bill.status || '').toLowerCase() === 'pending');

        if (hasPending) {
          // Send failure notification to residents
          await sendFailureNotifications(householdId, household.name, 'active or unpaid rent');
          
          toast({
            title: "Cannot delete property",
            description: "There is an active or unpaid rent month. Please make sure all rent is paid before deleting this property.",
            variant: "destructive",
          });
          setDeleting(false);
          setDeleteTargetId(null);
          return;
        }

        // Check all splits are paid
        if (bills && bills.length > 0) {
          const billIds = bills.map(b => b.id);
          const { data: allSplits, error: splitsError } = await supabase
            .from('bill_splits')
            .select('id,status')
            .in('bill_id', billIds);

          if (splitsError) throw splitsError;

          const unpaidSplits = allSplits?.some(split => split.status !== 'paid');
          if (unpaidSplits) {
            // Send failure notification to residents
            await sendFailureNotifications(householdId, household.name, 'unpaid rent splits');
            
            toast({
              title: "Cannot delete property",
              description: "Not all residents have paid their rent. Please wait until all splits are paid.",
              variant: "destructive",
            });
            setDeleting(false);
            setDeleteTargetId(null);
            return;
          }
        }
      }

      // If all conditions are met, proceed with deletion and send success notifications
      await deleteHousehold(householdId, household.name);

    } catch (error: any) {
      toast({
        title: "Failed to delete property",
        description: error.message,
        variant: "destructive"
      });
      setDeleteTargetId(null);
      setDeleting(false);
    }
  };

  const deleteHousehold = async (householdId: string, householdName: string) => {
    try {
      console.log('Starting deletion process for household:', householdId);
      
      // First, manually delete all related data in the correct order to ensure complete deletion
      
      // 1. Delete bill splits first
      console.log('Deleting bill splits...');
      const { data: bills } = await supabase
        .from('bills')
        .select('id')
        .eq('household_id', householdId);
      
      if (bills && bills.length > 0) {
        const billIds = bills.map(b => b.id);
        const { error: splitsError } = await supabase
          .from('bill_splits')
          .delete()
          .in('bill_id', billIds);
        
        if (splitsError) {
          console.error('Error deleting bill splits:', splitsError);
          throw splitsError;
        }
        console.log('Bill splits deleted successfully');
      }
      
      // 2. Delete bills
      console.log('Deleting bills...');
      const { error: billsError } = await supabase
        .from('bills')
        .delete()
        .eq('household_id', householdId);
      
      if (billsError) {
        console.error('Error deleting bills:', billsError);
        throw billsError;
      }
      console.log('Bills deleted successfully');
      
      // 3. Delete household invitations
      console.log('Deleting household invitations...');
      const { error: invitationsError } = await supabase
        .from('household_invitations')
        .delete()
        .eq('household_id', householdId);
      
      if (invitationsError) {
        console.error('Error deleting invitations:', invitationsError);
        throw invitationsError;
      }
      console.log('Household invitations deleted successfully');
      
      // 4. Send deletion notifications BEFORE deleting members (so we can still get the residents list)
      console.log('Sending deletion notifications...');
      await sendDeletionNotifications(householdId, householdName);
      
      // 5. Delete household members
      console.log('Deleting household members...');
      const { error: membersError } = await supabase
        .from('household_members')
        .delete()
        .eq('household_id', householdId);
      
      if (membersError) {
        console.error('Error deleting members:', membersError);
        throw membersError;
      }
      console.log('Household members deleted successfully');
      
      // 6. Finally, delete the household itself
      console.log('Deleting household...');
      const { error: deleteError } = await supabase
        .from('households')
        .delete()
        .eq('id', householdId);

      if (deleteError) {
        console.error('Error deleting household:', deleteError);
        throw deleteError;
      }

      console.log('Household deleted successfully from database');
      
      // Update the UI state to remove the deleted household
      setHouseholds(prev => {
        const updated = prev.filter(h => h.id !== householdId);
        console.log('Updated households state, remaining:', updated.length);
        return updated;
      });
      
      toast({
        title: "Property deleted",
        description: "The household and all related data have been permanently deleted. Residents have been notified.",
        variant: "default",
      });
      
      // Reset delete state
      setDeleteTargetId(null);
      setDeleting(false);
      
      // Force a refresh of the data to ensure consistency
      console.log('Refreshing data after deletion...');
      await fetchRenterData();
      
    } catch (error: any) {
      console.error('Error in deleteHousehold:', error);
      
      // If there was an error, refresh the data to show the current state
      await fetchRenterData();
      
      toast({
        title: "Failed to delete property",
        description: error.message,
        variant: "destructive"
      });
      
      setDeleting(false);
      setDeleteTargetId(null);
    }
  };

  // Show loading while auth is loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AppLogoWithBg size={60} />
          <p className="text-gray-600 mt-4">Loading your dashboard...</p>
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
      <RenterDashboardHeader userProfile={userProfile} />

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{households.length}</p>
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
                  <p className="text-sm text-gray-600">Total Monthly Rent</p>
                  <p className="text-2xl font-bold text-gray-900">${totalRentCollected.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Residents</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {households.reduce((sum, h) => sum + h.resident_count, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Properties */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Properties</CardTitle>
                <CardDescription>Rental properties you manage</CardDescription>
              </div>
              <Button onClick={() => navigate('/create-household')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {households.length === 0 ? (
              <div className="text-center py-12">
                <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties yet</h3>
                <p className="text-gray-600 mb-6">Create your first household to start managing rent splits</p>
                <Button onClick={() => navigate('/create-household')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Property
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {households.map((household) => (
                  <div key={household.id} className="relative group">
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => navigate(`/household/${household.id}`)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-lg">{household.name}</h3>
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Home className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly Rent:</span>
                            <span className="font-medium">${household.rent_amount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Due Date:</span>
                            <span className="font-medium">{household.due_day}th</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Residents:</span>
                            <span className="font-medium">{household.resident_count}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Created:</span>
                            <span className="font-medium">
                              {new Date(household.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t flex gap-2">
                          <Button variant="outline" className="w-full" size="sm">
                            Manage Property
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="icon"
                                disabled={deleting}
                                className="ml-2"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleDeleteProperty(household);
                                }}
                                aria-label="Delete property"
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            {deleteTargetId === household.id && (
                              <AlertDialogContent onClick={e => e.stopPropagation()}>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Property</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {household.resident_count === 0 ? (
                                      <>
                                        Are you sure you want to delete <span className="font-bold">{household.name}</span>?<br />
                                        This action cannot be undone and all data will be permanently deleted.
                                      </>
                                    ) : (
                                      <>
                                        This property has <span className="font-bold">{household.resident_count} resident(s)</span>. 
                                        Deleting it will permanently remove all data including resident information, payment history, and bills.<br /><br />
                                        <span className="text-orange-600 font-medium">All residents will be notified only if the deletion succeeds.</span><br /><br />
                                        Are you sure you want to permanently delete <span className="font-bold">{household.name}</span>?
                                      </>
                                    )}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel
                                    disabled={deleting}
                                    onClick={() => setDeleteTargetId(null)}
                                  >
                                    No, Keep It
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    disabled={deleting}
                                    onClick={() => confirmDelete(household.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    {deleting ? 'Deleting...' : 'Yes, Delete Property'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            )}
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
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

export default RenterDashboard;
