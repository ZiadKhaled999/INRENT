
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sun, Moon, Settings } from "lucide-react";

const ThemeSelector = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (selectedTheme: string) => {
    const root = document.documentElement;
    
    if (selectedTheme === 'dark') {
      root.classList.add('dark');
    } else if (selectedTheme === 'coffee-crash') {
      root.classList.remove('dark');
      // Apply coffee crash theme (warm browns and oranges)
      root.style.setProperty('--primary', '30 41% 25%'); // Dark brown
      root.style.setProperty('--secondary', '25 34% 86%'); // Light cream
      root.style.setProperty('--accent', '33 100% 50%'); // Orange
      root.style.setProperty('--background', '33 33% 97%'); // Warm white
    } else {
      root.classList.remove('dark');
      // Reset to default light theme
      root.style.removeProperty('--primary');
      root.style.removeProperty('--secondary');
      root.style.removeProperty('--accent');
      root.style.removeProperty('--background');
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium mb-2">Theme</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose your preferred color scheme
        </p>
      </div>
      
      <RadioGroup value={theme} onValueChange={handleThemeChange} className="space-y-3">
        <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
          <RadioGroupItem value="light" id="light" />
          <Sun className="h-4 w-4 text-yellow-500" />
          <Label htmlFor="light" className="flex-1 cursor-pointer">
            <div className="font-medium">Light</div>
            <div className="text-sm text-muted-foreground">Clean and bright interface</div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
          <RadioGroupItem value="dark" id="dark" />
          <Moon className="h-4 w-4 text-blue-500" />
          <Label htmlFor="dark" className="flex-1 cursor-pointer">
            <div className="font-medium">Dark</div>
            <div className="text-sm text-muted-foreground">Easy on the eyes for night owls</div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
          <RadioGroupItem value="coffee-crash" id="coffee-crash" />
          <Settings className="h-4 w-4 text-orange-600" />
          <Label htmlFor="coffee-crash" className="flex-1 cursor-pointer">
            <div className="font-medium">Mid-Coffee Crash ☕</div>
            <div className="text-sm text-muted-foreground">Warm browns when you need that caffeine fix</div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ThemeSelector;
