
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import RenterDashboard from './RenterDashboard';
import ResidentDashboard from './ResidentDashboard';
import EmailVerificationNotice from '@/components/EmailVerificationNotice';
import { useLanguage } from "@/contexts/LanguageContext";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (user && !authLoading) {
      fetchUserProfile();
    }
  }, [user, authLoading]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      setUserProfile(data);

      // If user hasn't selected a role yet, redirect to role selection
      if (!data?.user_type) {
        navigate('/role-selection');
        return;
      }

    } catch (error: any) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Render appropriate dashboard based on user type
  if (userProfile?.user_type === 'renter') {
    return (
      <div>
        <EmailVerificationNotice />
        {/* Settings Button */}
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => navigate('/settings')}
            className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
            size="lg"
          >
            <Settings className="h-5 w-5 mr-2" />
            {t('settings')}
          </Button>
        </div>
        <RenterDashboard />
      </div>
    );
  } else if (userProfile?.user_type === 'resident') {
    return (
      <div>
        <EmailVerificationNotice />
        {/* Settings Button */}
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => navigate('/settings')}
            className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
            size="lg"
          >
            <Settings className="h-5 w-5 mr-2" />
            {t('settings')}
          </Button>
        </div>
        <ResidentDashboard />
      </div>
    );
  } else {
    // Fallback: redirect to role selection if somehow we get here
    navigate('/role-selection');
    return null;
  }
};

export default Dashboard;
