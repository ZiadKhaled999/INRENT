
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ThemeSelector from "@/components/settings/ThemeSelector";
import LanguageSelector from "@/components/settings/LanguageSelector";
import FeedbackForm from "@/components/settings/FeedbackForm";
import BugReportForm from "@/components/settings/BugReportForm";
import AboutSection from "@/components/settings/AboutSection";
import RateAndShare from "@/components/settings/RateAndShare";
import WarningBanner from "@/components/settings/WarningBanner";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Customize your experience and manage your preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <WarningBanner />
      </div>

      {/* Settings Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Appearance & Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Appearance & Preferences</CardTitle>
            <CardDescription>
              Customize how the app looks and feels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ThemeSelector />
            <Separator />
            <LanguageSelector />
          </CardContent>
        </Card>

        {/* Feedback & Support */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Feedback & Support</CardTitle>
            <CardDescription>
              Help us improve by sharing your thoughts and reporting issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FeedbackForm />
            <Separator />
            <BugReportForm />
          </CardContent>
        </Card>

        {/* Rate & Share */}
        <RateAndShare />

        {/* About */}
        <AboutSection />
      </div>
    </div>
  );
};

export default Settings;
