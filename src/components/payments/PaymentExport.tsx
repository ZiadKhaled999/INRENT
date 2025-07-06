import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileText, Calendar, Filter } from "lucide-react";

interface Household {
  id: string;
  name: string;
  rent_amount: number;
  due_day: number;
}

interface PaymentExportProps {
  households: Household[];
}

interface ExportFilters {
  householdId: string;
  status: string;
  startDate: string;
  endDate: string;
  includeMembers: boolean;
}

interface PaymentRecord {
  id: string;
  household_name: string;
  resident_name: string;
  resident_email: string;
  amount: number;
  status: string;
  due_date: string;
  paid_at: string | null;
  created_at: string;
  method: string;
  tx_id: string | null;
}

const PaymentExport: React.FC<PaymentExportProps> = ({ households }) => {
  const [filters, setFilters] = useState<ExportFilters>({
    householdId: 'all',
    status: 'all',
    startDate: '',
    endDate: '',
    includeMembers: true
  });
  const [loading, setLoading] = useState(false);
  const [exportData, setExportData] = useState<PaymentRecord[]>([]);
  const { toast } = useToast();

  const fetchExportData = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('payments')
        .select(`
          id,
          amount,
          status,
          due_date,
          paid_at,
          created_at,
          method,
          tx_id,
          household:households(name),
          resident:household_members(display_name, email)
        `);

      // Apply household filter
      if (filters.householdId !== 'all') {
        query = query.eq('household_id', filters.householdId);
      } else {
        // Filter by user's households
        const householdIds = households.map(h => h.id);
        query = query.in('household_id', householdIds);
      }

      // Apply status filter
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      // Apply date filters
      if (filters.startDate) {
        query = query.gte('due_date', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('due_date', filters.endDate);
      }

      const { data, error } = await query.order('due_date', { ascending: false });

      if (error) throw error;

      // Transform data for export
      const transformedData: PaymentRecord[] = (data || []).map(payment => ({
        id: payment.id,
        household_name: payment.household?.name || 'Unknown',
        resident_name: payment.resident?.display_name || 'Unknown',
        resident_email: payment.resident?.email || 'Unknown',
        amount: payment.amount,
        status: payment.status,
        due_date: payment.due_date,
        paid_at: payment.paid_at,
        created_at: payment.created_at,
        method: payment.method || 'paymob',
        tx_id: payment.tx_id
      }));

      setExportData(transformedData);
      return transformedData;
    } catch (error: any) {
      console.error('Error fetching export data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch export data.",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = async () => {
    const data = await fetchExportData();
    if (data.length === 0) {
      toast({
        title: "No Data",
        description: "No data available for export with current filters.",
        variant: "destructive",
      });
      return;
    }

    const headers = [
      'Payment ID',
      'Household',
      'Resident Name',
      filters.includeMembers ? 'Resident Email' : null,
      'Amount (EGP)',
      'Status',
      'Due Date',
      'Paid Date',
      'Created Date',
      'Payment Method',
      'Transaction ID'
    ].filter(Boolean);

    const csvContent = [
      headers.join(','),
      ...data.map(record => [
        record.id,
        `"${record.household_name}"`,
        `"${record.resident_name}"`,
        filters.includeMembers ? `"${record.resident_email}"` : null,
        record.amount,
        record.status,
        record.due_date,
        record.paid_at || '',
        record.created_at,
        record.method,
        record.tx_id || ''
      ].filter(Boolean).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `payments_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "Export Complete",
      description: `Exported ${data.length} payment records to CSV.`,
    });
  };

  const exportToJSON = async () => {
    const data = await fetchExportData();
    if (data.length === 0) {
      toast({
        title: "No Data",
        description: "No data available for export with current filters.",
        variant: "destructive",
      });
      return;
    }

    const exportPayload = {
      export_date: new Date().toISOString(),
      filters: filters,
      total_records: data.length,
      payments: filters.includeMembers ? data : data.map(({ resident_email, ...rest }) => rest)
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `payments_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    toast({
      title: "Export Complete",
      description: `Exported ${data.length} payment records to JSON.`,
    });
  };

  const generateSummaryReport = async () => {
    const data = await fetchExportData();
    if (data.length === 0) {
      toast({
        title: "No Data",
        description: "No data available for report with current filters.",
        variant: "destructive",
      });
      return;
    }

    const summary = {
      total_payments: data.length,
      total_amount: data.reduce((sum, payment) => sum + payment.amount, 0),
      paid_amount: data.filter(p => p.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0),
      pending_amount: data.filter(p => p.status === 'pending').reduce((sum, payment) => sum + payment.amount, 0),
      overdue_amount: data.filter(p => p.status === 'overdue').reduce((sum, payment) => sum + payment.amount, 0),
      by_status: {
        paid: data.filter(p => p.status === 'paid').length,
        pending: data.filter(p => p.status === 'pending').length,
        overdue: data.filter(p => p.status === 'overdue').length,
        failed: data.filter(p => p.status === 'failed').length
      },
      by_household: households.reduce((acc, household) => {
        const householdPayments = data.filter(p => p.household_name === household.name);
        acc[household.name] = {
          total_payments: householdPayments.length,
          total_amount: householdPayments.reduce((sum, p) => sum + p.amount, 0),
          paid_count: householdPayments.filter(p => p.status === 'paid').length
        };
        return acc;
      }, {} as Record<string, any>)
    };

    const reportContent = `
# Payment Summary Report
Generated: ${new Date().toLocaleDateString()}

## Overview
- Total Payments: ${summary.total_payments}
- Total Amount: ${summary.total_amount.toLocaleString()} EGP
- Paid Amount: ${summary.paid_amount.toLocaleString()} EGP
- Pending Amount: ${summary.pending_amount.toLocaleString()} EGP
- Overdue Amount: ${summary.overdue_amount.toLocaleString()} EGP

## Status Breakdown
- Paid: ${summary.by_status.paid}
- Pending: ${summary.by_status.pending}
- Overdue: ${summary.by_status.overdue}
- Failed: ${summary.by_status.failed}

## By Household
${Object.entries(summary.by_household).map(([name, stats]: [string, any]) => 
  `### ${name}\n- Total Payments: ${stats.total_payments}\n- Total Amount: ${stats.total_amount.toLocaleString()} EGP\n- Paid Count: ${stats.paid_count}`
).join('\n\n')}
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `payment_summary_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();

    toast({
      title: "Report Generated",
      description: "Payment summary report downloaded successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Export Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Household</Label>
              <Select value={filters.householdId} onValueChange={(value) => setFilters(prev => ({ ...prev, householdId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select household" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Households</SelectItem>
                  {households.map(household => (
                    <SelectItem key={household.id} value={household.id}>
                      {household.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeMembers"
              checked={filters.includeMembers}
              onCheckedChange={(checked) => setFilters(prev => ({ ...prev, includeMembers: !!checked }))}
            />
            <Label htmlFor="includeMembers" className="text-sm">
              Include resident email addresses in export
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={exportToCSV} disabled={loading} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Export CSV
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />}
            </Button>

            <Button onClick={exportToJSON} disabled={loading} variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Export JSON
              {loading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin ml-2" />}
            </Button>

            <Button onClick={generateSummaryReport} disabled={loading} variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Summary Report
              {loading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin ml-2" />}
            </Button>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p><strong>CSV:</strong> Spreadsheet-compatible format for data analysis</p>
            <p><strong>JSON:</strong> Structured data format for technical integration</p>
            <p><strong>Summary Report:</strong> High-level overview with key metrics</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentExport;