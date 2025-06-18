import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import AppLogoWithBg from '@/components/AppLogoWithBg';
import Footer from '@/components/Footer';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStartedClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
      {/* Header */}
      <header className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AppLogoWithBg size={40} />
            <span className="text-xl font-bold text-gray-900">RentSplit</span>
          </div>
          <div>
            <Button onClick={handleGetStartedClick}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-24 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Simplify Rent Management with RentSplit
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Effortlessly split rent, track payments, and manage your household finances in one place.
        </p>
        <Button size="lg" onClick={handleGetStartedClick}>
          Get Started
        </Button>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Effortless Rent Splitting</h3>
            <p className="text-gray-600">
              Automatically calculate and split rent among roommates, ensuring fair and transparent payments.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Tracking</h3>
            <p className="text-gray-600">
              Keep track of who has paid and who hasn't, with automated reminders for overdue payments.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Household Management</h3>
            <p className="text-gray-600">
              Manage household members, track expenses, and simplify communication with built-in tools.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-100 py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Simplify Your Rent?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Join RentSplit today and experience hassle-free rent management.
          </p>
          <Button size="lg" onClick={handleGetStartedClick}>
            Get Started
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
