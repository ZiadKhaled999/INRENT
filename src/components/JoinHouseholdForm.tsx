
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Home, Link } from "lucide-react";

const JoinHouseholdForm = () => {
  const [inviteLink, setInviteLink] = useState('');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Helper function to extract household ID from the invite link
  const extractHouseholdId = (link: string) => {
    try {
      // Remove any trailing slashes and whitespace
      const cleanLink = link.trim().replace(/\/$/, '');
      
      // Check if it's a valid URL format
      if (cleanLink.includes('/join/')) {
        const parts = cleanLink.split('/join/');
        if (parts.length === 2) {
          const householdId = parts[1];
          // Validate UUID format
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
          if (uuidRegex.test(householdId)) {
            return householdId;
          }
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const handleJoinHousehold = async () => {
    if (!inviteLink.trim()) {
      toast({
        title: "Link required",
        description: "Please paste the invitation link.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    try {
      // Extract household ID from the link
      const householdId = extractHouseholdId(inviteLink);
      
      if (!householdId) {
        toast({
          title: "Invalid link",
          description: "The invitation link appears to be invalid or malformed.",
          variant: "destructive",
        });
        setProcessing(false);
        return;
      }

      // Navigate to the join household page with the extracted ID
      navigate(`/join/${householdId}`);
      
    } catch (error) {
      console.error('Error processing invite link:', error);
      toast({
        title: "Error",
        description: "Failed to process the invitation link.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Home className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Join a Household</CardTitle>
            <CardDescription>
              Paste the invitation link from your renter to join their household
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="inviteLink">Invitation Link</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="inviteLink"
                placeholder="Paste the invitation link here..."
                value={inviteLink}
                onChange={(e) => setInviteLink(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={handleJoinHousehold}
              disabled={processing || !inviteLink.trim()}
              className="px-6"
            >
              {processing ? "Processing..." : "Join"}
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          The invitation link should look like: <code className="bg-gray-100 px-1 rounded text-xs">https://yoursite.com/join/household-id</code>
        </p>
      </CardContent>
    </Card>
  );
};

export default JoinHouseholdForm;
