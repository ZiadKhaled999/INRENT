import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PaymobIntegration, createPaymentIframe } from "@/utils/paymobIntegration";
import { CreditCard, User, Calendar, DollarSign, Receipt, ExternalLink } from "lucide-react";

interface Payment {
  id: string;
  amount: number;
  status: string;
  paid_at: string | null;
  due_date: string;
  created_at: string;
  resident_id: string;
  tx_id: string | null;
  paymob_order_id: string | null;
  payment_token: string | null;
}

interface Household {
  id: string;
  name: string;
  rent_amount: number;
  due_day: number;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment;
  household: Household;
  userType: string;
  onPaymentUpdate: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  payment,
  household,
  userType,
  onPaymentUpdate
}) => {
  const [loading, setLoading] = useState(false);
  const [residentInfo, setResidentInfo] = useState<any>(null);
  const [showPaymentIframe, setShowPaymentIframe] = useState(false);
  const [paymentToken, setPaymentToken] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchResidentInfo();
    }
  }, [isOpen, payment.resident_id]);

  const fetchResidentInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('household_members')
        .select('display_name, email, user_id')
        .eq('id', payment.resident_id)
        .single();

      if (error) throw error;
      setResidentInfo(data);
    } catch (error: any) {
      console.error('Error fetching resident info:', error);
    }
  };

  const initiatePayment = async () => {
    if (!residentInfo || userType !== 'resident') return;

    setLoading(true);
    try {
      // This would typically be done via an edge function to keep API keys secure
      // For now, showing the structure - you'd need to implement the edge function
      const response = await supabase.functions.invoke('initiate-payment', {
        body: {
          paymentId: payment.id,
          amount: payment.amount,
          userEmail: residentInfo.email,
          firstName: residentInfo.display_name.split(' ')[0] || 'User',
          lastName: residentInfo.display_name.split(' ').slice(1).join(' ') || 'Name'
        }
      });

      if (response.error) throw response.error;

      const { paymentToken: token } = response.data;
      setPaymentToken(token);
      setShowPaymentIframe(true);

      // Update payment with token
      await supabase
        .from('payments')
        .update({ payment_token: token })
        .eq('id', payment.id);

    } catch (error: any) {
      console.error('Error initiating payment:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async () => {
    if (userType !== 'renter') return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
          tx_id: `manual_${Date.now()}`
        })
        .eq('id', payment.id);

      if (error) throw error;

      toast({
        title: "Payment Updated",
        description: "Payment has been marked as paid.",
      });

      onPaymentUpdate();
      onClose();
    } catch (error: any) {
      console.error('Error updating payment:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Payment Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Amount & Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold">{formatCurrency(payment.amount)}</div>
                <Badge className={getStatusColor(payment.status)}>
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Important Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Due Date:</span>
                  <div>{formatDate(payment.due_date)}</div>
                </div>
                {payment.paid_at && (
                  <div>
                    <span className="font-medium">Paid On:</span>
                    <div>{formatDate(payment.paid_at)}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Resident Information */}
          {residentInfo && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Resident Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Name:</span>
                    <div>{residentInfo.display_name}</div>
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>
                    <div>{residentInfo.email}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Household Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Household Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Household:</span>
                  <div>{household.name}</div>
                </div>
                <div>
                  <span className="font-medium">Monthly Rent:</span>
                  <div>{formatCurrency(household.rent_amount)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Details */}
          {(payment.tx_id || payment.paymob_order_id) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Transaction Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {payment.tx_id && (
                  <div>
                    <span className="font-medium">Transaction ID:</span>
                    <div className="font-mono text-xs bg-gray-100 p-1 rounded">{payment.tx_id}</div>
                  </div>
                )}
                {payment.paymob_order_id && (
                  <div>
                    <span className="font-medium">PayMob Order ID:</span>
                    <div className="font-mono text-xs bg-gray-100 p-1 rounded">{payment.paymob_order_id}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Payment Interface */}
          {showPaymentIframe && paymentToken && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Complete Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <iframe
                    src={`https://accept.paymob.com/api/acceptance/iframes/[IFRAME_ID]?payment_token=${paymentToken}`}
                    width="100%"
                    height="400"
                    style={{ border: 'none' }}
                    title="Payment Gateway"
                  />
                </div>
                <div className="mt-4 text-xs text-gray-600">
                  Secure payment powered by PayMob. Your payment information is encrypted and secure.
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>

            {userType === 'resident' && 
             residentInfo?.user_id === user?.id && 
             payment.status === 'pending' && (
              <Button 
                onClick={initiatePayment} 
                disabled={loading}
                className="flex-1 flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                {loading ? 'Processing...' : 'Pay Now'}
              </Button>
            )}

            {userType === 'renter' && payment.status !== 'paid' && (
              <Button 
                onClick={markAsPaid} 
                disabled={loading}
                variant="secondary"
                className="flex-1"
              >
                {loading ? 'Updating...' : 'Mark as Paid'}
              </Button>
            )}

            {payment.status === 'paid' && payment.tx_id && (
              <Button variant="outline" className="flex-1 flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                View Receipt
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
