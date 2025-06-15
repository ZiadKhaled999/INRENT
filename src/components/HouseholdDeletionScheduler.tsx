
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Calendar, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

interface HouseholdDeletionSchedulerProps {
  householdId: string;
  householdName: string;
  isCreator: boolean;
  scheduledForDeletion?: boolean;
  deletionReason?: string;
  deletionScheduledAt?: string;
}

const HouseholdDeletionScheduler: React.FC<HouseholdDeletionSchedulerProps> = ({
  householdId,
  householdName,
  isCreator,
  scheduledForDeletion = false,
  deletionReason = '',
  deletionScheduledAt = ''
}) => {
  const [scheduling, setScheduling] = useState(false);
  const [reason, setReason] = useState('');
  const [isScheduled, setIsScheduled] = useState(scheduledForDeletion);
  const { toast } = useToast();

  useEffect(() => {
    setIsScheduled(scheduledForDeletion);
  }, [scheduledForDeletion]);

  const scheduleDeletion = async () => {
    if (!reason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for scheduling the deletion.",
        variant: "destructive",
      });
      return;
    }

    setScheduling(true);
    try {
      // Schedule household for deletion
      const { error: updateError } = await supabase
        .from('households')
        .update({
          scheduled_for_deletion: true,
          deletion_scheduled_at: new Date().toISOString(),
          deletion_reason: reason.trim()
        })
        .eq('id', householdId);

      if (updateError) throw updateError;

      // Get all residents to notify them
      const { data: residents, error: residentsError } = await supabase
        .from('household_members')
        .select('user_id, display_name')
        .eq('household_id', householdId)
        .eq('role', 'resident');

      if (residentsError) throw residentsError;

      // Send notifications to all residents
      if (residents && residents.length > 0) {
        const notifications = residents.map(resident => ({
          user_id: resident.user_id,
          type: 'household_deletion_scheduled',
          title: 'Household Deletion Scheduled',
          message: `The household "${householdName}" has been scheduled for deletion. Reason: ${reason.trim()}. The household will be deleted at the end of the current rent period.`,
          read: false
        }));

        const { error: notificationError } = await supabase
          .from('notifications')
          .insert(notifications);

        if (notificationError) throw notificationError;
      }

      setIsScheduled(true);
      setReason('');
      
      toast({
        title: "Deletion scheduled",
        description: `Household "${householdName}" has been scheduled for deletion. All residents have been notified.`,
      });
    } catch (error: any) {
      console.error('Error scheduling deletion:', error);
      toast({
        title: "Failed to schedule deletion",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setScheduling(false);
    }
  };

  const cancelDeletion = async () => {
    setScheduling(true);
    try {
      // Cancel deletion scheduling
      const { error: updateError } = await supabase
        .from('households')
        .update({
          scheduled_for_deletion: false,
          deletion_scheduled_at: null,
          deletion_reason: null
        })
        .eq('id', householdId);

      if (updateError) throw updateError;

      // Get all residents to notify them
      const { data: residents, error: residentsError } = await supabase
        .from('household_members')
        .select('user_id, display_name')
        .eq('household_id', householdId)
        .eq('role', 'resident');

      if (residentsError) throw residentsError;

      // Send cancellation notifications to all residents
      if (residents && residents.length > 0) {
        const notifications = residents.map(resident => ({
          user_id: resident.user_id,
          type: 'household_deletion_cancelled',
          title: 'Household Deletion Cancelled',
          message: `The scheduled deletion for household "${householdName}" has been cancelled. The household will continue to operate normally.`,
          read: false
        }));

        const { error: notificationError } = await supabase
          .from('notifications')
          .insert(notifications);

        if (notificationError) throw notificationError;
      }

      setIsScheduled(false);
      
      toast({
        title: "Deletion cancelled",
        description: `Deletion for household "${householdName}" has been cancelled. All residents have been notified.`,
      });
    } catch (error: any) {
      console.error('Error cancelling deletion:', error);
      toast({
        title: "Failed to cancel deletion",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setScheduling(false);
    }
  };

  if (!isCreator) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-red-600" />
          Household Deletion
        </CardTitle>
        <CardDescription>
          Schedule household deletion for the end of the current rent period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isScheduled ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-red-100 text-red-800">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Scheduled for Deletion
                </Badge>
              </div>
              {deletionReason && (
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-800">
                    <strong>Reason:</strong> {deletionReason}
                  </p>
                </div>
              )}
              {deletionScheduledAt && (
                <p className="text-sm text-gray-600">
                  Scheduled on: {new Date(deletionScheduledAt).toLocaleDateString()}
                </p>
              )}
              <p className="text-sm text-gray-600">
                This household will be deleted at the end of the current rent period. All residents have been notified.
              </p>
              <Button 
                variant="outline"
                onClick={cancelDeletion}
                disabled={scheduling}
                className="w-full"
              >
                {scheduling ? 'Cancelling...' : 'Cancel Deletion'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Schedule this household for deletion at the end of the current rent period. 
                All residents will be notified and the household will be deleted once the active rent period ends.
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule for Deletion
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Schedule Household Deletion</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will schedule "{householdName}" for deletion at the end of the current rent period. 
                      All residents will be notified immediately.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Reason for deletion:</label>
                    <Textarea
                      placeholder="Please provide a reason for deleting this household..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={scheduleDeletion}
                      disabled={scheduling || !reason.trim()}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {scheduling ? 'Scheduling...' : 'Schedule Deletion'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HouseholdDeletionScheduler;
