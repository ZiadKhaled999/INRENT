
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Home, DollarSign, Calendar, Plus, Users, Trash } from "lucide-react";
import { useNavigate } from 'react-router-dom';
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
  const { toast } = useToast();
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && user?.id) {
      fetchRenterData();
    } else if (!authLoading && !user) {
      navigate('/login');
    }
    // eslint-disable-next-line
  }, [user, authLoading, navigate]);

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

      // If there are no residents, delete immediately
      if (household.resident_count === 0) {
        await deleteHousehold(householdId);
        return;
      }

      // If there are residents, check payment conditions
      // 1. Check for any running/pending bills for the household
      const { data: bills, error: billsError } = await supabase
        .from('bills')
        .select('id, status')
        .eq('household_id', householdId);

      if (billsError) throw billsError;

      const hasPending = bills && bills.some((bill) => (bill.status || '').toLowerCase() === 'pending');

      if (hasPending) {
        toast({
          title: "Cannot delete property",
          description: "There is an active or unpaid rent month. Please make sure all rent is paid before deleting this property.",
          variant: "destructive",
        });
        setDeleting(false);
        setDeleteTargetId(null);
        return;
      }

      // 2. Check all splits are paid
      if (bills && bills.length > 0) {
        const billIds = bills.map(b => b.id);
        const { data: allSplits, error: splitsError } = await supabase
          .from('bill_splits')
          .select('id,status')
          .in('bill_id', billIds);

        if (splitsError) throw splitsError;

        const unpaidSplits = allSplits?.some(split => split.status !== 'paid');
        if (unpaidSplits) {
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

      // If all conditions are met, proceed with deletion
      await deleteHousehold(householdId);

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

  const deleteHousehold = async (householdId: string) => {
    try {
      console.log('Deleting household:', householdId);
      
      // Delete the household (cascades will handle members, bills, etc.)
      const { error: deleteError } = await supabase
        .from('households')
        .delete()
        .eq('id', householdId);

      if (deleteError) {
        console.error('Delete error:', deleteError);
        throw deleteError;
      }

      console.log('Household deleted successfully');
      
      toast({
        title: "Property deleted",
        description: "The household and all related data have been deleted.",
        variant: "default",
      });
      
      // Reset delete state
      setDeleteTargetId(null);
      setDeleting(false);
      
      // Immediately refresh the data to update the UI
      await fetchRenterData();
      
    } catch (error: any) {
      console.error('Error in deleteHousehold:', error);
      setDeleting(false);
      throw error;
    }
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Renter Dashboard</h1>
                <p className="text-gray-600">Manage your rental properties</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => navigate('/create-household')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Household
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
                                    {deleting ? 'Deleting...' : 'Yes, Delete'}
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
