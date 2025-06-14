
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Home, DollarSign, Calendar, Plus, Users } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface Household {
  id: string;
  name: string;
  rent_amount: number;
  due_day: number;
  created_at: string;
  member_count: number;
}

const RenterDashboard = () => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRenterData();
  }, []);

  const fetchRenterData = async () => {
    try {
      // Fetch households created by this renter
      const { data: householdsData, error: householdsError } = await supabase
        .from('households')
        .select(`
          id,
          name,
          rent_amount,
          due_day,
          created_at,
          household_members (count)
        `)
        .eq('created_by', user?.id)
        .order('created_at', { ascending: false });

      if (householdsError) throw householdsError;

      // Transform data to include member count
      const transformedHouseholds = householdsData?.map(household => ({
        ...household,
        member_count: household.household_members?.[0]?.count || 0
      })) || [];

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
                    {households.reduce((sum, h) => sum + h.member_count, 0)}
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
                  <Card key={household.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => navigate(`/household/${household.id}`)}>
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
                          <span className="font-medium">{household.member_count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created:</span>
                          <span className="font-medium">
                            {new Date(household.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <Button variant="outline" className="w-full" size="sm">
                          Manage Property
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
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
