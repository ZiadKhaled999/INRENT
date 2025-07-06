import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PinAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'create' | 'verify';
}

const PinAuthModal: React.FC<PinAuthModalProps> = ({ isOpen, onClose, onSuccess, mode }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const hashPin = async (pinValue: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(pinValue + user?.id); // Add user ID as salt
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setLoading(true);

    try {
      if (mode === 'create') {
        if (pin !== confirmPin) {
          toast({
            title: "PIN Mismatch",
            description: "PINs do not match. Please try again.",
            variant: "destructive",
          });
          return;
        }

        if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
          toast({
            title: "Invalid PIN",
            description: "PIN must be exactly 4 digits.",
            variant: "destructive",
          });
          return;
        }

        const hashedPin = await hashPin(pin);
        const { error } = await supabase
          .from('profiles')
          .update({
            payment_pin_hash: hashedPin,
            payment_pin_created_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (error) throw error;

        toast({
          title: "PIN Created",
          description: "Your payment PIN has been created successfully.",
        });
      } else {
        // Verify mode
        const hashedPin = await hashPin(pin);
        const { data, error } = await supabase
          .from('profiles')
          .select('payment_pin_hash')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data.payment_pin_hash !== hashedPin) {
          toast({
            title: "Incorrect PIN",
            description: "The PIN you entered is incorrect.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "PIN Verified",
          description: "Access granted to payment section.",
        });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('PIN operation failed:', error);
      toast({
        title: "Error",
        description: "Failed to process PIN. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPin('');
    setConfirmPin('');
    setShowPin(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            {mode === 'create' ? 'Create Payment PIN' : 'Enter Payment PIN'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {mode === 'create' 
              ? 'Create a 4-digit PIN to secure your payment section'
              : 'Enter your 4-digit PIN to access payments'
            }
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pin">
              {mode === 'create' ? 'Create PIN' : 'Enter PIN'}
            </Label>
            <div className="relative">
              <Input
                id="pin"
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                className="text-center text-lg tracking-widest"
                maxLength={4}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setShowPin(!showPin)}
              >
                {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {mode === 'create' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPin">Confirm PIN</Label>
              <Input
                id="confirmPin"
                type={showPin ? "text" : "password"}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                className="text-center text-lg tracking-widest"
                maxLength={4}
                required
              />
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                resetForm();
                onClose();
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || pin.length !== 4 || (mode === 'create' && confirmPin.length !== 4)}
            >
              {loading ? 'Processing...' : mode === 'create' ? 'Create PIN' : 'Verify PIN'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PinAuthModal;