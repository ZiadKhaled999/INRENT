
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy, UserPlus, Mail, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import InviteLink from "./InviteLink";

interface InviteResidentModalProps {
  householdId: string;
  householdName: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const InviteResidentModal: React.FC<InviteResidentModalProps> = ({ 
  householdId, 
  householdName, 
  isOpen, 
  onClose 
}) => {
  const [email, setEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [inviteToken, setInviteToken] = useState('');
  const [inviteLinkReady, setInviteLinkReady] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Use controlled open state if provided, otherwise use internal state
  const modalOpen = isOpen !== undefined ? isOpen : open;
  const setModalOpen = onClose !== undefined ? (value: boolean) => {
    if (!value) onClose();
  } : setOpen;

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
      // Generate a secure token using the database function
      const { data: tokenResult, error: tokenError } = await supabase
        .rpc('generate_invitation_token');

      if (tokenError) throw tokenError;

      const token = tokenResult;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

      // Save invitation to database with the secure token
      const { error } = await supabase
        .from('household_invitations')
        .insert({
          household_id: householdId,
          created_by: (await supabase.auth.getUser()).data.user?.id,
          email: email.trim(),
          token: token,
          expires_at: expiresAt.toISOString(),
          max_uses: 1,
          is_active: true
        });

      if (error) throw error;

      setInviteToken(token);
      setInviteLinkReady(true);

      toast({
        title: "Invitation generated!",
        description: "Share this secure link with the resident to join your household.",
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

  const resetForm = () => {
    setEmail('');
    setInviteToken('');
    setInviteLinkReady(false);
  };

  return (
    <Dialog open={modalOpen} onOpenChange={(newOpen) => {
      setModalOpen(newOpen);
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

          {!inviteLinkReady ? (
            <Button 
              onClick={generateInviteLink}
              disabled={isGenerating}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              {isGenerating ? "Generating..." : "Generate Secure Invitation Link"}
            </Button>
          ) : (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>Invitation for: {email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>🔒 Secure Token: {inviteToken?.substring(0, 8)}...</span>
                    <span>📅 Expires in 7 days</span>
                  </div>
                  {/* Show the actual InviteLink component with the real inviteToken */}
                  <InviteLink
                    householdId={householdId}
                    householdName={householdName}
                    inviteToken={inviteToken}
                  />
                  <div className="flex gap-2 mt-2">
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
