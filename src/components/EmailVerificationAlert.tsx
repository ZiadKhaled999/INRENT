
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmailVerificationAlertProps {
  email: string;
  onClose: () => void;
}

const EmailVerificationAlert = ({ email, onClose }: EmailVerificationAlertProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Account Created Successfully!
          </h2>
          
          <div className="mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Verification Email Sent</span>
            </div>
            <p className="text-sm text-gray-600">
              We've sent a verification email to:
            </p>
            <p className="text-sm font-semibold text-blue-600 mt-1">
              {email}
            </p>
          </div>
          
          <Alert className="mb-4 border-amber-200 bg-amber-50">
            <Mail className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Please verify your email</AlertTitle>
            <AlertDescription className="text-amber-700">
              Check your inbox and click the verification link to activate your account and start using InRent.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            <Button 
              onClick={onClose}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              Continue to Login
            </Button>
            
            <p className="text-xs text-gray-500">
              Didn't receive the email? Check your spam folder or try again in a few minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationAlert;
