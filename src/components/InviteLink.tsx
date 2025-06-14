
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share } from "lucide-react";

interface InviteLinkProps {
  householdId: string;
  householdName: string;
}

const InviteLink = ({ householdId, householdName }: InviteLinkProps) => {
  const { toast } = useToast();
  const inviteUrl = `${window.location.origin}/join/${householdId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast({
        title: "Link copied!",
        description: "Invite link has been copied to clipboard.",
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
          title: `Join ${householdName} on Rentable`,
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
    <div className="space-y-3">
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
      <p className="text-sm text-gray-600">
        Share this link with roommates to invite them to join the household. No signup required initially!
      </p>
    </div>
  );
};

export default InviteLink;
