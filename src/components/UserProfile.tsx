
import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

interface UserProfileProps {
  userProfile?: any;
  className?: string;
}

const UserProfile = ({ userProfile, className = "" }: UserProfileProps) => {
  const { user } = useAuth();

  // Generate initials from full name
  const getInitials = (fullName: string) => {
    if (!fullName) return 'U';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    
    // Get first letter of first name and first letter of last name (or father's name)
    const firstInitial = names[0][0] || '';
    const secondInitial = names[names.length - 1][0] || '';
    
    return (firstInitial + secondInitial).toUpperCase();
  };

  // Generate gradient based on initials for consistency
  const getGradientClass = (initials: string) => {
    const gradients = [
      'bg-gradient-to-br from-blue-500 to-purple-600',
      'bg-gradient-to-br from-green-500 to-blue-600',
      'bg-gradient-to-br from-purple-500 to-pink-600',
      'bg-gradient-to-br from-orange-500 to-red-600',
      'bg-gradient-to-br from-teal-500 to-green-600',
      'bg-gradient-to-br from-indigo-500 to-purple-600',
      'bg-gradient-to-br from-pink-500 to-rose-600',
      'bg-gradient-to-br from-cyan-500 to-blue-600',
    ];
    
    // Use initials to determine gradient (consistent for same user)
    const index = initials.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  const fullName = userProfile?.full_name || user?.user_metadata?.full_name || 'Unknown User';
  const email = userProfile?.email || user?.email || '';
  const userType = userProfile?.user_type || 'Not Set';
  const initials = getInitials(fullName);
  const gradientClass = getGradientClass(initials);

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Profile Avatar with Initials */}
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarFallback className={`${gradientClass} text-white text-2xl font-bold border-4 border-white shadow-lg`}>
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* User Information */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">{fullName}</h2>
            
            <div className="flex justify-center">
              <Badge variant={userType === 'renter' ? 'default' : 'secondary'} className="text-sm">
                {userType === 'renter' ? 'Property Owner' : userType === 'resident' ? 'Resident' : 'Role Not Set'}
              </Badge>
            </div>
            
            <p className="text-gray-600 text-sm">{email}</p>
          </div>

          {/* Additional Details */}
          <div className="w-full space-y-3 pt-4 border-t">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Account Type:</span>
              <span className="font-medium text-gray-900 capitalize">{userType}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900 truncate ml-2">{email}</span>
            </div>
            
            {userProfile?.created_at && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Member Since:</span>
                <span className="font-medium text-gray-900">
                  {new Date(userProfile.created_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
