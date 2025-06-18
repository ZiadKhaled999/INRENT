
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sun, Moon, Settings } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium mb-2">{t('theme')}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t('chooseColorScheme')}
        </p>
      </div>
      
      <RadioGroup value={theme} onValueChange={setTheme} className="space-y-3">
        <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
          <RadioGroupItem value="light" id="light" />
          <Sun className="h-4 w-4 text-yellow-500" />
          <Label htmlFor="light" className="flex-1 cursor-pointer">
            <div className="font-medium">{t('light')}</div>
            <div className="text-sm text-muted-foreground">{t('lightDesc')}</div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
          <RadioGroupItem value="dark" id="dark" />
          <Moon className="h-4 w-4 text-blue-500" />
          <Label htmlFor="dark" className="flex-1 cursor-pointer">
            <div className="font-medium">{t('dark')}</div>
            <div className="text-sm text-muted-foreground">{t('darkDesc')}</div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
          <RadioGroupItem value="coffee-crash" id="coffee-crash" />
          <Settings className="h-4 w-4 text-orange-600" />
          <Label htmlFor="coffee-crash" className="flex-1 cursor-pointer">
            <div className="font-medium">{t('coffeeTheme')}</div>
            <div className="text-sm text-muted-foreground">{t('coffeeDesc')}</div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ThemeSelector;
