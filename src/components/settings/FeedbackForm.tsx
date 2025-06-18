
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";

const FeedbackForm = () => {
  const [feedbackType, setFeedbackType] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedbackType || !feedback.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Feedback sent! 🎉",
        description: "Thanks for helping us improve. We'll get back to you if needed!"
      });
      
      // Reset form
      setFeedbackType('');
      setFeedback('');
      setRating(0);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium mb-2">Share Your Feedback</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Tell us what you love or what drives you crazy—we're all ears! 👂
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="feedback-type">Feedback Type *</Label>
          <Select value={feedbackType} onValueChange={setFeedbackType}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="What's on your mind?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="praise">🎉 Praise & Love</SelectItem>
              <SelectItem value="suggestion">💡 Feature Suggestion</SelectItem>
              <SelectItem value="complaint">😤 Complaint</SelectItem>
              <SelectItem value="general">💬 General Feedback</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="rating">Rate Your Experience</Label>
          <div className="flex items-center space-x-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1"
              >
                <Star
                  className={`h-6 w-6 transition-colors ${
                    star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              {rating > 0 && `${rating}/5 stars`}
            </span>
          </div>
        </div>

        <div>
          <Label htmlFor="feedback">Your Feedback *</Label>
          <Textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Don't hold back—tell us everything! We can handle it 💪"
            className="mt-2 min-h-[120px]"
            maxLength={1000}
          />
          <div className="text-xs text-muted-foreground mt-1">
            {feedback.length}/1000 characters
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Sending..." : "Send Feedback 🚀"}
        </Button>
      </form>
    </div>
  );
};

export default FeedbackForm;
