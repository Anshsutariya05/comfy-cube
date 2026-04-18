/**
 * PayPal Payment Service
 * Handles all PayPal-related payment operations using PayPal REST API
 */

import { Product } from './api';
import { SupabaseClient } from '@supabase/supabase-js';

export interface PaymentDetails {
  amount: number;
  currency: string;
  orderId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shipping: number;
  tax: number;
}

export interface CaptureResponse {
  status: string;
  id: string;
  purchase_units?: Array<{
    payments?: {
      captures?: Array<{
        id: string;
        status: string;
      }>;
    };
  }>;
}

/**
 * Get PayPal Access Token
 */
const getPayPalAccessToken = async (): Promise<string> => {
  const clientId = (import.meta as any).env.VITE_PAYPAL_CLIENT_ID;
  const appId = (import.meta as any).env.VITE_PAYPAL_APP_ID;

  if (!clientId || !appId) {
    throw new Error('PayPal credentials not configured. Please check your environment variables.');
  }

  try {
    const auth = btoa(`${clientId}:${appId}`);
    const response = await fetch('https://api.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error('Failed to get PayPal access token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting PayPal access token:', error);
    throw error;
  }
};

/**
 * Create a PayPal order for the given payment details
 */
export const createPayPalOrder = async (paymentDetails: PaymentDetails): Promise<string> => {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch('https://api.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: paymentDetails.currency,
              value: (paymentDetails.amount / 100).toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: paymentDetails.currency,
                  value: (
                    paymentDetails.items.reduce((sum, item) => sum + item.price * item.quantity, 0) / 100
                  ).toFixed(2),
                },
                shipping: {
                  currency_code: paymentDetails.currency,
                  value: (paymentDetails.shipping / 100).toFixed(2),
                },
                tax_total: {
                  currency_code: paymentDetails.currency,
                  value: (paymentDetails.tax / 100).toFixed(2),
                },
              },
            },
            items: paymentDetails.items.map(item => ({
              name: item.name,
              quantity: item.quantity.toString(),
              unit_amount: {
                currency_code: paymentDetails.currency,
                value: (item.price / 100).toFixed(2),
              },
            })),
            shipping: {
              type: 'SHIPPING',
              address: {
                country_code: 'US',
              },
            },
          },
        ],
        application_context: {
          return_url: `${window.location.origin}/cart?payment_status=success`,
          cancel_url: `${window.location.origin}/cart?payment_status=cancelled`,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create PayPal order');
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    throw error;
  }
};

/**
 * Capture a PayPal order after user approval
 */
export const capturePayPalOrder = async (orderId: string): Promise<CaptureResponse> => {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`https://api.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to capture PayPal order');
    }

    const data: CaptureResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    throw error;
  }
};

/**
 * Store order in Supabase after successful payment
 */
export const storeOrder = async (
  supabase: SupabaseClient,
  userId: string,
  paymentId: string,
  items: Product[],
  total: number,
  shippingCost: number,
  tax: number
) => {
  try {
    // Create order in database
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: total + shippingCost + tax,
        status: 'completed',
        payment_method: 'paypal',
        payment_id: paymentId,
      })
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    // Store order items
    const orderItems = items.map((item: Product & { quantity?: number }) => ({
      order_id: orderData.id,
      product_id: item.id,
      quantity: item.quantity || 1,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      throw itemsError;
    }

    return orderData;
  } catch (error) {
    console.error('Error storing order:', error);
    throw error;
  }
};
