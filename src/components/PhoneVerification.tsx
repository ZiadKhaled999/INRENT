
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Phone, Shield, CheckCircle } from "lucide-react";

interface PhoneVerificationProps {
  onVerificationComplete?: () => void;
  isRequired?: boolean;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({ 
  onVerificationComplete,
  isRequired = false 
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code' | 'verified'>('phone');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const numeric = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (numeric.length >= 10) {
      return `(${numeric.slice(0, 3)}) ${numeric.slice(3, 6)}-${numeric.slice(6, 10)}`;
    } else if (numeric.length >= 6) {
      return `(${numeric.slice(0, 3)}) ${numeric.slice(3, 6)}-${numeric.slice(6)}`;
    } else if (numeric.length >= 3) {
      return `(${numeric.slice(0, 3)}) ${numeric.slice(3)}`;
    }
    return numeric;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const getCleanPhoneNumber = (formatted: string) => {
    return '+1' + formatted.replace(/\D/g, '');
  };

  const sendVerificationCode = async () => {
    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to verify your phone number.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const cleanPhone = getCleanPhoneNumber(phoneNumber);
      
      const { error } = await supabase.functions.invoke('send-phone-verification', {
        body: { phoneNumber: cleanPhone },
        headers: { 'user-id': user.id }
      });

      if (error) throw error;

      toast({
        title: "Verification code sent!",
        description: "Check your phone for the 6-digit verification code.",
      });
      
      setStep('code');
    } catch (error: any) {
      console.error('Send verification error:', error);
      toast({
        title: "Failed to send verification code",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the complete 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to verify your phone number.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('verify-phone-code', {
        body: { 
          code: verificationCode,
          userId: user.id 
        }
      });

      if (error) throw error;

      toast({
        title: "Phone verified successfully!",
        description: "Your phone number has been verified.",
      });
      
      setStep('verified');
      onVerificationComplete?.();
    } catch (error: any) {
      console.error('Verification error:', error);
      toast({
        title: "Verification failed",
        description: error.message || "Invalid code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setResendLoading(true);
    try {
      await sendVerificationCode();
    } finally {
      setResendLoading(false);
    }
  };

  if (step === 'verified') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Phone Verified!</h3>
              <p className="text-gray-600 mt-2">Your phone number has been successfully verified.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {step === 'phone' ? <Phone className="w-6 h-6 text-blue-600" /> : <Shield className="w-6 h-6 text-blue-600" />}
        </div>
        <CardTitle className="text-xl sm:text-2xl">
          {step === 'phone' ? 'Verify Phone Number' : 'Enter Verification Code'}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          {step === 'phone' 
            ? isRequired 
              ? 'Phone verification is required to ensure account security.'
              : 'Verify your phone number to enhance account security.'
            : `We sent a 6-digit code to ${phoneNumber}`
          }
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {step === 'phone' ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={phoneNumber}
                onChange={handlePhoneChange}
                className="h-11 text-base"
                maxLength={14}
              />
              <p className="text-xs text-gray-500">
                We'll send a verification code to this number
              </p>
            </div>

            <Button 
              onClick={sendVerificationCode}
              disabled={loading || !phoneNumber}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-sm sm:text-base touch-manipulation"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm sm:text-base">Verification Code</Label>
                <InputOTP 
                  value={verificationCode} 
                  onChange={setVerificationCode}
                  maxLength={6}
                  className="justify-center"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-10 h-10 sm:w-12 sm:h-12 text-lg" />
                    <InputOTPSlot index={1} className="w-10 h-10 sm:w-12 sm:h-12 text-lg" />
                    <InputOTPSlot index={2} className="w-10 h-10 sm:w-12 sm:h-12 text-lg" />
                    <InputOTPSlot index={3} className="w-10 h-10 sm:w-12 sm:h-12 text-lg" />
                    <InputOTPSlot index={4} className="w-10 h-10 sm:w-12 sm:h-12 text-lg" />
                    <InputOTPSlot index={5} className="w-10 h-10 sm:w-12 sm:h-12 text-lg" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button 
                onClick={verifyCode}
                disabled={loading || verificationCode.length !== 6}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-sm sm:text-base touch-manipulation"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-xs sm:text-sm text-gray-600">
                  Didn't receive the code?
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={resendCode}
                  disabled={resendLoading}
                  className="text-xs sm:text-sm touch-manipulation"
                >
                  {resendLoading ? "Sending..." : "Resend Code"}
                </Button>
              </div>

              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setStep('phone')}
                className="w-full text-xs sm:text-sm touch-manipulation"
              >
                Change Phone Number
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PhoneVerification;
