
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Payment {
  id: string;
  amount: number;
  status: string;
  paid_at: string | null;
  bill: {
    month_year: string;
    due_date: string;
    household: {
      name: string;
    };
  } | null;
}

interface RecentPaymentsProps {
    payments: Payment[];
}

const RecentPayments = ({ payments }: RecentPaymentsProps) => {
    if (payments.length === 0) {
        return null;
    }
    
    return (
        <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">Recent Payments</CardTitle>
              <CardDescription className="text-sm">Your latest rent payment activity</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-3">
                {payments.map((payment) => {
                  if (!payment.bill) {
                    return null;
                  }
                  return (
                    <div key={payment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{payment.bill.household.name}</p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          {payment.bill.month_year} • Due: {new Date(payment.bill.due_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex justify-between sm:justify-end items-center gap-3">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">${Number(payment.amount).toLocaleString()}</p>
                        <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : payment.status === 'verified'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
        </Card>
    );
};

export default RecentPayments;
