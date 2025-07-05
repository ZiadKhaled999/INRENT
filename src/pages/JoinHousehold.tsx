
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Home, Users, DollarSign, Calendar, Shield, CheckCircle } from "lucide-react";

interface InvitationDetails {
  valid: boolean;
  invitation_id?: string;
  household_id?: string;
  household_name?: string;
  rent_amount?: number;
  due_day?: number;
  invited_email?: string;
  created_by_name?: string;
  created_by_email?: string;
  expires_at?: string;
  error?: string;
}

// Type guard to check if an object is InvitationDetails
function isInvitationDetails(obj: any): obj is InvitationDetails {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.valid === 'boolean' &&
    (obj.valid
      ? typeof obj.household_id === 'string'
      : typeof obj.error === 'string')
  );
}

// Type guard to check for Join response shape
function isJoinResponse(obj: any): obj is { success: boolean; household_id?: string; error?: string } {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.success === 'boolean'
  );
}

const JoinHousehold = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [invitationDetails, setInvitationDetails] = useState<InvitationDetails | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setInvitationDetails({
        valid: false,
        error: 'No invitation token provided'
      });
      return;
    }
    validateInvitation();
  }, [token]);

  const validateInvitation = async () => {
    if (!token) return;

    try {
      setLoading(true);
      console.log('Validating invitation token:', token);

      // Use the secure validation function
      const { data, error } = await supabase.rpc('validate_invitation_token', { invitation_token: token });

      if (error) {
        console.error('Error validating invitation:', error);
        throw error;
      }

      // Type guard for returned data shape
      if (isInvitationDetails(data)) {
        setInvitationDetails(data);
        // Pre-fill display name with user's name if available and invitation is valid
        if (user && data.valid) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();

          if (profile?.full_name) {
            setDisplayName(profile.full_name);
          }
        }
      } else {
        setInvitationDetails({
          valid: false,
          error: 'Unexpected server response'
        });
      }

    } catch (error: any) {
      console.error('Error validating invitation:', error);
      setInvitationDetails({
        valid: false,
        error: error.message || 'Failed to validate invitation'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinHousehold = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to join a household.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!displayName.trim()) {
      toast({
        title: "Display name required",
        description: "Please enter your display name.",
        variant: "destructive",
      });
      return;
    }

    if (!token || !invitationDetails?.valid) {
      toast({
        title: "Invalid invitation",
        description: "This invitation is not valid.",
        variant: "destructive",
      });
      return;
    }

    setJoining(true);

    try {
      console.log('Using invitation token:', token);

      // Use the secure join function
      const { data, error } = await supabase.rpc('use_invitation_token', {
        invitation_token: token,
        user_id: user.id,
        display_name: displayName.trim()
      });

      if (error) {
        console.error('Error joining household:', error);
        throw error;
      }

      if (isJoinResponse(data)) {
        if (!data.success) {
          toast({
            title: "Failed to join household",
            description: data.error || 'Unknown error occurred',
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Welcome to the household!",
          description: "You have successfully joined the household.",
        });

        // Navigate to the household dashboard
        navigate(`/household/${data.household_id}`);
      } else {
        toast({
          title: "Unexpected response",
          description: "The join response was not recognized. Please contact support.",
          variant: "destructive",
        });
      }

    } catch (error: any) {
      console.error('Error joining household:', error);
      toast({
        title: "Failed to join household",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg mx-auto mb-4"></div>
            <p className="text-gray-600">Validating invitation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invitationDetails?.valid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-red-600">Invalid Invitation</CardTitle>
            <CardDescription>
              {invitationDetails?.error || 'This invitation link is not valid or has expired.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate('/')} variant="outline" className="w-full">
              Go to InRent
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Need a valid invite link? Ask your renter to share the correct household invitation link.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Home className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Join Household</CardTitle>
          <CardDescription>
            You've been invited to join <strong>{invitationDetails.household_name}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Household Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900">Household Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span>Rent: ${Number(invitationDetails.rent_amount).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>Due: {invitationDetails.due_day}th</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span>Invited by: {invitationDetails.created_by_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-500" />
                <span>Expires: {new Date(invitationDetails.expires_at!).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Display Name Input */}
          <div className="space-y-2">
            <Label htmlFor="displayName">Your Display Name</Label>
            <Input
              id="displayName"
              placeholder="Enter your name as it will appear to other residents"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Join Button */}
          <Button 
            onClick={handleJoinHousehold}
            disabled={joining || !displayName.trim()}
            className="w-full h-11 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            {joining ? (
              "Joining..."
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Join {invitationDetails.household_name}
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By joining, you agree to split rent and expenses as agreed upon by the household members.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinHousehold;
