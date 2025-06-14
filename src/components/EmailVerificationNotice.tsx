
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const EmailVerificationNotice = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // Show notice only if user is signed in but email is not confirmed
    if (user && !user.email_confirmed_at) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [user]);

  const resendVerification = async () => {
    if (!user?.email) return;
    
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });
      
      if (error) throw error;
      
      // Show success message briefly
      alert('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      console.error('Error resending verification:', error);
      alert('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (!isVisible) return null;

  return (
    <Alert className="mb-4 border-amber-200 bg-amber-50">
      <Mail className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800">Verify Your Email</AlertTitle>
      <AlertDescription className="text-amber-700">
        Please check your inbox and click the verification link to activate your account.
        <div className="mt-2 flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={resendVerification}
            disabled={isResending}
            className="text-amber-700 border-amber-300 hover:bg-amber-100"
          >
            {isResending ? 'Sending...' : 'Resend Email'}
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setIsVisible(false)}
            className="text-amber-700 hover:bg-amber-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default EmailVerificationNotice;
