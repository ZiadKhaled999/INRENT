
import React from 'react';
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import NotificationCenter from "@/components/NotificationCenter";
import AppLogoWithBg from "@/components/AppLogoWithBg";

interface DashboardHeaderProps {
    onToggleProfile: () => void;
}

const DashboardHeader = ({ onToggleProfile }: DashboardHeaderProps) => {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <AppLogoWithBg size={40} className="sm:hidden" />
            <AppLogoWithBg size={48} className="hidden sm:block" />
            <div className="flex-1 sm:flex-none">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">Resident Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600 leading-tight">Manage your rent payments and household memberships</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onToggleProfile}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4"
            >
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Profile</span>
            </Button>
            <NotificationCenter />
          </div>
        </div>
    );
};

export default DashboardHeader;
