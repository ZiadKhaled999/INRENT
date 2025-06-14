
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Home, Users, DollarSign } from "lucide-react";

interface Household {
  id: string;
  name: string;
  rent_amount: number;
  due_day: number;
  member_count: number;
}

const JoinHousehold = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [household, setHousehold] = useState<Household | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (id) {
      fetchHousehold();
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.user_metadata?.full_name || user.email?.split('@')[0] || '');
    }
  }, [user]);

  const fetchHousehold = async () => {
    try {
      const { data, error } = await supabase
        .from('households')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Get member count
      const { count } = await supabase
        .from('household_members')
        .select('*', { count: 'exact', head: true })
        .eq('household_id', id);

      setHousehold({
        ...data,
        member_count: count || 0
      });
    } catch (error: any) {
      console.error('Error fetching household:', error);
      toast({
        title: "Failed to load household",
        description: "This invitation may be invalid or expired.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const joinHousehold = async () => {
    if (!household || !user || !displayName) return;

    setJoining(true);
    try {
      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('household_members')
        .select('id')
        .eq('household_id', household.id)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        toast({
          title: "Already a member",
          description: "You're already a member of this household.",
        });
        navigate(`/household/${household.id}`);
        return;
      }

      // Add user as member
      const { error } = await supabase
        .from('household_members')
        .insert({
          household_id: household.id,
          user_id: user.id,
          display_name: displayName,
          email: user.email || ''
        });

      if (error) throw error;

      toast({
        title: "Welcome to the household!",
        description: `You've successfully joined ${household.name}.`,
      });

      navigate(`/household/${household.id}`);
    } catch (error: any) {
      console.error('Error joining household:', error);
      toast({
        title: "Failed to join household",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (!household) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invitation</h2>
            <p className="text-gray-600 mb-6">This invitation link is invalid or has expired.</p>
            <Button onClick={() => navigate('/')}>
              Go to Rentable
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg mx-auto mb-4"></div>
            <CardTitle className="text-2xl">Join {household.name}</CardTitle>
            <CardDescription>You need to create an account to join this household</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">Rent</p>
                <p className="font-semibold">${household.rent_amount.toLocaleString()}</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">Members</p>
                <p className="font-semibold">{household.member_count}</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Home className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-sm text-gray-600">Due</p>
                <p className="font-semibold">{household.due_day}th</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/register')}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                Sign Up to Join
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Already have an account? Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg mx-auto mb-4"></div>
          <CardTitle className="text-2xl">Join {household.name}</CardTitle>
          <CardDescription>Complete your profile to join this household</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Monthly Rent</p>
              <p className="font-semibold">${household.rent_amount.toLocaleString()}</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Current Members</p>
              <p className="font-semibold">{household.member_count}</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Home className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Due Day</p>
              <p className="font-semibold">{household.due_day}th</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Your Display Name</Label>
            <Input
              id="displayName"
              placeholder="How should others see your name?"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="h-11"
            />
          </div>

          <Button 
            onClick={joinHousehold}
            disabled={joining || !displayName}
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
          >
            {joining ? "Joining..." : "Join Household"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinHousehold;
