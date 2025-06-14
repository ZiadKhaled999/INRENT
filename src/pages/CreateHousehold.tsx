
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const CreateHousehold = () => {
  const [householdName, setHouseholdName] = useState('');
  const [rentAmount, setRentAmount] = useState('');
  const [dueDay, setDueDay] = useState('1');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a household.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create household
      const { data: household, error: householdError } = await supabase
        .from('households')
        .insert({
          name: householdName,
          rent_amount: parseFloat(rentAmount),
          due_day: parseInt(dueDay),
          created_by: user.id,
        })
        .select()
        .single();

      if (householdError) {
        throw householdError;
      }

      // Add creator as first member
      const { error: memberError } = await supabase
        .from('household_members')
        .insert({
          household_id: household.id,
          user_id: user.id,
          display_name: user.user_metadata?.full_name || user.email || 'User',
          email: user.email || '',
        });

      if (memberError) {
        throw memberError;
      }

      toast({
        title: "Household created!",
        description: `${householdName} has been created successfully.`,
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating household:', error);
      toast({
        title: "Failed to create household",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Household</h1>
          <p className="text-gray-600">Set up your household to start splitting rent fairly</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Household Details</CardTitle>
            <CardDescription className="text-center">
              Provide the basic information about your household
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="householdName">Household Name</Label>
                <Input
                  id="householdName"
                  type="text"
                  placeholder="e.g., Downtown Apartment, College House"
                  value={householdName}
                  onChange={(e) => setHouseholdName(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rentAmount">Monthly Rent Amount ($)</Label>
                <Input
                  id="rentAmount"
                  type="number"
                  placeholder="2500"
                  value={rentAmount}
                  onChange={(e) => setRentAmount(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDay">Rent Due Day (of each month)</Label>
                <Input
                  id="dueDay"
                  type="number"
                  value={dueDay}
                  onChange={(e) => setDueDay(e.target.value)}
                  required
                  min="1"
                  max="28"
                  className="h-11"
                />
                <p className="text-sm text-gray-500">Choose a day between 1-28 to avoid month-end issues</p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 h-11"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Household"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateHousehold;
