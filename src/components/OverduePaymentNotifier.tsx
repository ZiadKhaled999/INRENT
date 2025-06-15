
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Send } from "lucide-react";

interface OverduePaymentNotifierProps {
  householdId: string;
  isCreator: boolean;
}

const OverduePaymentNotifier: React.FC<OverduePaymentNotifierProps> = ({ householdId, isCreator }) => {
  const [checking, setChecking] = useState(false);
  const { toast } = useToast();

  const checkOverduePayments = async () => {
    if (!isCreator) return;
    
    setChecking(true);
    try {
      const { error } = await supabase.rpc('check_overdue_payments');

      if (error) throw error;

      toast({
        title: "Overdue payments checked",
        description: "All overdue payments have been processed and notifications sent to residents.",
      });
    } catch (error: any) {
      console.error('Error checking overdue payments:', error);
      toast({
        title: "Failed to check overdue payments",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setChecking(false);
    }
  };

  if (!isCreator) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Overdue Payment Notifications
        </CardTitle>
        <CardDescription>
          Check for overdue payments and notify residents automatically
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Click the button below to check all rent periods for overdue payments and automatically 
            send notifications to residents who are late with their payments.
          </p>
          <Button 
            onClick={checkOverduePayments}
            disabled={checking}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            {checking ? 'Checking...' : 'Check & Notify Overdue Payments'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverduePaymentNotifier;
