
import React from 'react';
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import NotificationCenter from "@/components/NotificationCenter";
import AppLogoWithBg from "@/components/AppLogoWithBg";
import UserProfile from '@/components/UserProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DashboardHeaderProps {
    userProfile?: any;
    onVerifyPhone?: () => void;
}

const DashboardHeader = ({ userProfile, onVerifyPhone }: DashboardHeaderProps) => {
    const isMobile = useIsMobile();

    const profileTrigger = (
        <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4"
        >
            <User className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Profile</span>
        </Button>
    );

    const ProfileDisplay = () => {
        if (isMobile) {
            return (
                <Drawer>
                    <DrawerTrigger asChild>{profileTrigger}</DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Your Profile</DrawerTitle>
                        </DrawerHeader>
                        <div className="p-4">
                            <UserProfile userProfile={userProfile} onVerifyPhone={onVerifyPhone} />
                        </div>
                    </DrawerContent>
                </Drawer>
            );
        }

        return (
            <Popover>
                <PopoverTrigger asChild>{profileTrigger}</PopoverTrigger>
                <PopoverContent className="w-full max-w-md p-0" align="end">
                    <UserProfile userProfile={userProfile} onVerifyPhone={onVerifyPhone} className="border-0 shadow-none" />
                </PopoverContent>
            </Popover>
        );
    };

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
            <ProfileDisplay />
            <NotificationCenter />
          </div>
        </div>
    );
};

export default DashboardHeader;

