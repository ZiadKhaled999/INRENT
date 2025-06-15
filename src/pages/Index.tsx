
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Calendar, Bell, Shield, Heart, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLogoWithBg from "@/components/AppLogoWithBg";

const LOGO_SRC = "/lovable-uploads/ff5803ec-2385-43a8-aebc-d33664bd076d.png";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: DollarSign,
      title: "Fair Rent Splitting",
      description: "Automatically split rent and utilities with customizable shares for each roommate."
    },
    {
      icon: Users,
      title: "Easy Household Setup",
      description: "Create your household and invite roommates in under 30 seconds."
    },
    {
      icon: Calendar,
      title: "Payment Tracking",
      description: "Track who's paid and who hasn't with clear visual indicators."
    },
    {
      icon: Bell,
      title: "Gentle Reminders",
      description: "Optional automated reminders to keep everyone on track."
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "No tracking, no ads, no profit motive. Your data stays yours."
    },
    {
      icon: Heart,
      title: "Community Driven",
      description: "Built by renters, for renters. Always free, always open."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Mobile-First Header */}
      <header className="container mx-auto px-4 py-4 sm:py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <AppLogoWithBg size={44} className="sm:hidden" />
            <AppLogoWithBg size={52} className="hidden sm:block" />
            <span className="text-2xl sm:text-3xl font-bold text-gray-900 select-none">Rentable</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/login')}
              className="text-gray-600 hover:text-gray-900 text-sm sm:text-base px-2 sm:px-4"
            >
              Sign In
            </Button>
            <Button 
              size="sm"
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white text-sm sm:text-base px-3 sm:px-4"
            >
              Get Started
            </Button>
          </div>
        </nav>
      </header>

      {/* Mobile-Optimized Hero Section */}
      <section className="container mx-auto px-4 py-8 sm:py-12 lg:py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Never Chase Your
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent block sm:inline"> Roommates </span>
            for Rent Again
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            Split rent and utilities fairly, track payments transparently, and maintain harmony in your household. 
            Always free, always community-first.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg touch-manipulation"
            >
              Start Splitting Rent
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg border-2 hover:bg-gray-50 touch-manipulation"
            >
              See How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Mobile-First Features Grid */}
      <section className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            Everything You Need for Rent Harmony
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Built specifically for roommates who want transparency, fairness, and peace of mind.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 touch-manipulation">
              <CardHeader className="text-center pb-3 sm:pb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 px-2">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <CardDescription className="text-gray-600 text-center leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Mobile-Optimized Mission Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Our Mission</h2>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
            Enable housing harmony through fair, transparent rent-splitting tools. 
            We believe no roommate should have to chase another for money ever again.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <div className="text-center p-4">
              <div className="text-2xl sm:text-3xl font-bold mb-2">Always Free</div>
              <div className="text-blue-100 text-sm sm:text-base">No ads, no tracking, no profit</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl sm:text-3xl font-bold mb-2">Open Source</div>
              <div className="text-blue-100 text-sm sm:text-base">Transparent and community-built</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl sm:text-3xl font-bold mb-2">Global Access</div>
              <div className="text-blue-100 text-sm sm:text-base">Supporting renters worldwide</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-Responsive CTA Section */}
      <section className="container mx-auto px-4 py-8 sm:py-12 lg:py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
            Ready to Transform Your Rent Experience?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 px-4">
            Join thousands of roommates who've found peace of mind with Rentable.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg touch-manipulation"
          >
            Get Started for Free
          </Button>
        </div>
      </section>

      {/* Mobile-Friendly Footer */}
      <footer className="bg-gray-50 py-6 sm:py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
            <AppLogoWithBg size={24} className="sm:hidden" shadow={false} />
            <AppLogoWithBg size={28} className="hidden sm:block" shadow={false} />
            <span className="text-lg sm:text-xl font-bold text-gray-900">Rentable</span>
          </div>
          <p className="text-gray-600 text-sm sm:text-base px-4">
            Made with ❤️ for the global renting community. Always free, always open.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
