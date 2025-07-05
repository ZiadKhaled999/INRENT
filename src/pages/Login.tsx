import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AppLogoWithBg from "@/components/AppLogoWithBg";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
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

  return (
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
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Login</h2>
              <p className="text-gray-600 text-sm">Sign in to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
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
                  className="h-14 rounded-full bg-emerald-100/50 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 pl-4"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold text-lg shadow-lg mt-6"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Log in"}
              </Button>
            </form>

            {/* Toggle Form */}
            <div className="text-center mt-6">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-medium underline">
                  Sign up
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
              <p className="text-xs text-gray-500 mt-4">www.inrent.org</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
