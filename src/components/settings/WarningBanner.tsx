
import React, { useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const WarningBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Alert className="border-orange-200 bg-orange-50 text-orange-800">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <AlertDescription className="text-sm">
            <span className="font-semibold">🎉 Heads up!</span> This app is completely free—for now! 
            We're in our startup phase and loving every caffeinated moment. Enjoy all features while we perfect this magic! ✨
          </AlertDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="h-auto p-1 text-orange-600 hover:text-orange-800 hover:bg-orange-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
};

export default WarningBanner;
