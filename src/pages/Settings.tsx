
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ThemeSelector from "@/components/settings/ThemeSelector";
import LanguageSelector from "@/components/settings/LanguageSelector";
import FeedbackForm from "@/components/settings/FeedbackForm";
import BugReportForm from "@/components/settings/BugReportForm";
import AboutSection from "@/components/settings/AboutSection";
import RateAndShare from "@/components/settings/RateAndShare";
import WarningBanner from "@/components/settings/WarningBanner";
import { Settings as SettingsIcon, MessageSquare, Bug } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Settings = () => {
  const { t } = useLanguage();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [bugReportOpen, setBugReportOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('settings')}</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {t('customizeAppLooks')}
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
            <CardTitle className="text-lg sm:text-xl">{t('appearancePreferences')}</CardTitle>
            <CardDescription>
              {t('customizeAppLooks')}
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
            <CardTitle className="text-lg sm:text-xl">{t('feedbackSupport')}</CardTitle>
            <CardDescription>
              {t('helpImprove')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2 h-auto p-4 justify-start"
                  >
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    <div className="text-left">
                      <div className="font-medium">{t('shareFeedback')}</div>
                      <div className="text-sm text-muted-foreground">Tell us what you love or hate</div>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{t('shareFeedback')}</DialogTitle>
                  </DialogHeader>
                  <FeedbackForm onSuccess={() => setFeedbackOpen(false)} />
                </DialogContent>
              </Dialog>

              <Dialog open={bugReportOpen} onOpenChange={setBugReportOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2 h-auto p-4 justify-start"
                  >
                    <Bug className="h-5 w-5 text-red-500" />
                    <div className="text-left">
                      <div className="font-medium">{t('reportBug')}</div>
                      <div className="text-sm text-muted-foreground">Help us squash bugs</div>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{t('reportBug')}</DialogTitle>
                  </DialogHeader>
                  <BugReportForm onSuccess={() => setBugReportOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
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
