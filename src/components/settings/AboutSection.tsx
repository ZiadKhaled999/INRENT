
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutSection = () => {
  const { t } = useLanguage();
  
  const teamMembers = [
    { name: "Alex the Code Whisperer", role: "Full-Stack Wizard", quirk: "Talks to bugs (literally)" },
    { name: "Sam the Design Ninja", role: "UI/UX Perfectionist", quirk: "Has 47 shades of blue favorited" },
    { name: "Jordan the Data Wrangler", role: "Backend Architect", quirk: "Dreams in SQL queries" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">{t('aboutUs')}</CardTitle>
        <CardDescription>
          {t('scrappyStartup')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mission */}
        <div>
          <h3 className="font-semibold text-base mb-3">Our Mission 🚀</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We're on a mission to make rent management as smooth as your morning coffee. 
            No more awkward conversations about money, no more lost receipts, no more stress. 
            Just simple, transparent, and delightful property management for everyone.
          </p>
        </div>

        {/* Team */}
        <div>
          <h3 className="font-semibold text-base mb-3">Meet the Team 👋</h3>
          <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-1">
            {teamMembers.map((member, index) => (
              <div key={index} className="p-3 rounded-lg border bg-card/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="font-medium text-sm">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.role}</div>
                  </div>
                  <Badge variant="secondary" className="text-xs w-fit">
                    {member.quirk}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Info */}
        <div>
          <h3 className="font-semibold text-base mb-3">Our Quirks ✨</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <span>☕</span>
              <span>Powered by excessive amounts of coffee and determination</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span>🎵</span>
              <span>We code to lo-fi beats and occasional heavy metal</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span>🐛</span>
              <span>We name our bugs after cartoon characters (current favorite: Bugs Bunny)</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span>🌱</span>
              <span>Started in a garage, now we have a whole coffee shop corner!</span>
            </div>
          </div>
        </div>

        {/* Version Info */}
        <div className="pt-4 border-t">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>Version 1.0.0 - "The Caffeinated Launch"</span>
            <span>Built with ❤️ and way too much TypeScript</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AboutSection;
