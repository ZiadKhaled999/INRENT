import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Calendar, Bell, Shield, Heart, Menu, X, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLogoWithBg from "@/components/AppLogoWithBg";

const Index = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: DollarSign,
      title: "Fair Rent Splitting",
      description: "Automatically split rent and utilities with customizable shares for each roommate.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Easy Household Setup",
      description: "Create your household and invite roommates in under 30 seconds.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Calendar,
      title: "Payment Tracking",
      description: "Track who's paid and who hasn't with clear visual indicators.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Bell,
      title: "Gentle Reminders",
      description: "Optional automated reminders to keep everyone on track.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "No tracking, no ads, no profit motive. Your data stays yours.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: Heart,
      title: "Community Driven",
      description: "Built by renters, for renters. Always free, always open.",
      gradient: "from-pink-500 to-rose-500"
    }
  ];

  const stats = [
    { label: "Always Free", value: "100%", description: "No hidden costs ever" },
    { label: "Open Source", value: "∞", description: "Transparent development" },
    { label: "Global Access", value: "24/7", description: "Available worldwide" }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }}></div>

        {/* Modern Navigation */}
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm' 
            : 'bg-transparent'
        }`}>
          <nav className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div className="transition-transform duration-300 group-hover:scale-105">
                  <AppLogoWithBg size={36} />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Rentable
                </span>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-slate-600 hover:text-slate-900 transition-all duration-300 font-medium relative group">
                  Features
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#mission" className="text-slate-600 hover:text-slate-900 transition-all duration-300 font-medium relative group">
                  Mission
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-all duration-300 font-medium relative group">
                  Pricing
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </div>

              <div className="hidden md:flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')}
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium transition-all duration-300"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-6 shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                >
                  Get Started
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-300"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-lg">
                <div className="container mx-auto px-6 py-6 space-y-4">
                  <a href="#features" className="block text-slate-600 hover:text-slate-900 font-medium py-2 transition-colors">Features</a>
                  <a href="#mission" className="block text-slate-600 hover:text-slate-900 font-medium py-2 transition-colors">Mission</a>
                  <a href="#pricing" className="block text-slate-600 hover:text-slate-900 font-medium py-2 transition-colors">Pricing</a>
                  <div className="flex flex-col space-y-3 pt-4 border-t border-slate-200">
                    <Button 
                      variant="ghost" 
                      onClick={() => navigate('/login')}
                      className="justify-start text-slate-600 hover:bg-slate-100"
                    >
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => navigate('/register')}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </nav>
        </header>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6">
          <div className="container mx-auto text-center">
            <div className="max-w-5xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-8 animate-fade-in">
                <Bell className="w-4 h-4 mr-2" />
                Always free, always transparent
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 mb-8 leading-[0.9] tracking-tight">
                Never Chase Your
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent block mt-2">
                  Roommates
                </span>
                <span className="text-slate-600 block mt-2 text-4xl md:text-5xl lg:text-6xl">
                  for Rent Again
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
                Split rent and utilities fairly, track payments transparently, and maintain harmony in your household. 
                Built by renters, for renters.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group border-0"
                >
                  Start Splitting Rent
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                >
                  See How It Works
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 text-slate-500 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Setup in 30 seconds
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Privacy first
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Animated connecting lines */}
        <div className="relative h-32 overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 128">
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                <stop offset="25%" stopColor="#6366f1" stopOpacity="0.6" />
                <stop offset="75%" stopColor="#8b5cf6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path
              d="M 0,64 Q 300,20 600,64 T 1200,64"
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
              strokeDasharray="10,5"
            />
            <path
              d="M 0,80 Q 400,40 800,80 T 1200,80"
              stroke="url(#connectionGradient)"
              strokeWidth="1.5"
              fill="none"
              className="animate-pulse"
              strokeDasharray="8,4"
              style={{ animationDelay: '1s' }}
            />
          </svg>
        </div>

        {/* Features Section */}
        <section id="features" className="relative py-24 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-sm font-medium mb-6">
                Everything you need
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
                Built for Rent Harmony
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light">
                Every feature designed specifically for roommates who want transparency, fairness, and peace of mind.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="group relative border-0 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white/70 backdrop-blur-sm overflow-hidden hover:bg-white"
                  style={{ 
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  <CardHeader className="text-center relative z-10 pb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors mb-3">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center relative z-10 pt-0">
                    <CardDescription className="text-slate-600 text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section id="mission" className="relative py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
          }}></div>
          <div className="container mx-auto px-6 text-center relative">
            <div className="max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Our Mission</h2>
              <p className="text-xl md:text-2xl mb-4 leading-relaxed opacity-90 font-light">
                Enable housing harmony through fair, transparent rent-splitting tools.
              </p>
              <p className="text-lg md:text-xl opacity-80 font-light">
                We believe no roommate should have to chase another for money ever again.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-500 hover:-translate-y-1"
                  style={{ 
                    animationDelay: `${index * 200}ms`
                  }}
                >
                  <div className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xl font-semibold mb-2">{stat.label}</div>
                  <div className="text-blue-200 text-sm opacity-80">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-8 tracking-tight">
                Ready to Transform Your
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                  Rent Experience?
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-600 mb-12 font-light">
                Join thousands of roommates who've found peace of mind with Rentable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group border-0"
                >
                  Get Started for Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <div className="flex items-center text-sm text-slate-500 mt-4 sm:mt-0 sm:ml-8">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  No credit card required
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-16">
          <div className="container mx-auto px-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <AppLogoWithBg size={32} shadow={false} />
              <span className="text-2xl font-bold text-slate-900">Rentable</span>
            </div>
            <p className="text-slate-600 max-w-2xl mx-auto font-light">
              Made with ❤️ for the global renting community. Always free, always open.
            </p>
          </div>
        </footer>
      </div>

      <style>
        {`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }
        `}
      </style>
    </>
  );
};

export default Index;
