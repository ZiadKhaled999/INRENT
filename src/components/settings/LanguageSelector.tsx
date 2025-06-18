
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const LanguageSelector = () => {
  const [language, setLanguage] = useState('en');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  useEffect(() => {
    // Get saved language or default to English
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    
    // Apply RTL for Arabic
    if (newLanguage === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = newLanguage;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">Language</Label>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          Choose your preferred language (with graceful fallbacks to English)
        </p>
      </div>
      
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-full sm:w-[300px]">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="text-xs text-muted-foreground">
        Note: Some features may still appear in English while we work on translations
      </div>
    </div>
  );
};

export default LanguageSelector;
