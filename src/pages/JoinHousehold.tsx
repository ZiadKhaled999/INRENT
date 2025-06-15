
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Home, Users, DollarSign, CheckCircle } from "lucide-react";

interface Household {
  id: string;
  name: string;
  rent_amount: number;
  due_day: number;
  member_count: number;
  created_by: string;
}

const JoinHousehold = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [household, setHousehold] = useState<Household | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [alreadyMember, setAlreadyMember] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [invalidId, setInvalidId] = useState(false);

  // Helper function to validate UUID format
  const isValidUUID = (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  useEffect(() => {
    // If no ID is provided or ID is invalid, show error immediately
    if (!id) {
      console.log('No household ID provided');
      setInvalidId(true);
      setLoading(false);
      return;
    }
    
    if (!isValidUUID(id)) {
      console.log('Invalid household ID format:', id);
      setInvalidId(true);
      setLoading(false);
      return;
    }
    
    fetchHousehold();
  }, [id]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.user_metadata?.full_name || user.email?.split('@')[0] || '');
      if (id && isValidUUID(id)) {
        checkMembershipStatus();
      }
    }
  }, [user, id]);

  const fetchHousehold = async () => {
    if (!id || !isValidUUID(id)) {
      setInvalidId(true);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching household with ID:', id);
      
      // Fetch household data - make sure we're querying the correct table
      const { data: householdData, error: householdError } = await supabase
        .from('households')
        .select('id, name, rent_amount, due_day, created_by')
        .eq('id', id)
        .maybeSingle();

      console.log('Household query result:', { householdData, householdError });

      if (householdError) {
        console.error('Error fetching household:', householdError);
        throw householdError;
      }

      if (!householdData) {
        console.log('No household found with ID:', id);
        setHousehold(null);
        setLoading(false);
        return;
      }

      // Get member count
      const { count, error: countError } = await supabase
        .from('household_members')
        .select('*', { count: 'exact', head: true })
        .eq('household_id', id);

      if (countError) {
        console.error('Error fetching member count:', countError);
      }

      setHousehold({
        ...householdData,
        member_count: count || 0
      });

    } catch (error: any) {
      console.error('Error fetching household:', error);
      setHousehold(null);
      toast({
        title: "Failed to load household",
        description: "This household may not exist or the link is invalid.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkMembershipStatus = async () => {
    if (!user?.id || !id || !isValidUUID(id)) return;

    try {
      // Check if user is already a member
      const { data: existingMember, error: memberError } = await supabase
        .from('household_members')
        .select('id')
        .eq('household_id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (memberError) {
        console.error('Error checking membership:', memberError);
        return;
      }

      if (existingMember) {
        setAlreadyMember(true);
        return;
      }

      // Check if user has already sent a request
      const { data: existingRequest, error: requestError } = await supabase
        .from('notifications')
        .select('id')
        .eq('type', 'join_request')
        .ilike('message', `%${user.email}%`)
        .ilike('message', `%${id}%`)
        .maybeSingle();

      if (requestError) {
        console.error('Error checking existing requests:', requestError);
        return;
      }

      if (existingRequest) {
        setRequestSent(true);
      }
    } catch (error) {
      console.error('Error checking membership status:', error);
    }
  };

  const requestToJoin = async () => {
    if (!household || !user || !displayName) return;

    setRequesting(true);
    try {
      // Create a notification for the household creator
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: household.created_by,
          type: 'join_request',
          title: `New Join Request for ${household.name}`,
          message: `${displayName} (${user.email}) wants to join your household. Household ID: ${household.id}, User ID: ${user.id}, Display Name: ${displayName}`,
          read: false
        });

      if (notificationError) throw notificationError;

      setRequestSent(true);
      toast({
        title: "Request sent!",
        description: `Your request to join ${household.name} has been sent to the renter for approval.`,
      });

    } catch (error: any) {
      console.error('Error sending join request:', error);
      toast({
        title: "Failed to send request",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setRequesting(false);
    }
  };

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

  if (invalidId || (!household && !loading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Household Link</h2>
            <p className="text-gray-600 mb-6">
              {!id ? 
                "No household ID was provided in the link." :
                !isValidUUID(id) ? 
                  "This link appears to be invalid or malformed." : 
                  "This household doesn't exist or the link is invalid."
              }
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate('/')} className="w-full">
                Go to Rentable
              </Button>
              <p className="text-sm text-gray-500">
                Need a valid invite link? Ask your renter to share the correct household invitation link.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!household) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Household Not Found</h2>
            <p className="text-gray-600 mb-6">This household doesn't exist or the link is invalid.</p>
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

  if (alreadyMember) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Already a Member!</h2>
            <p className="text-gray-600 mb-6">You're already a member of {household.name}.</p>
            <Button onClick={() => navigate(`/household/${household.id}`)}>
              Go to Household
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requestSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h2>
            <p className="text-gray-600 mb-6">
              Your request to join {household.name} has been sent to the renter. 
              You'll be notified once they approve your request.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
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
          <CardTitle className="text-2xl">Request to Join {household.name}</CardTitle>
          <CardDescription>Complete your profile to request joining this household</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-blue-200 bg-blue-50">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              Your request will be sent to the renter for approval. You'll be notified once approved.
            </AlertDescription>
          </Alert>
          
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
            onClick={requestToJoin}
            disabled={requesting || !displayName}
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
          >
            {requesting ? "Sending Request..." : "Request to Join Household"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinHousehold;
