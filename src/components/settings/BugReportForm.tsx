
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const BugReportForm = () => {
  const [bugTitle, setBugTitle] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [severity, setSeverity] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bugTitle.trim() || !bugDescription.trim() || !severity) {
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
        title: "Bug report submitted! 🐛",
        description: "Our dev team will investigate this faster than you can say 'stack overflow'"
      });
      
      // Reset form
      setBugTitle('');
      setBugDescription('');
      setSeverity('');
      setStepsToReproduce('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium mb-2">Report a Bug</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Found a glitch? Help us squash it! Our code needs all the first-aid it can get 🩹
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="bug-title">Bug Title *</Label>
          <Input
            id="bug-title"
            value={bugTitle}
            onChange={(e) => setBugTitle(e.target.value)}
            placeholder="e.g., App crashes when I try to..."
            className="mt-2"
            maxLength={100}
          />
        </div>

        <div>
          <Label htmlFor="severity">Severity *</Label>
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="How bad is it?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">🟢 Low - Minor annoyance</SelectItem>
              <SelectItem value="medium">🟡 Medium - Somewhat frustrating</SelectItem>
              <SelectItem value="high">🟠 High - Major problem</SelectItem>
              <SelectItem value="critical">🔴 Critical - App is unusable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="bug-description">Bug Description *</Label>
          <Textarea
            id="bug-description"
            value={bugDescription}
            onChange={(e) => setBugDescription(e.target.value)}
            placeholder="Describe what happened, what you expected, and any error messages you saw..."
            className="mt-2 min-h-[100px]"
            maxLength={500}
          />
          <div className="text-xs text-muted-foreground mt-1">
            {bugDescription.length}/500 characters
          </div>
        </div>

        <div>
          <Label htmlFor="steps">Steps to Reproduce (Optional)</Label>
          <Textarea
            id="steps"
            value={stepsToReproduce}
            onChange={(e) => setStepsToReproduce(e.target.value)}
            placeholder="1. Go to... 2. Click on... 3. See error"
            className="mt-2 min-h-[80px]"
            maxLength={300}
          />
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Submitting..." : "Report Bug 🐛"}
        </Button>
      </form>
    </div>
  );
};

export default BugReportForm;
