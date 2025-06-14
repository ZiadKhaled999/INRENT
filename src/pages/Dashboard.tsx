
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Home, Users, DollarSign, Calendar } from "lucide-react";

interface Household {
  id: string;
  name: string;
  rent_amount: number;
  due_day: number;
  created_at: string;
  member_count?: number;
}

const Dashboard = () => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (user) {
      fetchHouseholds();
    }
  }, [user]);

  const fetchHouseholds = async () => {
    try {
      // Fetch households where user is a member
      const { data, error } = await supabase
        .from('household_members')
        .select(`
          household_id,
          households (
            id,
            name,
            rent_amount,
            due_day,
            created_at
          )
        `)
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      // Extract household data and get member counts
      const householdData = data?.map(item => item.households).filter(Boolean) || [];
      
      // Get member counts for each household
      const householdsWithCounts = await Promise.all(
        householdData.map(async (household: any) => {
          const { count } = await supabase
            .from('household_members')
            .select('*', { count: 'exact', head: true })
            .eq('household_id', household.id);
          
          return {
            ...household,
            member_count: count || 0
          };
        })
      );

      setHouseholds(householdsWithCounts);
    } catch (error: any) {
      console.error('Error fetching households:', error);
      toast({
        title: "Failed to load households",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg"></div>
              <span className="text-2xl font-bold text-gray-900">Rentable</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.user_metadata?.full_name || user?.email}</span>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your households and rent splits</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Households</p>
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
                  <p className="text-2xl font-bold text-gray-900">
                    ${households.reduce((sum, h) => sum + h.rent_amount, 0).toLocaleString()}
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
                  <p className="text-sm text-gray-600">Next Due Date</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {households.length > 0 ? `${Math.min(...households.map(h => h.due_day))}th` : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Households */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Your Households</h2>
          <Button 
            onClick={() => navigate('/create-household')}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Household
          </Button>
        </div>

        {households.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No households yet</h3>
              <p className="text-gray-600 mb-6">Create your first household to start splitting rent with your roommates</p>
              <Button 
                onClick={() => navigate('/create-household')}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Household
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {households.map((household) => (
              <Card key={household.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Home className="w-5 h-5 text-blue-600" />
                    <span>{household.name}</span>
                  </CardTitle>
                  <CardDescription>
                    Created {new Date(household.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Monthly Rent</span>
                      <span className="font-semibold text-green-600">${household.rent_amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Due Day</span>
                      <span className="font-semibold">{household.due_day}th of each month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Members</span>
                      <span className="font-semibold">{household.member_count}</span>
                    </div>
                    <Button 
                      className="w-full mt-4"
                      variant="outline"
                      onClick={() => navigate(`/household/${household.id}`)}
                    >
                      Manage Household
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
