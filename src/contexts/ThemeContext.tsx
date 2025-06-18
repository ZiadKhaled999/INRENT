
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'coffee-crash';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (selectedTheme: Theme) => {
    const root = document.documentElement;
    
    // Remove all theme classes first
    root.classList.remove('dark');
    
    if (selectedTheme === 'dark') {
      root.classList.add('dark');
      // Reset custom properties
      root.style.removeProperty('--primary');
      root.style.removeProperty('--secondary');
      root.style.removeProperty('--accent');
      root.style.removeProperty('--background');
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

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
