
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Phone, Shield, CheckCircle } from "lucide-react";

interface PhoneVerificationProps {
  onVerificationComplete?: () => void;
  isRequired?: boolean;
}

// Countries with their calling codes (excluding Israel, India, and Iran)
const SUPPORTED_COUNTRIES = [
  { code: 'US', name: 'United States', dialCode: '+1' },
  { code: 'CA', name: 'Canada', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
  { code: 'FR', name: 'France', dialCode: '+33' },
  { code: 'DE', name: 'Germany', dialCode: '+49' },
  { code: 'ES', name: 'Spain', dialCode: '+34' },
  { code: 'IT', name: 'Italy', dialCode: '+39' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31' },
  { code: 'BE', name: 'Belgium', dialCode: '+32' },
  { code: 'SE', name: 'Sweden', dialCode: '+46' },
  { code: 'NO', name: 'Norway', dialCode: '+47' },
  { code: 'DK', name: 'Denmark', dialCode: '+45' },
  { code: 'FI', name: 'Finland', dialCode: '+358' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41' },
  { code: 'AT', name: 'Austria', dialCode: '+43' },
  { code: 'AU', name: 'Australia', dialCode: '+61' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64' },
  { code: 'JP', name: 'Japan', dialCode: '+81' },
  { code: 'KR', name: 'South Korea', dialCode: '+82' },
  { code: 'CN', name: 'China', dialCode: '+86' },
  { code: 'BR', name: 'Brazil', dialCode: '+55' },
  { code: 'AR', name: 'Argentina', dialCode: '+54' },
  { code: 'MX', name: 'Mexico', dialCode: '+52' },
  { code: 'CL', name: 'Chile', dialCode: '+56' },
  { code: 'CO', name: 'Colombia', dialCode: '+57' },
  { code: 'PE', name: 'Peru', dialCode: '+51' },
  { code: 'VE', name: 'Venezuela', dialCode: '+58' },
  { code: 'EC', name: 'Ecuador', dialCode: '+593' },
  { code: 'UY', name: 'Uruguay', dialCode: '+598' },
  { code: 'PY', name: 'Paraguay', dialCode: '+595' },
  { code: 'BO', name: 'Bolivia', dialCode: '+591' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234' },
  { code: 'KE', name: 'Kenya', dialCode: '+254' },
  { code: 'EG', name: 'Egypt', dialCode: '+20' },
  { code: 'MA', name: 'Morocco', dialCode: '+212' },
  { code: 'TN', name: 'Tunisia', dialCode: '+216' },
  { code: 'DZ', name: 'Algeria', dialCode: '+213' },
  { code: 'LY', name: 'Libya', dialCode: '+218' },
  { code: 'SD', name: 'Sudan', dialCode: '+249' },
  { code: 'ET', name: 'Ethiopia', dialCode: '+251' },
  { code: 'UG', name: 'Uganda', dialCode: '+256' },
  { code: 'TZ', name: 'Tanzania', dialCode: '+255' },
  { code: 'RW', name: 'Rwanda', dialCode: '+250' },
  { code: 'GH', name: 'Ghana', dialCode: '+233' },
  { code: 'CI', name: 'Ivory Coast', dialCode: '+225' },
  { code: 'SN', name: 'Senegal', dialCode: '+221' },
  { code: 'ML', name: 'Mali', dialCode: '+223' },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226' },
  { code: 'NE', name: 'Niger', dialCode: '+227' },
  { code: 'TD', name: 'Chad', dialCode: '+235' },
  { code: 'CF', name: 'Central African Republic', dialCode: '+236' },
  { code: 'CM', name: 'Cameroon', dialCode: '+237' },
  { code: 'GA', name: 'Gabon', dialCode: '+241' },
  { code: 'CG', name: 'Republic of Congo', dialCode: '+242' },
  { code: 'CD', name: 'Democratic Republic of Congo', dialCode: '+243' },
  { code: 'AO', name: 'Angola', dialCode: '+244' },
  { code: 'ZM', name: 'Zambia', dialCode: '+260' },
  { code: 'ZW', name: 'Zimbabwe', dialCode: '+263' },
  { code: 'BW', name: 'Botswana', dialCode: '+267' },
  { code: 'SZ', name: 'Eswatini', dialCode: '+268' },
  { code: 'LS', name: 'Lesotho', dialCode: '+266' },
  { code: 'MW', name: 'Malawi', dialCode: '+265' },
  { code: 'MZ', name: 'Mozambique', dialCode: '+258' },
  { code: 'MG', name: 'Madagascar', dialCode: '+261' },
  { code: 'MU', name: 'Mauritius', dialCode: '+230' },
  { code: 'SC', name: 'Seychelles', dialCode: '+248' },
  { code: 'RU', name: 'Russia', dialCode: '+7' },
  { code: 'UA', name: 'Ukraine', dialCode: '+380' },
  { code: 'PL', name: 'Poland', dialCode: '+48' },
  { code: 'CZ', name: 'Czech Republic', dialCode: '+420' },
  { code: 'SK', name: 'Slovakia', dialCode: '+421' },
  { code: 'HU', name: 'Hungary', dialCode: '+36' },
  { code: 'RO', name: 'Romania', dialCode: '+40' },
  { code: 'BG', name: 'Bulgaria', dialCode: '+359' },
  { code: 'HR', name: 'Croatia', dialCode: '+385' },
  { code: 'SI', name: 'Slovenia', dialCode: '+386' },
  { code: 'BA', name: 'Bosnia and Herzegovina', dialCode: '+387' },
  { code: 'RS', name: 'Serbia', dialCode: '+381' },
  { code: 'ME', name: 'Montenegro', dialCode: '+382' },
  { code: 'MK', name: 'North Macedonia', dialCode: '+389' },
  { code: 'AL', name: 'Albania', dialCode: '+355' },
  { code: 'GR', name: 'Greece', dialCode: '+30' },
  { code: 'TR', name: 'Turkey', dialCode: '+90' },
  { code: 'CY', name: 'Cyprus', dialCode: '+357' },
  { code: 'MT', name: 'Malta', dialCode: '+356' },
  { code: 'IS', name: 'Iceland', dialCode: '+354' },
  { code: 'IE', name: 'Ireland', dialCode: '+353' },
  { code: 'PT', name: 'Portugal', dialCode: '+351' },
  { code: 'LU', name: 'Luxembourg', dialCode: '+352' },
  { code: 'MC', name: 'Monaco', dialCode: '+377' },
  { code: 'AD', name: 'Andorra', dialCode: '+376' },
  { code: 'SM', name: 'San Marino', dialCode: '+378' },
  { code: 'VA', name: 'Vatican City', dialCode: '+39' },
  { code: 'LI', name: 'Liechtenstein', dialCode: '+423' },
  { code: 'TH', name: 'Thailand', dialCode: '+66' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60' },
  { code: 'SG', name: 'Singapore', dialCode: '+65' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62' },
  { code: 'PH', name: 'Philippines', dialCode: '+63' },
  { code: 'TW', name: 'Taiwan', dialCode: '+886' },
  { code: 'HK', name: 'Hong Kong', dialCode: '+852' },
  { code: 'MO', name: 'Macau', dialCode: '+853' },
  { code: 'KH', name: 'Cambodia', dialCode: '+855' },
  { code: 'LA', name: 'Laos', dialCode: '+856' },
  { code: 'MM', name: 'Myanmar', dialCode: '+95' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880' },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94' },
  { code: 'MV', name: 'Maldives', dialCode: '+960' },
  { code: 'NP', name: 'Nepal', dialCode: '+977' },
  { code: 'BT', name: 'Bhutan', dialCode: '+975' },
  { code: 'AF', name: 'Afghanistan', dialCode: '+93' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92' },
  { code: 'UZ', name: 'Uzbekistan', dialCode: '+998' },
  { code: 'KZ', name: 'Kazakhstan', dialCode: '+7' },
  { code: 'KG', name: 'Kyrgyzstan', dialCode: '+996' },
  { code: 'TJ', name: 'Tajikistan', dialCode: '+992' },
  { code: 'TM', name: 'Turkmenistan', dialCode: '+993' },
  { code: 'MN', name: 'Mongolia', dialCode: '+976' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966' },
  { code: 'QA', name: 'Qatar', dialCode: '+974' },
  { code: 'BH', name: 'Bahrain', dialCode: '+973' },
  { code: 'KW', name: 'Kuwait', dialCode: '+965' },
  { code: 'OM', name: 'Oman', dialCode: '+968' },
  { code: 'YE', name: 'Yemen', dialCode: '+967' },
  { code: 'JO', name: 'Jordan', dialCode: '+962' },
  { code: 'LB', name: 'Lebanon', dialCode: '+961' },
  { code: 'SY', name: 'Syria', dialCode: '+963' },
  { code: 'IQ', name: 'Iraq', dialCode: '+964' },
  { code: 'AM', name: 'Armenia', dialCode: '+374' },
  { code: 'AZ', name: 'Azerbaijan', dialCode: '+994' },
  { code: 'GE', name: 'Georgia', dialCode: '+995' },
];

const PhoneVerification: React.FC<PhoneVerificationProps> = ({ 
  onVerificationComplete,
  isRequired = false 
}) => {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code' | 'verified'>('phone');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const selectedCountryData = SUPPORTED_COUNTRIES.find(country => country.code === selectedCountry);

  const formatPhoneNumber = (value: string, countryCode: string) => {
    // Remove all non-numeric characters
    const numeric = value.replace(/\D/g, '');
    
    // Different formatting based on country
    if (countryCode === 'US' || countryCode === 'CA') {
      // North American format: (XXX) XXX-XXXX
      if (numeric.length >= 10) {
        return `(${numeric.slice(0, 3)}) ${numeric.slice(3, 6)}-${numeric.slice(6, 10)}`;
      } else if (numeric.length >= 6) {
        return `(${numeric.slice(0, 3)}) ${numeric.slice(3, 6)}-${numeric.slice(6)}`;
      } else if (numeric.length >= 3) {
        return `(${numeric.slice(0, 3)}) ${numeric.slice(3)}`;
      }
      return numeric;
    } else {
      // International format: just add spaces for readability
      if (numeric.length > 6) {
        return `${numeric.slice(0, 3)} ${numeric.slice(3, 6)} ${numeric.slice(6)}`;
      } else if (numeric.length > 3) {
        return `${numeric.slice(0, 3)} ${numeric.slice(3)}`;
      }
      return numeric;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value, selectedCountry);
    setPhoneNumber(formatted);
  };

  const getFullPhoneNumber = () => {
    if (!selectedCountryData) return '';
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    return `${selectedCountryData.dialCode}${cleanNumber}`;
  };

  const validatePhoneNumber = () => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Basic validation - at least 7 digits for most countries
    if (cleanNumber.length < 7) {
      return false;
    }
    
    // US/Canada specific validation
    if (selectedCountry === 'US' || selectedCountry === 'CA') {
      return cleanNumber.length === 10;
    }
    
    // For other countries, accept 7-15 digits
    return cleanNumber.length >= 7 && cleanNumber.length <= 15;
  };

  const sendVerificationCode = async () => {
    if (!validatePhoneNumber()) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number for the selected country.",
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
      const fullPhoneNumber = getFullPhoneNumber();
      
      const { error } = await supabase.functions.invoke('send-phone-verification', {
        body: { phoneNumber: fullPhoneNumber },
        headers: { 'user-id': user.id }
      });

      if (error) throw error;

      toast({
        title: "Verification code sent!",
        description: `Check your phone for the 6-digit verification code.`,
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
            : `We sent a 6-digit code to ${selectedCountryData?.dialCode} ${phoneNumber}`
          }
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {step === 'phone' ? (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm sm:text-base">Country</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {SUPPORTED_COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.dialCode} {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number</Label>
                <div className="flex">
                  <div className="flex items-center px-3 bg-gray-50 border border-r-0 rounded-l-md text-sm text-gray-600">
                    {selectedCountryData?.dialCode}
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={selectedCountry === 'US' || selectedCountry === 'CA' ? "(555) 123-4567" : "123 456 789"}
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    className="h-11 text-base rounded-l-none"
                    maxLength={selectedCountry === 'US' || selectedCountry === 'CA' ? 14 : 20}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  We'll send a verification code to this number
                </p>
              </div>
            </div>

            <Button 
              onClick={sendVerificationCode}
              disabled={loading || !validatePhoneNumber()}
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
                onClick={() => {
                  setStep('phone');
                  setVerificationCode('');
                }}
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
