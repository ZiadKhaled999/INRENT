
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Star, Share } from "lucide-react";

const RateAndShare = () => {
  const [userRating, setUserRating] = useState(0);
  const { toast } = useToast();

  const handleRating = (rating: number) => {
    setUserRating(rating);
    toast({
      title: `Thanks for the ${rating}-star rating! ⭐`,
      description: rating >= 4 ? "You're awesome! 🎉" : "We'll work harder to earn those extra stars! 💪"
    });
  };

  const handleShare = (platform: string) => {
    const shareText = "Check out this amazing rent management app! It's making my life so much easier 🏠✨";
    const appUrl = window.location.origin;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + appUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(appUrl);
        toast({
          title: "Link copied! 📋",
          description: "Share it with your amigos!"
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Rate & Share</CardTitle>
        <CardDescription>
          Love the app? Help spread the word to your amigos! 🎉
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Section */}
        <div>
          <h3 className="font-semibold text-base mb-3">Rate Your Experience</h3>
          <div className="flex items-center space-x-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={`h-8 w-8 transition-colors ${
                    star <= userRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
                  }`}
                />
              </button>
            ))}
          </div>
          {userRating > 0 && (
            <p className="text-sm text-muted-foreground">
              Thanks for the {userRating}-star rating! Your feedback helps us improve.
            </p>
          )}
        </div>

        {/* Share Section */}
        <div>
          <h3 className="font-semibold text-base mb-3">Tell Your Amigos</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Share the love and help your friends discover this life-changing app!
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button
              variant="outline"
              onClick={() => handleShare('twitter')}
              className="flex flex-col items-center gap-2 h-auto py-3"
            >
              <span className="text-lg">🐦</span>
              <span className="text-xs">Twitter</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleShare('facebook')}
              className="flex flex-col items-center gap-2 h-auto py-3"
            >
              <span className="text-lg">📘</span>
              <span className="text-xs">Facebook</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleShare('whatsapp')}
              className="flex flex-col items-center gap-2 h-auto py-3"
            >
              <span className="text-lg">💬</span>
              <span className="text-xs">WhatsApp</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleShare('copy')}
              className="flex flex-col items-center gap-2 h-auto py-3"
            >
              <Share className="h-4 w-4" />
              <span className="text-xs">Copy Link</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RateAndShare;
