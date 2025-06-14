
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LeaveHouseholdModalProps {
  householdId: string;
  householdName: string;
  onLeave: () => void;
}

interface LeaveCondition {
  id: string;
  title: string;
  description: string;
  met: boolean;
}

const LeaveHouseholdModal = ({ householdId, householdName, onLeave }: LeaveHouseholdModalProps) => {
  const [open, setOpen] = useState(false);
  const [conditions, setConditions] = useState<LeaveCondition[]>([]);
  const [loading, setLoading] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (open && user) {
      checkLeaveConditions();
    }
  }, [open, user, householdId]);

  const checkLeaveConditions = async () => {
    setLoading(true);
    try {
      // Check if user has any unpaid bills
      const { data: unpaidSplits, error: splitsError } = await supabase
        .from('bill_splits')
        .select(`
          id,
          amount,
          status,
          bill_id,
          bills!inner(household_id, month_year, due_date)
        `)
        .eq('user_id', user?.id)
        .eq('bills.household_id', householdId)
        .eq('status', 'pending');

      if (splitsError) throw splitsError;

      // Check if user is the household creator
      const { data: household, error: householdError } = await supabase
        .from('households')
        .select('created_by')
        .eq('id', householdId)
        .single();

      if (householdError) throw householdError;

      const isCreator = household.created_by === user?.id;
      const hasUnpaidBills = unpaidSplits && unpaidSplits.length > 0;
      const unpaidAmount = unpaidSplits?.reduce((sum, split) => sum + Number(split.amount), 0) || 0;

      const conditionsList: LeaveCondition[] = [
        {
          id: 'no-unpaid-bills',
          title: 'All bills paid',
          description: hasUnpaidBills 
            ? `You have $${unpaidAmount.toFixed(2)} in unpaid bills that must be settled first.`
            : 'No outstanding bills to pay.',
          met: !hasUnpaidBills
        },
        {
          id: 'not-creator',
          title: 'Transfer household ownership',
          description: isCreator 
            ? 'As the household creator, you must transfer ownership to another member before leaving.'
            : 'You are not the household creator.',
          met: !isCreator
        }
      ];

      setConditions(conditionsList);
    } catch (error: any) {
      console.error('Error checking leave conditions:', error);
      toast({
        title: "Error checking conditions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const canLeave = conditions.every(condition => condition.met);

  const handleLeave = async () => {
    if (!canLeave) {
      toast({
        title: "Cannot leave household",
        description: "Please resolve all conditions before leaving.",
        variant: "destructive",
      });
      return;
    }

    setLeaving(true);
    try {
      const { error } = await supabase
        .from('household_members')
        .delete()
        .eq('household_id', householdId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Left household",
        description: `You have successfully left ${householdName}.`,
      });

      setOpen(false);
      onLeave();
    } catch (error: any) {
      console.error('Error leaving household:', error);
      toast({
        title: "Failed to leave household",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLeaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
          <LogOut className="w-4 h-4 mr-2" />
          Leave Household
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Leave {householdName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Before leaving this household, please ensure all conditions below are met.
            </AlertDescription>
          </Alert>

          {loading ? (
            <div className="text-center py-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg mx-auto mb-2"></div>
              <p className="text-gray-600">Checking conditions...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {conditions.map((condition) => (
                <Card key={condition.id} className={condition.met ? "border-green-200" : "border-red-200"}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {condition.met ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h4 className={`font-medium ${condition.met ? 'text-green-800' : 'text-red-800'}`}>
                          {condition.title}
                        </h4>
                        <p className={`text-sm ${condition.met ? 'text-green-600' : 'text-red-600'}`}>
                          {condition.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleLeave}
              disabled={!canLeave || leaving || loading}
              variant="destructive"
              className="flex-1"
            >
              {leaving ? "Leaving..." : "Leave Household"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveHouseholdModal;
