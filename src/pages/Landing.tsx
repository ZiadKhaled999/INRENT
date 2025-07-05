
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, User, Eye, EyeOff, Lock } from "lucide-react";
import AppLogoWithBg from "@/components/AppLogoWithBg";
import EmailVerificationAlert from "@/components/EmailVerificationAlert";
import SplashScreen from "@/components/SplashScreen";

const Landing = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
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
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Welcome back!",
        description: "Successfully logged in to InRent.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setShowVerificationAlert(false);
    setIsSignUp(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <>
      <div 
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)'
        }}
      >
        {/* Background with torn paper effect */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/lovable-uploads/00243405-45bb-4cc8-bebc-0d10f4ac0b8e.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        <div className="w-full max-w-sm mx-auto relative z-10">
          <div 
            className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-emerald-200/30 relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(240,253,250,0.95))',
              backgroundBlendMode: 'overlay'
            }}
          >
            {/* Logo and Brand */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <AppLogoWithBg size={80} />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">InRent</h1>
            </div>

            {/* Form Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {isSignUp ? 'Sign up' : 'Login'}
              </h2>
              <p className="text-gray-600 text-sm">
                {isSignUp ? 'Sign up to continue' : 'Sign in to continue'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
              {isSignUp && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    required
                    className="pl-12 h-14 rounded-full bg-emerald-50/70 border-2 border-emerald-200/50 focus:border-emerald-400 focus:ring-emerald-400"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="pl-12 h-14 rounded-full bg-emerald-50/70 border-2 border-emerald-200/50 focus:border-emerald-400 focus:ring-emerald-400"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  minLength={6}
                  className="pl-12 pr-12 h-14 rounded-full bg-emerald-50/70 border-2 border-emerald-200/50 focus:border-emerald-400 focus:ring-emerald-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {isSignUp && (
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                    className="pl-12 pr-12 h-14 rounded-full bg-emerald-50/70 border-2 border-emerald-200/50 focus:border-emerald-400 focus:ring-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-14 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold text-lg shadow-lg"
                disabled={loading}
              >
                {loading ? (isSignUp ? "Creating..." : "Signing in...") : (isSignUp ? "Sign up" : "Log in")}
              </Button>
            </form>

            {/* Toggle Form */}
            <div className="text-center mt-6">
              <p className="text-gray-600 text-sm">
                {isSignUp ? "Have an account " : "Don't have an account "}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-emerald-600 hover:text-emerald-700 font-medium underline"
                >
                  {isSignUp ? "sign in" : "sign up"}
                </button>
              </p>
            </div>

            {!isSignUp && (
              <div className="text-center mt-8">
                <p className="text-xs text-gray-500">www.inrent.org</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showVerificationAlert && (
        <EmailVerificationAlert 
          email={formData.email} 
          onClose={handleCloseAlert}
        />
      )}
    </>
  );
};

export default Landing;
