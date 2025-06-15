
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
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute top-1/2 -left-32 w-64 h-64 bg-gradient-to-r from-green-100 to-blue-100 rounded-full opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute -bottom-32 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full opacity-40 animate-pulse delay-2000"></div>
        </div>

        {/* Modern Navigation */}
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/80 backdrop-blur-lg border-b border-gray-200' : 'bg-transparent'
        }`}>
          <nav className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AppLogoWithBg size={40} />
                <span className="text-2xl font-bold text-gray-900">Rentable</span>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">Features</a>
                <a href="#mission" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">Mission</a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">Pricing</a>
              </div>

              <div className="hidden md:flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-6 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Get Started
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
                <div className="container mx-auto px-6 py-4 space-y-4">
                  <a href="#features" className="block text-gray-600 hover:text-gray-900 font-medium">Features</a>
                  <a href="#mission" className="block text-gray-600 hover:text-gray-900 font-medium">Mission</a>
                  <a href="#pricing" className="block text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
                  <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                    <Button 
                      variant="ghost" 
                      onClick={() => navigate('/login')}
                      className="justify-start text-gray-600"
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
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                Never Chase Your
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                  Roommates
                </span>
                for Rent Again
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Split rent and utilities fairly, track payments transparently, and maintain harmony in your household. 
                Always free, always community-first.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  Start Splitting Rent
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                >
                  See How It Works
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Animated Connecting Lines */}
        <div className="relative">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            <defs>
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#6366f1" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path
              d="M 10,50 Q 300,10 590,50 T 1170,50"
              stroke="url(#line-gradient)"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
              style={{
                strokeDasharray: "10,5",
                animation: "dash 3s linear infinite"
              }}
            />
          </svg>
        </div>

        {/* Features Section */}
        <section id="features" className="relative py-24 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Everything You Need for Rent Harmony
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Built specifically for roommates who want transparency, fairness, and peace of mind.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="group relative border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm overflow-hidden"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  <CardHeader className="text-center relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center relative z-10">
                    <CardDescription className="text-gray-600 text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section id="mission" className="relative py-24 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
          }}></div>
          <div className="container mx-auto px-6 text-center relative">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Our Mission</h2>
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed opacity-90">
              Enable housing harmony through fair, transparent rent-splitting tools. 
              We believe no roommate should have to chase another for money ever again.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
                  style={{ 
                    animationDelay: `${index * 200}ms`,
                    animation: 'fadeInUp 0.8s ease-out forwards'
                  }}
                >
                  <div className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xl font-semibold mb-2">{stat.label}</div>
                  <div className="text-blue-200 text-sm">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Ready to Transform Your Rent Experience?
              </h2>
              <p className="text-xl text-gray-600 mb-12">
                Join thousands of roommates who've found peace of mind with Rentable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  Get Started for Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <div className="flex items-center text-sm text-gray-500 mt-4 sm:mt-0 sm:ml-8">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  No credit card required
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-50 py-12 border-t border-gray-200">
          <div className="container mx-auto px-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <AppLogoWithBg size={32} shadow={false} />
              <span className="text-2xl font-bold text-gray-900">Rentable</span>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Made with ❤️ for the global renting community. Always free, always open.
            </p>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes dash {
          to {
            stroke-dashoffset: -30;
          }
        }
      `}</style>
    </>
  );
};

export default Index;
