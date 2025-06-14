
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Home, Plus, DollarSign, Calendar, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const mockHouseholds = [
    {
      id: 1,
      name: "Downtown Apartment",
      rentAmount: 2400,
      dueDay: 1,
      memberCount: 3,
      currentBill: {
        monthYear: "2025-01",
        totalAmount: 2400,
        paidAmount: 1600,
        myShare: 800,
        myStatus: "paid"
      }
    }
  ];

  const mockRecentActivity = [
    { type: "payment", user: "Sarah M.", amount: 800, date: "2 hours ago" },
    { type: "reminder", message: "Rent due in 3 days", date: "1 day ago" },
    { type: "split", message: "January rent split created", date: "3 days ago" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg"></div>
              <span className="text-2xl font-bold text-gray-900">Rentable</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
              <Button 
                onClick={() => navigate('/create-household')}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Household
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-600">Here's what's happening with your households</p>
        </div>

        {mockHouseholds.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Your First Household</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Get started by setting up a household and inviting your roommates to split rent fairly.
            </p>
            <Button 
              onClick={() => navigate('/create-household')}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Household
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Households */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Households</h2>
                <div className="space-y-4">
                  {mockHouseholds.map((household) => (
                    <Card key={household.id} className="cursor-pointer hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
                              <Home className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{household.name}</CardTitle>
                              <CardDescription className="flex items-center space-x-2">
                                <Users className="w-4 h-4" />
                                <span>{household.memberCount} members</span>
                              </CardDescription>
                            </div>
                          </div>
                          <Badge 
                            variant={household.currentBill.myStatus === 'paid' ? 'default' : 'destructive'}
                            className={household.currentBill.myStatus === 'paid' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                          >
                            {household.currentBill.myStatus === 'paid' ? 'Paid' : 'Pending'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Monthly Rent</p>
                            <p className="font-semibold text-lg">${household.rentAmount}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Your Share</p>
                            <p className="font-semibold text-lg">${household.currentBill.myShare}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Due Date</p>
                            <p className="font-semibold">Jan {household.dueDay}</p>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-gray-500 mb-2">
                            <span>Payment Progress</span>
                            <span>${household.currentBill.paidAmount} / ${household.currentBill.totalAmount}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${(household.currentBill.paidAmount / household.currentBill.totalAmount) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">This Month</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">Total Paid</span>
                    </div>
                    <span className="font-semibold">$800</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">Next Due</span>
                    </div>
                    <span className="font-semibold">Feb 1</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockRecentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-b-0">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {activity.type === 'payment' && <DollarSign className="w-4 h-4 text-green-600" />}
                          {activity.type === 'reminder' && <Bell className="w-4 h-4 text-blue-600" />}
                          {activity.type === 'split' && <Users className="w-4 h-4 text-purple-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.type === 'payment' && `${activity.user} paid $${activity.amount}`}
                            {activity.type === 'reminder' && activity.message}
                            {activity.type === 'split' && activity.message}
                          </p>
                          <p className="text-xs text-gray-500">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
