
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AppLogoWithBg from "@/components/AppLogoWithBg";
import EmailVerificationAlert from "@/components/EmailVerificationAlert";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        // Show professional verification alert instead of toast
        setShowVerificationAlert(true);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setShowVerificationAlert(false);
    navigate('/login');
  };

  return (
    <>
      <div 
        className="min-h-screen flex items-center justify-center p-4 relative bg-gray-100"
      >
        <div className="w-full max-w-sm mx-auto relative z-10">
          <div 
            className="rounded-3xl shadow-2xl p-8 border border-white/20 relative overflow-hidden"
            style={{
              backgroundImage: `url(/lovable-uploads/67ca151f-1f97-495d-9839-9326856d388b.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Overlay for better readability */}
            <div className="absolute inset-0 bg-white/85 backdrop-blur-sm rounded-3xl"></div>
            
            <div className="relative z-10">
              {/* Logo and Brand */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <AppLogoWithBg size={80} />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">InRent</h1>
              </div>

              {/* Form Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign up</h2>
                <p className="text-gray-600 text-sm">Sign up to continue</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-14 rounded-full bg-emerald-100/50 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 pl-4"
                  />
                </div>

                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-14 rounded-full bg-emerald-100/50 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 pl-4"
                  />
                </div>
                
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-14 rounded-full bg-emerald-100/50 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 pl-4"
                  />
                </div>

                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-14 rounded-full bg-emerald-100/50 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 pl-4"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold text-lg shadow-lg mt-6"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Sign up"}
                </Button>
              </form>

              {/* Toggle Form */}
              <div className="text-center mt-6">
                <p className="text-gray-600 text-sm">
                  Have an account?{" "}
                  <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium underline">
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Footer Links */}
              <div className="text-center mt-8">
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Link to="/privacy" className="text-xs text-gray-500 hover:text-gray-700 hover:underline">
                    Privacy Policy
                  </Link>
                  <Link to="/terms" className="text-xs text-gray-500 hover:text-gray-700 hover:underline">
                    Terms of Service
                  </Link>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  By creating an account, you're joining our mission
                  <br />to make rent splitting fair and transparent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Email Verification Alert */}
      {showVerificationAlert && (
        <EmailVerificationAlert 
          email={email} 
          onClose={handleCloseAlert}
        />
      )}
    </>
  );
};

export default Register;
