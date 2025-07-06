interface PaymobAuthResponse {
  token: string;
}

interface PaymobOrderResponse {
  id: number;
}

interface PaymobPaymentKeyResponse {
  token: string;
}

export interface PaymentInitiationData {
  amount: number;
  orderId: string;
  userEmail: string;
  userPhone?: string;
  firstName: string;
  lastName: string;
}

export class PaymobIntegration {
  private apiKey: string;
  private integrationId: string;
  private iframeId: string;

  constructor(apiKey: string, integrationId: string, iframeId: string) {
    this.apiKey = apiKey;
    this.integrationId = integrationId;
    this.iframeId = iframeId;
  }

  async authenticate(): Promise<string> {
    const response = await fetch('https://accept.paymob.com/api/auth/tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: this.apiKey,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate with Paymob');
    }

    const data: PaymobAuthResponse = await response.json();
    return data.token;
  }

  async createOrder(authToken: string, amount: number, orderId: string): Promise<number> {
    const response = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: Math.round(amount * 100), // Convert to cents
        currency: 'EGP',
        merchant_order_id: orderId,
        items: [
          {
            name: 'Rent Payment',
            amount_cents: Math.round(amount * 100),
            description: 'Monthly rent payment',
            quantity: 1,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create Paymob order');
    }

    const data: PaymobOrderResponse = await response.json();
    return data.id;
  }

  async getPaymentKey(
    authToken: string,
    paymobOrderId: number,
    paymentData: PaymentInitiationData
  ): Promise<string> {
    const response = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: Math.round(paymentData.amount * 100),
        expiration: 3600, // 1 hour
        order_id: paymobOrderId,
        billing_data: {
          apartment: 'NA',
          email: paymentData.userEmail,
          floor: 'NA',
          first_name: paymentData.firstName,
          street: 'NA',
          building: 'NA',
          phone_number: paymentData.userPhone || '+201000000000',
          shipping_method: 'NA',
          postal_code: 'NA',
          city: 'NA',
          country: 'EG',
          last_name: paymentData.lastName,
          state: 'NA',
        },
        currency: 'EGP',
        integration_id: parseInt(this.integrationId),
        lock_order_when_paid: true,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get payment key');
    }

    const data: PaymobPaymentKeyResponse = await response.json();
    return data.token;
  }

  async initiatePayment(paymentData: PaymentInitiationData): Promise<string> {
    try {
      // Step 1: Authenticate
      const authToken = await this.authenticate();

      // Step 2: Create order
      const paymobOrderId = await this.createOrder(authToken, paymentData.amount, paymentData.orderId);

      // Step 3: Get payment key
      const paymentKey = await this.getPaymentKey(authToken, paymobOrderId, paymentData);

      return paymentKey;
    } catch (error) {
      console.error('Payment initiation failed:', error);
      throw error;
    }
  }

  getIframeUrl(paymentToken: string): string {
    return `https://accept.paymob.com/api/acceptance/iframes/${this.iframeId}?payment_token=${paymentToken}`;
  }

  // Verify webhook signature (for backend use)
  static verifyWebhookSignature(data: any, signature: string, hmacSecret: string): boolean {
    const calculatedSignature = require('crypto')
      .createHmac('sha512', hmacSecret)
      .update(JSON.stringify(data))
      .digest('hex');
    
    return calculatedSignature === signature;
  }
}

// Utility functions for frontend integration
export const loadPaymobScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById('paymob-script')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'paymob-script';
    script.src = 'https://accept.paymob.com/api/acceptance/iframes/1';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paymob script'));
    document.head.appendChild(script);
  });
};

export const createPaymentIframe = (paymentToken: string, iframeId: string): HTMLIFrameElement => {
  const iframe = document.createElement('iframe');
  iframe.src = `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentToken}`;
  iframe.width = '100%';
  iframe.height = '600px';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '8px';
  return iframe;
};