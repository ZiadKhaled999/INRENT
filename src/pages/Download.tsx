
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Smartphone, Monitor, Shield, Star, Users, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AppLogoWithBg from "@/components/AppLogoWithBg";
import { DownloadCounter } from "@/utils/downloadCounter";

const DownloadPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [downloadCount, setDownloadCount] = useState<string>('0');

  useEffect(() => {
    setDownloadCount(DownloadCounter.getFormattedCount());
  }, []);

  const handleDownload = async (type: 'apk' | 'ios' | 'android', url: string) => {
    if (type === 'ios' || type === 'android') {
      toast({
        title: "Coming Soon!",
        description: `${type === 'ios' ? 'App Store' : 'Google Play'} version is not available yet. Stay tuned!`,
        variant: "destructive",
      });
      return;
    }

    // For APK download
    const counted = await DownloadCounter.trackDownload(type, url);
    if (counted) {
      setDownloadCount(DownloadCounter.getFormattedCount());
      toast({
        title: "Download Started!",
        description: "InRent APK download has begun. Thank you!",
      });
    }
  };

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

        {/* Download Counter */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full">
            <Download className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-800 font-medium">{downloadCount} downloads</span>
          </div>
        </div>

        {/* Download Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Download for iOS</h3>
              <p className="text-gray-600 mb-6">
                Get InRent on your iPhone or iPad from the App Store
              </p>
              <Button 
                className="w-full h-12 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white relative"
                onClick={() => handleDownload('ios', '#')}
              >
                <Clock className="w-5 h-5 mr-2" />
                App Store
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                  Soon
                </span>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Download for Android</h3>
              <p className="text-gray-600 mb-6">
                Get InRent on your Android device from Google Play Store
              </p>
              <Button 
                className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white relative"
                onClick={() => handleDownload('android', '#')}
              >
                <Clock className="w-5 h-5 mr-2" />
                Google Play
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                  Soon
                </span>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Download APK</h3>
              <p className="text-gray-600 mb-6">
                Get the Android APK file directly for manual installation
              </p>
              <Button 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white"
                onClick={() => handleDownload('apk', '/lovable-uploads/inrent.apk')}
              >
                <Download className="w-5 h-5 mr-2" />
                Download APK
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
              <div className="grid grid-cols-1 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Mobile</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• iOS 12.0 or later</li>
                    <li>• Android 7.0 or later</li>
                    <li>• 50MB free storage</li>
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
