import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Calendar, Bell, Shield, Heart } from "lucide-react";
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
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AppLogoWithBg size={52} />
            <span className="text-3xl font-bold text-gray-900 select-none">Rentable</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/login')}
              className="text-gray-600 hover:text-gray-900"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
            >
              Get Started
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Never Chase Your
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> Roommates </span>
            for Rent Again
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Split rent and utilities fairly, track payments transparently, and maintain harmony in your household. 
            Always free, always community-first.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 text-lg"
            >
              Start Splitting Rent
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-4 text-lg border-2 hover:bg-gray-50"
            >
              See How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Rent Harmony
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Built specifically for roommates who want transparency, fairness, and peace of mind.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Enable housing harmony through fair, transparent rent-splitting tools. 
            We believe no roommate should have to chase another for money ever again.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">Always Free</div>
              <div className="text-blue-100">No ads, no tracking, no profit</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">Open Source</div>
              <div className="text-blue-100">Transparent and community-built</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">Global Access</div>
              <div className="text-blue-100">Supporting renters worldwide</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Rent Experience?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of roommates who've found peace of mind with Rentable.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-12 py-4 text-lg"
          >
            Get Started for Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <AppLogoWithBg size={28} shadow={false} />
            <span className="text-xl font-bold text-gray-900">Rentable</span>
          </div>
          <p className="text-gray-600">
            Made with ❤️ for the global renting community. Always free, always open.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
