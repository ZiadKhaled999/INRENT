
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Smartphone, Monitor, Shield, Star, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLogoWithBg from "@/components/AppLogoWithBg";

const DownloadPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b border-emerald-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AppLogoWithBg size={40} />
              <span className="text-2xl font-bold text-gray-900">InRent</span>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-emerald-600 hover:text-emerald-700"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <AppLogoWithBg size={100} />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Download InRent
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get the InRent app on your device and start splitting rent fairly with your roommates
          </p>
        </div>

        {/* Download Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Mobile App</h3>
              <p className="text-gray-600 mb-6">
                Native mobile experience for iOS and Android devices
              </p>
              <div className="space-y-3">
                <Button className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                  <Download className="w-5 h-5 mr-2" />
                  Download for iOS
                </Button>
                <Button className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                  <Download className="w-5 h-5 mr-2" />
                  Download for Android
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Monitor className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Web App</h3>
              <p className="text-gray-600 mb-6">
                Access InRent directly from your browser on any device
              </p>
              <Button 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={() => navigate('/landing')}
              >
                <Monitor className="w-5 h-5 mr-2" />
                Launch Web App
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose InRent?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">Your data is protected with enterprise-grade security</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy to Use</h3>
              <p className="text-gray-600">Intuitive interface designed for everyone</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fair Splitting</h3>
              <p className="text-gray-600">Advanced algorithms ensure everyone pays their fair share</p>
            </div>
          </div>
        </div>

        {/* System Requirements */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">System Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Mobile</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• iOS 12.0 or later</li>
                    <li>• Android 7.0 or later</li>
                    <li>• 50MB free storage</li>
                    <li>• Internet connection required</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Web</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Modern web browser</li>
                    <li>• Chrome, Firefox, Safari, Edge</li>
                    <li>• JavaScript enabled</li>
                    <li>• Internet connection required</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-emerald-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <AppLogoWithBg size={40} />
            <span className="text-2xl font-bold">InRent</span>
          </div>
          <p className="text-emerald-200 mb-4">
            Fair rent splitting for modern roommates
          </p>
          <p className="text-emerald-300 text-sm">
            © 2024 InRent. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DownloadPage;
