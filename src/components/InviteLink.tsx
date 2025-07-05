
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share, Shield, Calendar } from "lucide-react";

interface InviteLinkProps {
  householdId: string;
  householdName: string;
  inviteToken: string; // Now required
}

const InviteLink = ({ householdId, householdName, inviteToken }: InviteLinkProps) => {
  const { toast } = useToast();

  // Use a real, generated invitation token, not a placeholder
  const inviteUrl = `${window.location.origin}/join?token=${inviteToken}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast({
        title: "Link copied!",
        description: "Secure invite link has been copied to clipboard.",
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

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${householdName} on InRent`,
          text: `You've been invited to join ${householdName} for rent splitting!`,
          url: inviteUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={inviteUrl}
          readOnly
          className="flex-1"
        />
        <Button variant="outline" onClick={copyToClipboard}>
          <Copy className="w-4 h-4" />
        </Button>
        <Button variant="outline" onClick={shareLink}>
          <Share className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Shield className="w-4 h-4 text-green-600" />
          <span>Secure Token</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>7-Day Expiry</span>
        </div>
      </div>

      <p className="text-sm text-gray-600">
        Share this secure link with roommates. Each link is unique, expires automatically, and can only be used once for security.
      </p>
    </div>
  );
};

export default InviteLink;
