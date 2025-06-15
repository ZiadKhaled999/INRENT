
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Calendar, Bell } from "lucide-react";

interface StatsCardsProps {
  totalRent: number;
  nextDueDate: Date | null;
  pendingPayments: number;
}

const StatsCards = ({ totalRent, nextDueDate, pendingPayments }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">Total Monthly Rent</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">${totalRent.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">Next Due Date</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                {nextDueDate ? nextDueDate.toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">Pending Payments</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{pendingPayments}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
