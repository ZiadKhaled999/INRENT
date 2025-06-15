
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

  // Helper function to extract token from the invite link
  const extractToken = (link: string) => {
    try {
      // Remove any trailing slashes and whitespace
      const cleanLink = link.trim().replace(/\/$/, '');
      
      // Check if it's a valid URL format with token parameter
      if (cleanLink.includes('/join?token=') || cleanLink.includes('/join&token=')) {
        const url = new URL(cleanLink);
        const token = url.searchParams.get('token');
        
        if (token && token.length >= 16) { // Ensure token has minimum length
          return token;
        }
      }
      
      // Also handle direct token input
      if (cleanLink.length >= 16 && /^[A-Za-z0-9]+$/.test(cleanLink)) {
        return cleanLink;
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
        description: "Please paste the invitation link or token.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    try {
      // Extract token from the link
      const token = extractToken(inviteLink);
      
      if (!token) {
        toast({
          title: "Invalid link",
          description: "The invitation link appears to be invalid or malformed.",
          variant: "destructive",
        });
        setProcessing(false);
        return;
      }

      // Navigate to the join page with the extracted token
      navigate(`/join?token=${token}`);
      
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
          <Label htmlFor="inviteLink">Invitation Link or Token</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="inviteLink"
                placeholder="Paste the invitation link or token here..."
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
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            The invitation link should look like: <code className="bg-gray-100 px-1 rounded text-xs">https://yoursite.com/join?token=ABC123...</code>
          </p>
          <p className="text-xs text-gray-500">
            🔒 All invitation links are secure and expire after 7 days
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default JoinHouseholdForm;
