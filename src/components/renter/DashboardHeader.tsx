
import React from 'react';
import { Button } from "@/components/ui/button";
import { User, Plus } from "lucide-react";
import NotificationCenter from "@/components/NotificationCenter";
import AppLogoWithBg from "@/components/AppLogoWithBg";
import UserProfile from '@/components/UserProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface RenterDashboardHeaderProps {
    userProfile?: any;
    onVerifyPhone?: () => void;
}

const RenterDashboardHeader = ({ userProfile, onVerifyPhone }: RenterDashboardHeaderProps) => {
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const { signOut } = useAuth();

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
        <header className="bg-white shadow-sm border-b sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <AppLogoWithBg size={40} className="sm:hidden" />
                        <AppLogoWithBg size={48} className="hidden sm:block" />
                        <div className="flex-1 sm:flex-none">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">Renter Dashboard</h1>
                            <p className="text-sm sm:text-base text-gray-600 leading-tight">Manage your rental properties</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-end">
                        <Button onClick={() => navigate('/create-household')} size="sm">
                            <Plus className="w-4 h-4 mr-1" />
                            New Property
                        </Button>
                        <ProfileDisplay />
                        <NotificationCenter />
                        <Button variant="outline" onClick={signOut} size="sm">
                            Sign Out
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default RenterDashboardHeader;
