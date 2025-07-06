import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PinAuthModal from "@/components/payments/PinAuthModal";
import PaymentManagement from "@/components/payments/PaymentManagement";
import { Loader2, CreditCard } from "lucide-react";

interface UserProfile {
  id: string;
  user_type: string;
  payment_pin_hash: string | null;
}

const PaymentsDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinMode, setPinMode] = useState<'create' | 'verify'>('verify');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      fetchUserProfile();
    }
  }, [user, authLoading]);

  const fetchUserProfile = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_type, payment_pin_hash')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setUserProfile(data);

      // Check if PIN exists
      if (!data.payment_pin_hash) {
        setPinMode('create');
        setIsPinModalOpen(true);
      } else {
        // Check if user has a valid PIN session (stored in sessionStorage)
        const pinSession = sessionStorage.getItem(`pin_session_${user.id}`);
        const sessionTime = pinSession ? parseInt(pinSession) : 0;
        const now = Date.now();
        
        // PIN session valid for 30 minutes
        if (now - sessionTime < 30 * 60 * 1000) {
          setIsAuthenticated(true);
        } else {
          setPinMode('verify');
          setIsPinModalOpen(true);
        }
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePinSuccess = () => {
    setIsAuthenticated(true);
    // Set PIN session timestamp
    if (user?.id) {
      sessionStorage.setItem(`pin_session_${user.id}`, Date.now().toString());
    }
  };

  const handleSignOut = async () => {
    // Clear PIN session
    if (user?.id) {
      sessionStorage.removeItem(`pin_session_${user.id}`);
    }
    setIsAuthenticated(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading payment dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-center">
          <p className="text-gray-600">User profile not found. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* PIN Authentication Modal */}
      <PinAuthModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handlePinSuccess}
        mode={pinMode}
      />

      {/* Main Dashboard Content */}
      {isAuthenticated ? (
        <PaymentManagement 
          userProfile={userProfile} 
          onSignOut={handleSignOut}
        />
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Payment Dashboard</h2>
            <p className="text-gray-600 mb-4">
              Secure access required to view payment information
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsDashboard;