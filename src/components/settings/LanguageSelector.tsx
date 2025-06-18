
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: 'en', name: t('english'), flag: '🇺🇸' },
    { code: 'ar', name: t('arabic'), flag: '🇸🇦' },
    { code: 'es', name: t('spanish'), flag: '🇪🇸' }
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">{t('language')}</Label>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          {t('chooseLanguage')}
        </p>
      </div>
      
      <Select value={language} onValueChange={setLanguage}>
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
    </div>
  );
};

export default LanguageSelector;
