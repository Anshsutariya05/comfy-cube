import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { createPayPalOrder, capturePayPalOrder, storeOrder, PaymentDetails } from '@/services/paypal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard } from 'lucide-react';
import { Product } from '@/services/api';

// Extend window object for PayPal SDK
declare global {
  interface Window {
    paypal?: {
      Buttons: (config: Record<string, unknown>) => {
        render: (container: string) => Promise<void>;
      };
    };
  }
}

interface PayPalButtonProps {
  paymentDetails: PaymentDetails;
  onSuccess: (orderId: string) => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  cartItems?: Product[];
  total?: number;
  shipping?: number;
  tax?: number;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({
  paymentDetails,
  onSuccess,
  onError,
  disabled = false,
  cartItems = [],
  total = 0,
  shipping = 0,
  tax = 0,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Load PayPal SDK
    const clientId = (import.meta as any).env.VITE_PAYPAL_CLIENT_ID;
    
    if (!clientId) {
      console.error('PayPal Client ID not configured');
      return;
    }

    // Add PayPal script to document
    if (!window.paypal) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=INR`;
      script.async = true;
      script.onload = () => {
        console.log('PayPal SDK loaded');
      };
      script.onerror = () => {
        console.error('Failed to load PayPal SDK');
      };
      document.head.appendChild(script);
    }
  }, []);

  const handlePayPalPayment = async () => {
    if (!user) {
      toast.error('Please log in to proceed with payment');
      return;
    }

    setIsLoading(true);

    try {
      // Create PayPal order
      const paypalOrderId = await createPayPalOrder(paymentDetails);

      // Find PayPal approval URL
      if (!window.paypal) {
        throw new Error('PayPal SDK not loaded');
      }

      // Redirect to PayPal for approval
      // In production, you'd use the PayPal Buttons component
      // For now, construct the approval URL manually
      const approvalUrl = `https://www.sandbox.paypal.com/checkoutnow?token=${paypalOrderId}`;
      window.open(approvalUrl, '_blank');

      // Simulate waiting for user to complete payment
      // In production, use server-side verification
      setTimeout(async () => {
        try {
          const captureResponse = await capturePayPalOrder(paypalOrderId);

          if (captureResponse.status === 'COMPLETED') {
            // Store order in database
            if (cartItems.length > 0 && user.id) {
              await storeOrder(
                supabase,
                user.id,
                paypalOrderId,
                cartItems,
                total,
                shipping,
                tax
              );
            }

            toast.success('Payment successful! Your order has been placed.');
            onSuccess(paypalOrderId);
          } else {
            throw new Error('Payment was not completed');
          }
        } catch (error) {
          console.error('Error completing payment:', error);
          toast.error('Failed to complete payment. Please try again.');
          if (onError && error instanceof Error) {
            onError(error);
          }
        } finally {
          setIsLoading(false);
        }
      }, 3000);
    } catch (error) {
      console.error('PayPal payment error:', error);
      toast.error(error instanceof Error ? error.message : 'Payment failed. Please try again.');
      if (onError && error instanceof Error) {
        onError(error);
      }
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayPalPayment}
      disabled={disabled || isLoading}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      size="lg"
    >
      <CreditCard className="mr-2 h-4 w-4" />
      {isLoading ? 'Processing...' : 'Pay with PayPal'}
    </Button>
  );
};

export default PayPalButton;
