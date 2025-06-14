
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy, UserPlus, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface InviteResidentModalProps {
  householdId: string;
  householdName: string;
}

const InviteResidentModal = ({ householdId, householdName }: InviteResidentModalProps) => {
  const [email, setEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const generateInviteLink = async () => {
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address to generate an invitation.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Generate a unique token
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

      // Save invitation to database
      const { error } = await supabase
        .from('household_invitations')
        .insert({
          household_id: householdId,
          created_by: (await supabase.auth.getUser()).data.user?.id,
          email: email.trim(),
          token: token,
          expires_at: expiresAt.toISOString()
        });

      if (error) throw error;

      // Generate the invite link
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/join/${householdId}?token=${token}`;
      setInviteLink(link);

      toast({
        title: "Invitation generated!",
        description: "Share this link with the resident to join your household.",
      });
    } catch (error: any) {
      console.error('Error generating invite:', error);
      toast({
        title: "Failed to generate invitation",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast({
        title: "Copied!",
        description: "Invitation link copied to clipboard.",
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEmail('');
    setInviteLink('');
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) {
        resetForm();
      }
    }}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Resident
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Resident to {householdName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Resident's Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="resident@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
            />
          </div>

          {!inviteLink ? (
            <Button 
              onClick={generateInviteLink}
              disabled={isGenerating}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              {isGenerating ? "Generating..." : "Generate Invitation Link"}
            </Button>
          ) : (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>Invitation for: {email}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="text-sm text-gray-700 break-all">{inviteLink}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={copyToClipboard}
                      variant="outline"
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                    <Button 
                      onClick={resetForm}
                      variant="outline"
                      className="flex-1"
                    >
                      New Invitation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteResidentModal;
