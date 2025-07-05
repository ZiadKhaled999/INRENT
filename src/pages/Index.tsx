import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Calendar, Bell, Shield, Heart, Menu, X, ArrowRight, CheckCircle, Mail, MapPin, Code, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
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
      gradient: "from-emerald-500 to-green-500"
    },
    {
      icon: Users,
      title: "Easy Household Setup", 
      description: "Create your household and invite roommates in under 30 seconds.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Calendar,
      title: "Payment Tracking",
      description: "Track who's paid and who hasn't with clear visual indicators.",
      gradient: "from-teal-500 to-green-500"
    },
    {
      icon: Bell,
      title: "Gentle Reminders",
      description: "Optional automated reminders to keep everyone on track.",
      gradient: "from-green-400 to-emerald-400"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "No tracking, no ads, no profit motive. Your data stays yours.",
      gradient: "from-emerald-600 to-teal-600"
    },
    {
      icon: Heart,
      title: "Community Driven",
      description: "Built by renters, for renters. Focused on what matters most.",
      gradient: "from-green-500 to-teal-500"
    }
  ];

  const stats = [
    { label: "Always Free", value: "100%", description: "No hidden costs ever" },
    { label: "Secure Platform", value: "24/7", description: "Reliable and protected" },
    { label: "Global Access", value: "∞", description: "Available worldwide" }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
        {/* Enhanced Money Flow Animation Background */}
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="moneyFlow1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                <stop offset="25%" stopColor="#ffffff" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#059669" stopOpacity="0.8" />
                <stop offset="75%" stopColor="#34d399" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="moneyFlow2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.5" />
                <stop offset="33%" stopColor="#10b981" stopOpacity="0.7" />
                <stop offset="66%" stopColor="#ffffff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            
            {/* Money Transfer Lines - Horizontal Flow */}
            <path
              d="M0,200 Q300,150 600,200 Q900,250 1200,200"
              stroke="url(#moneyFlow1)"
              strokeWidth="4"
              fill="none"
              className="animate-[moneyFlow1_2s_ease-in-out_infinite]"
              strokeDasharray="30,20"
            />
            <path
              d="M0,250 Q400,200 800,250 Q1000,300 1200,250"
              stroke="url(#moneyFlow2)"
              strokeWidth="3"
              fill="none"
              className="animate-[moneyFlow2_2.5s_ease-in-out_infinite_reverse]"
              strokeDasharray="25,15"
            />
            
            {/* Rent Split Visualization Lines */}
            <path
              d="M0,350 C200,320 400,380 600,350 C800,320 1000,380 1200,350"
              stroke="url(#moneyFlow1)"
              strokeWidth="3"
              fill="none"
              className="animate-[rentSplit1_1.8s_ease-in-out_infinite]"
              strokeDasharray="20,10"
            />
            <path
              d="M0,400 Q150,370 300,400 Q450,430 600,400 Q750,370 900,400 Q1050,430 1200,400"
              stroke="url(#moneyFlow2)"
              strokeWidth="2"
              fill="none"
              className="animate-[rentSplit2_2.2s_ease-in-out_infinite_reverse]"
              strokeDasharray="15,8"
            />
            
            {/* Payment Tracking Lines */}
            <path
              d="M0,500 Q300,450 600,500 Q900,550 1200,500"
              stroke="url(#moneyFlow1)"
              strokeWidth="3"
              fill="none"
              className="animate-[paymentTrack1_1.5s_ease-in-out_infinite]"
              strokeDasharray="18,12"
            />
            <path
              d="M0,550 C400,500 800,600 1200,550"
              stroke="url(#moneyFlow2)"
              strokeWidth="2"
              fill="none"
              className="animate-[paymentTrack2_2.8s_ease-in-out_infinite_reverse]"
              strokeDasharray="22,14"
            />
            
            {/* Additional Money Flow Lines */}
            <path
              d="M0,300 Q250,280 500,300 Q750,320 1000,300 Q1100,290 1200,300"
              stroke="url(#moneyFlow1)"
              strokeWidth="2"
              fill="none"
              className="animate-[additionalFlow1_1.3s_ease-in-out_infinite]"
              strokeDasharray="12,6"
            />
            <path
              d="M0,450 Q350,425 700,450 Q950,475 1200,450"
              stroke="url(#moneyFlow2)"
              strokeWidth="3"
              fill="none"
              className="animate-[additionalFlow2_2.1s_ease-in-out_infinite_reverse]"
              strokeDasharray="28,18"
            />
          </svg>
        </div>

        {/* Professional Navigation */}
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl border-b border-emerald-200/50 shadow-lg' 
            : 'bg-transparent'
        }`}>
          <nav className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 group cursor-pointer">
                <div className="relative transition-all duration-500 group-hover:scale-110">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-lg opacity-30"></div>
                  <AppLogoWithBg size={42} className="relative z-10 shadow-xl" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 via-green-600 to-teal-700 bg-clip-text text-transparent">
                  InRent
                </span>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-slate-700 hover:text-emerald-600 transition-all duration-300 font-medium relative group">
                  Features
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <button 
                  onClick={() => navigate('/documentation')}
                  className="text-slate-700 hover:text-emerald-600 transition-all duration-300 font-medium relative group"
                >
                  How It Works
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
                <a href="#mission" className="text-slate-700 hover:text-emerald-600 transition-all duration-300 font-medium relative group">
                  Mission
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </div>

              <div className="hidden md:flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/landing')}
                  className="text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 font-medium transition-all duration-300"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/download')}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium px-6 shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                >
                  Download App
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Menu - Rounded and Semi-transparent */}
            {isMobileMenuOpen && (
              <div className="md:hidden absolute top-full left-4 right-4 bg-white/90 backdrop-blur-xl border border-emerald-200/50 shadow-2xl animate-[slideDown_0.3s_ease-out] rounded-2xl mt-2">
                <div className="px-6 py-6 space-y-4">
                  <a href="#features" className="block text-slate-700 hover:text-emerald-600 font-medium py-2 transition-colors">Features</a>
                  <button 
                    onClick={() => navigate('/documentation')}
                    className="block text-slate-700 hover:text-emerald-600 font-medium py-2 transition-colors text-left w-full"
                  >
                    How It Works
                  </button>
                  <a href="#mission" className="block text-slate-700 hover:text-emerald-600 font-medium py-2 transition-colors">Mission</a>
                  <div className="flex flex-col space-y-3 pt-4 border-t border-emerald-200">
                    <Button 
                      variant="ghost" 
                      onClick={() => navigate('/landing')}
                      className="justify-start text-slate-700 hover:bg-emerald-50"
                    >
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => navigate('/download')}
                      className="bg-gradient-to-r from-emerald-600 to-green-600 text-white"
                    >
                      Download App
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </nav>
        </header>

        {/* Hero Section with Enhanced Animation */}
        <section className="relative pt-32 pb-20 px-6">
          <div className="container mx-auto text-center">
            <div className="max-w-5xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-full text-emerald-700 text-sm font-medium mb-8 animate-[fadeInUp_0.8s_ease-out] shadow-lg">
                <Bell className="w-4 h-4 mr-2" />
                Always free, always transparent
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 mb-8 leading-[0.9] tracking-tight animate-[fadeInUp_1s_ease-out_0.2s_both]">
                Never Chase Your
                <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent block mt-2">
                  Roommates
                </span>
                <span className="text-slate-600 block mt-2 text-4xl md:text-5xl lg:text-6xl animate-[fadeInUp_1s_ease-out_0.4s_both]">
                  for Rent Again
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light animate-[fadeInUp_1s_ease-out_0.6s_both]">
                Split rent and utilities fairly, track payments transparently, and maintain harmony in your household. 
                Built by renters, for renters.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-[fadeInUp_1s_ease-out_0.8s_both]">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/download')}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group border-0"
                >
                  Download InRent
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/documentation')}
                  className="px-8 py-4 text-lg font-semibold border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300 bg-white/70 backdrop-blur-sm"
                >
                  See How It Works
                </Button>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-8 text-slate-500 text-sm animate-[fadeInUp_1s_ease-out_1s_both] relative">
                <div className="flex items-center gap-2 relative z-10">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2 relative z-10">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="animate-[textSlide_3s_ease-in-out_infinite]">Setup in 30 seconds</span>
                </div>
                <div className="flex items-center gap-2 relative z-10">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="animate-[textPulse_2s_ease-in-out_infinite]">Privacy first</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Smooth Video-like Wave Separator */}
        <div className="relative h-32 overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 128">
            <defs>
              <linearGradient id="smoothFlow1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                <stop offset="25%" stopColor="#ffffff" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#34d399" stopOpacity="0.8" />
                <stop offset="75%" stopColor="#ffffff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="smoothFlow2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                <stop offset="33%" stopColor="#10b981" stopOpacity="0.6" />
                <stop offset="66%" stopColor="#34d399" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path
              d="M 0,64 Q 150,30 300,64 Q 450,98 600,64 Q 750,30 900,64 Q 1050,98 1200,64"
              stroke="url(#smoothFlow1)"
              strokeWidth="3"
              fill="none"
              className="animate-[smoothWave1_3s_linear_infinite]"
              strokeDasharray="20,15"
            />
            <path
              d="M 0,80 Q 200,50 400,80 Q 600,110 800,80 Q 1000,50 1200,80"
              stroke="url(#smoothFlow2)"
              strokeWidth="2"
              fill="none"
              className="animate-[smoothWave2_4s_linear_infinite]"
              strokeDasharray="15,10"
            />
            <path
              d="M 0,96 Q 100,70 200,96 Q 300,122 400,96 Q 500,70 600,96 Q 700,122 800,96 Q 900,70 1000,96 Q 1100,122 1200,96"
              stroke="url(#smoothFlow1)"
              strokeWidth="1.5"
              fill="none"
              className="animate-[smoothWave3_5s_linear_infinite]"
              strokeDasharray="12,8"
            />
          </svg>
        </div>

        {/* Features Section with Connecting Lines */}
        <section id="features" className="relative py-24 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 border border-emerald-200 rounded-full text-emerald-700 text-sm font-medium mb-6 animate-[fadeInUp_0.6s_ease-out] shadow-lg">
                Everything you need
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
                Built for Rent Harmony
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
                Every feature designed specifically for roommates who want transparency, fairness, and peace of mind.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
              {/* Connecting Lines SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}>
                <defs>
                  <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#34d399" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                {/* Row 1 connections */}
                <path
                  d="M 33% 25% L 66% 25%"
                  stroke="url(#connectionGradient)"
                  strokeWidth="2"
                  fill="none"
                  className="animate-[connectionFlow_4s_ease-in-out_infinite] hidden lg:block"
                  strokeDasharray="8,4"
                />
                {/* Row 2 connections */}
                <path
                  d="M 33% 75% L 66% 75%"
                  stroke="url(#connectionGradient)"
                  strokeWidth="2"
                  fill="none"
                  className="animate-[connectionFlow_4s_ease-in-out_infinite_1s] hidden lg:block"
                  strokeDasharray="8,4"
                />
                {/* Vertical connections */}
                <path
                  d="M 16.5% 40% L 16.5% 60%"
                  stroke="url(#connectionGradient)"
                  strokeWidth="2"
                  fill="none"
                  className="animate-[connectionFlow_3s_ease-in-out_infinite_0.5s] hidden lg:block"
                  strokeDasharray="6,3"
                />
                <path
                  d="M 83.5% 40% L 83.5% 60%"
                  stroke="url(#connectionGradient)"
                  strokeWidth="2"
                  fill="none"
                  className="animate-[connectionFlow_3s_ease-in-out_infinite_1.5s] hidden lg:block"
                  strokeDasharray="6,3"
                />
              </svg>

              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="group relative border-0 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm overflow-hidden hover:bg-white animate-[fadeInUp_0.6s_ease-out] z-10"
                  style={{ 
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  <CardHeader className="text-center relative z-10 pb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                      <feature.icon className="w-8 h-8 text-white group-hover:animate-[iconPulse_0.6s_ease-out]" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-3">
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
        <section id="mission" className="relative py-32 bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800">
              <defs>
                <pattern id="missionPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                  <circle cx="7" cy="7" r="1" fill="white" opacity="0.3" className="animate-[twinkle_3s_ease-in-out_infinite]" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#missionPattern)" />
            </svg>
          </div>
          <div className="container mx-auto px-6 text-center relative">
            <div className="max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight animate-[fadeInUp_0.8s_ease-out]">Our Mission</h2>
              <p className="text-xl md:text-2xl mb-4 leading-relaxed opacity-90 font-light animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
                Enable housing harmony through fair, transparent rent-splitting tools.
              </p>
              <p className="text-lg md:text-xl opacity-80 font-light animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
                We believe no roommate should have to chase another for money ever again.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-500 hover:-translate-y-1 animate-[fadeInUp_0.6s_ease-out]"
                  style={{ 
                    animationDelay: `${index * 200}ms`
                  }}
                >
                  <div className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xl font-semibold mb-2">{stat.label}</div>
                  <div className="text-green-200 text-sm opacity-80">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Static Button */}
        <section className="py-32 px-6 bg-gradient-to-br from-green-50 to-emerald-50 relative overflow-hidden">
          <div className="absolute inset-0">
            <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 1200 800">
              <path
                d="M 0,400 Q 400,200 800,400 T 1200,400"
                stroke="url(#smoothFlow1)"
                strokeWidth="2"
                fill="none"
                className="animate-[gentleFlow_15s_linear_infinite]"
              />
            </svg>
          </div>
          <div className="container mx-auto text-center relative">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-8 tracking-tight animate-[fadeInUp_0.8s_ease-out]">
                Ready to Transform Your
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent block">
                  Rent Experience?
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-600 mb-12 font-light animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
                Join thousands of roommates who've found peace of mind with InRent.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/download')}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-12 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group border-0"
                >
                  Download InRent
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <div className="flex items-center text-sm text-slate-500 mt-4 sm:mt-0 sm:ml-8">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                  No credit card required
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Footer with InRent-specific content */}
        <footer className="bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 text-white py-20 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1200 600">
              <defs>
                <linearGradient id="footerFlow1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="footerFlow2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#34d399" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              
              {/* Flowing lines representing rent payments */}
              <path
                d="M0,150 Q300,100 600,150 Q900,200 1200,150"
                stroke="url(#footerFlow1)"
                strokeWidth="3"
                fill="none"
                className="animate-[footerFlow1_4s_ease-in-out_infinite]"
                strokeDasharray="40,25"
              />
              <path
                d="M0,250 Q400,200 800,250 Q1000,300 1200,250"
                stroke="url(#footerFlow2)"
                strokeWidth="2"
                fill="none"
                className="animate-[footerFlow2_3.5s_ease-in-out_infinite_reverse]"
                strokeDasharray="30,20"
              />
              <path
                d="M0,350 C200,320 400,380 600,350 C800,320 1000,380 1200,350"
                stroke="url(#footerFlow1)"
                strokeWidth="2"
                fill="none"
                className="animate-[footerFlow3_5s_ease-in-out_infinite]"
                strokeDasharray="25,15"
              />
              <path
                d="M0,450 Q250,400 500,450 Q750,500 1000,450 Q1100,425 1200,450"
                stroke="url(#footerFlow2)"
                strokeWidth="1.5"
                fill="none"
                className="animate-[footerFlow4_4.5s_ease-in-out_infinite_reverse]"
                strokeDasharray="20,12"
              />
            </svg>
          </div>

          <div className="container mx-auto px-6 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              
              {/* Brand Section */}
              <div className="lg:col-span-1">
                <div className="flex items-center space-x-3 mb-6 animate-[fadeInUp_0.8s_ease-out]">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-md opacity-50"></div>
                    <AppLogoWithBg size={40} className="relative z-10" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                    InRent
                  </span>
                </div>
                <p className="text-green-200 mb-6 text-sm leading-relaxed animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
                  InRent is a dynamic app designed to simplify your rent splitting by offering fair, transparent tools for roommates. Whether you're managing household finances or tracking payments.
                </p>
                <div className="flex space-x-4 animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
                  <div className="w-10 h-10 bg-green-800/50 hover:bg-green-700/70 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer group">
                    <Facebook className="w-5 h-5 text-green-200 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                  </div>
                  <div className="w-10 h-10 bg-green-800/50 hover:bg-green-700/70 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer group">
                    <Twitter className="w-5 h-5 text-green-200 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                  </div>
                  <div className="w-10 h-10 bg-green-800/50 hover:bg-green-700/70 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer group">
                    <Instagram className="w-5 h-5 text-green-200 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                  </div>
                  <div className="w-10 h-10 bg-green-800/50 hover:bg-green-700/70 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer group">
                    <Linkedin className="w-5 h-5 text-green-200 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="animate-[fadeInUp_0.8s_ease-out_0.3s_both]">
                <h3 className="text-xl font-bold text-white mb-6">Our Links</h3>
                <ul className="space-y-3">
                  <li>
                    <button 
                      onClick={() => navigate('/')}
                      className="text-green-200 hover:text-white hover:translate-x-2 transition-all duration-300 text-sm flex items-center group"
                    >
                      <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      Home
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigate('/documentation')}
                      className="text-green-200 hover:text-white hover:translate-x-2 transition-all duration-300 text-sm flex items-center group"
                    >
                      <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      How It Works
                    </button>
                  </li>
                  <li>
                    <a 
                      href="#features"
                      className="text-green-200 hover:text-white hover:translate-x-2 transition-all duration-300 text-sm flex items-center group"
                    >
                      <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      Features
                    </a>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigate('/dashboard')}
                      className="text-green-200 hover:text-white hover:translate-x-2 transition-all duration-300 text-sm flex items-center group"
                    >
                      <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      Dashboard
                    </button>
                  </li>
                </ul>
              </div>

              {/* Other Links */}
              <div className="animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
                <h3 className="text-xl font-bold text-white mb-6">Other Links</h3>
                <ul className="space-y-3">
                  <li>
                    <button 
                      onClick={() => navigate('/privacy')}
                      className="text-green-200 hover:text-white hover:translate-x-2 transition-all duration-300 text-sm flex items-center group"
                    >
                      <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigate('/terms')}
                      className="text-green-200 hover:text-white hover:translate-x-2 transition-all duration-300 text-sm flex items-center group"
                    >
                      <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      Terms & Conditions
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigate('/security')}
                      className="text-green-200 hover:text-white hover:translate-x-2 transition-all duration-300 text-sm flex items-center group"
                    >
                      <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      Security
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigate('/support')}
                      className="text-green-200 hover:text-white hover:translate-x-2 transition-all duration-300 text-sm flex items-center group"
                    >
                      <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      Support
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigate('/faq')}
                      className="text-green-200 hover:text-white hover:translate-x-2 transition-all duration-300 text-sm flex items-center group"
                    >
                      <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      FAQ
                    </button>
                  </li>
                </ul>
              </div>

              {/* Contact Section */}
              <div className="animate-[fadeInUp_0.8s_ease-out_0.5s_both]">
                <h3 className="text-xl font-bold text-white mb-6">Contact Us</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 group">
                    <div className="w-8 h-8 bg-green-800/50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-green-700/70 transition-all duration-300">
                      <Mail className="w-4 h-4 text-green-200 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <p className="text-green-200 text-sm group-hover:text-white transition-colors duration-300">
                        support@inrent.app
                      </p>
                      <p className="text-green-300 text-xs group-hover:text-green-100 transition-colors duration-300">
                        hello@inrent.app
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 group">
                    <div className="w-8 h-8 bg-green-800/50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-green-700/70 transition-all duration-300">
                      <MapPin className="w-4 h-4 text-green-200 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <p className="text-green-200 text-sm group-hover:text-white transition-colors duration-300">
                      San Francisco, CA
                    </p>
                  </div>
                  <div className="flex items-start space-x-3 group">
                    <div className="w-8 h-8 bg-green-800/50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-green-700/70 transition-all duration-300">
                      <Code className="w-4 h-4 text-green-200 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <p className="text-green-200 text-sm group-hover:text-white transition-colors duration-300">
                        Built by Renters
                      </p>
                      <p className="text-green-300 text-xs group-hover:text-green-100 transition-colors duration-300">
                        For Renters
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-green-800/50 pt-8 mt-8">
              <div className="flex flex-col md:flex-row justify-between items-center animate-[fadeInUp_0.8s_ease-out_0.6s_both]">
                <p className="text-green-300 text-sm mb-4 md:mb-0">
                  © 2024 <span className="font-semibold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">InRent</span>. All rights reserved.
                </p>
                <div className="flex items-center space-x-6 text-sm">
                  <span className="text-green-200 flex items-center">
                    <Shield className="w-4 h-4 mr-2 animate-[iconPulse_2s_ease-in-out_infinite]" />
                    Privacy First
                  </span>
                  <span className="text-green-200 flex items-center">
                    <Heart className="w-4 h-4 mr-2 animate-[heartBeat_2s_ease-in-out_infinite]" />
                    Made with Love
                  </span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style>
        {`
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

          @keyframes textSlide {
            0%, 100% { transform: translateX(0); opacity: 1; }
            25% { transform: translateX(5px); opacity: 0.8; }
            50% { transform: translateX(-3px); opacity: 1; }
            75% { transform: translateX(2px); opacity: 0.9; }
          }

          @keyframes textPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(0.98); }
          }

          @keyframes moneyFlow1 {
            0%, 100% { stroke-dashoffset: 0; }
            50% { stroke-dashoffset: 50; }
          }

          @keyframes moneyFlow2 {
            0%, 100% { stroke-dashoffset: 0; }
            50% { stroke-dashoffset: -40; }
          }

          @keyframes rentSplit1 {
            0%, 100% { stroke-dashoffset: 0; }
            50% { stroke-dashoffset: 30; }
          }

          @keyframes rentSplit2 {
            0%, 100% { stroke-dashoffset: 0; }
            50% { stroke-dashoffset: -23; }
          }

          @keyframes paymentTrack1 {
            0%, 100% { stroke-dashoffset: 0; }
            50% { stroke-dashoffset: 30; }
          }

          @keyframes paymentTrack2 {
            0%, 100% { stroke-dashoffset: 0; }
            50% { stroke-dashoffset: -36; }
          }

          @keyframes additionalFlow1 {
            0%, 100% { stroke-dashoffset: 0; }
            50% { stroke-dashoffset: 18; }
          }

          @keyframes additionalFlow2 {
            0%, 100% { stroke-dashoffset: 0; }
            50% { stroke-dashoffset: -46; }
          }

          @keyframes smoothWave1 {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 35; }
          }

          @keyframes smoothWave2 {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -25; }
          }

          @keyframes smoothWave3 {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 20; }
          }

          @keyframes connectionFlow {
            0%, 100% { stroke-dashoffset: 0; opacity: 0.6; }
            50% { stroke-dashoffset: 12; opacity: 1; }
          }

          @keyframes iconPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }

          @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }

          @keyframes gentleFlow {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 100; }
          }

          @keyframes slideDown {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          @keyframes footerFlow1 {
            0%, 100% { stroke-dashoffset: 0; opacity: 0.6; }
            50% { stroke-dashoffset: 65; opacity: 1; }
          }

          @keyframes footerFlow2 {
            0%, 100% { stroke-dashoffset: 0; opacity: 0.5; }
            50% { stroke-dashoffset: -50; opacity: 0.8; }
          }

          @keyframes footerFlow3 {
            0%, 100% { stroke-dashoffset: 0; opacity: 0.4; }
            50% { stroke-dashoffset: 40; opacity: 0.7; }
          }

          @keyframes footerFlow4 {
            0%, 100% { stroke-dashoffset: 0; opacity: 0.3; }
            50% { stroke-dashoffset: -32; opacity: 0.6; }
          }

          @keyframes heartBeat {
            0%, 100% { transform: scale(1); }
            25% { transform: scale(1.1); }
            50% { transform: scale(1); }
            75% { transform: scale(1.05); }
          }
        `}
      </style>
    </>
  );
};

export default Index;
