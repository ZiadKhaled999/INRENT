
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, CheckCircle, AlertTriangle, Clock } from "lucide-react";
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

interface RentPeriod {
  id: string;
  household_id: string;
  month_year: string;
  start_date: string;
  end_date: string;
  due_date: string;
  status: 'active' | 'completed' | 'overdue';
  created_at: string;
  updated_at: string;
}

interface RentPeriodManagerProps {
  householdId: string;
  isCreator: boolean;
}

interface EndRentPeriodResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const RentPeriodManager: React.FC<RentPeriodManagerProps> = ({ householdId, isCreator }) => {
  const [rentPeriods, setRentPeriods] = useState<RentPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [endingPeriod, setEndingPeriod] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRentPeriods();
  }, [householdId]);

  const fetchRentPeriods = async () => {
    try {
      const { data, error } = await supabase
        .from('rent_periods')
        .select('*')
        .eq('household_id', householdId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure correct status types
      const typedData = (data || []).map(period => ({
        ...period,
        status: period.status as 'active' | 'completed' | 'overdue'
      }));
      
      setRentPeriods(typedData);
    } catch (error: any) {
      console.error('Error fetching rent periods:', error);
      toast({
        title: "Error loading rent periods",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const endRentPeriod = async (monthYear: string) => {
    setEndingPeriod(monthYear);
    try {
      const { data, error } = await supabase.rpc('end_rent_period', {
        target_household_id: householdId,
        target_month_year: monthYear
      });

      if (error) throw error;

      // Safely handle the Json type from Supabase
      let response: EndRentPeriodResponse;
      
      if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        response = data as unknown as EndRentPeriodResponse;
      } else {
        throw new Error('Invalid response format from server');
      }

      if (response?.success) {
        toast({
          title: "Rent period ended",
          description: response.message || "Rent period has been successfully ended and residents notified.",
        });
        await fetchRentPeriods();
      } else {
        throw new Error(response?.error || 'Failed to end rent period');
      }
    } catch (error: any) {
      console.error('Error ending rent period:', error);
      toast({
        title: "Failed to end rent period",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setEndingPeriod(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            Rent Periods
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <p className="text-gray-600 text-sm sm:text-base">Loading rent periods...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          Rent Periods
        </CardTitle>
        <CardDescription className="text-sm">
          Track and manage rent periods for this household
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        {rentPeriods.length === 0 ? (
          <p className="text-gray-600 text-center py-4 text-sm sm:text-base">No rent periods found</p>
        ) : (
          <div className="space-y-3">
            {rentPeriods.map((period) => (
              <div key={period.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getStatusIcon(period.status)}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm sm:text-base truncate">{period.month_year}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Due: {new Date(period.due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                  <Badge className={`${getStatusColor(period.status)} text-xs px-2 py-1`}>
                    {period.status}
                  </Badge>
                  {isCreator && period.status !== 'completed' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={endingPeriod === period.month_year}
                          className="text-xs sm:text-sm px-2 sm:px-3 touch-manipulation"
                        >
                          {endingPeriod === period.month_year ? 'Ending...' : 'End Period'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="mx-4 max-w-md">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-lg">End Rent Period</AlertDialogTitle>
                          <AlertDialogDescription className="text-sm">
                            Are you sure you want to end the rent period for {period.month_year}? 
                            All residents will be notified that this rent period has officially ended.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                          <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => endRentPeriod(period.month_year)}
                            className="w-full sm:w-auto"
                          >
                            End Period
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RentPeriodManager;
