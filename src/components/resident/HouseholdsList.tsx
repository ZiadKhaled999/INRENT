
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HouseholdMember {
  id: string;
  household_id: string;
  display_name: string;
  email: string;
  role: string;
  household: {
    id: string;
    name: string;
    rent_amount: number;
    due_day: number;
  } | null;
}

interface HouseholdsListProps {
    memberData: HouseholdMember[];
}

const HouseholdsList = ({ memberData }: HouseholdsListProps) => {
    const navigate = useNavigate();

    return (
        <Card className="order-1 xl:order-2">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                My Households
              </CardTitle>
              <CardDescription className="text-sm">
                Households you're a member of
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {memberData.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2 text-sm sm:text-base">No households yet</p>
                  <p className="text-xs sm:text-sm text-gray-500">Use the form to join a household</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {memberData.map((member) => {
                    if (!member.household) {
                      console.warn('Skipping member with null household:', member);
                      return null;
                    }
                    
                    return (
                      <div 
                        key={member.id}
                        className="p-3 sm:p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors active:bg-gray-100 touch-manipulation"
                        onClick={() => navigate(`/household/${member.household_id}`)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{member.household.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                              Rent: ${member.household.rent_amount.toLocaleString()} • Due: {member.household.due_day}th
                            </p>
                          </div>
                          <div className="flex justify-between sm:justify-end items-center">
                            <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {member.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }).filter(Boolean)}
                </div>
              )}
            </CardContent>
        </Card>
    )
}

export default HouseholdsList;
