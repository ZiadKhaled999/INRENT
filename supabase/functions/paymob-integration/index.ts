import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymobAuthResponse {
  token: string;
}

interface PaymobOrderResponse {
  id: number;
}

interface PaymobPaymentKeyResponse {
  token: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, ...data } = await req.json()

    switch (action) {
      case 'initiate_payment':
        return await initiatePayment(data, supabase)
      case 'verify_payment':
        return await verifyPayment(data, supabase)
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('PayMob integration error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function initiatePayment(data: any, supabase: any) {
  const { paymentId, userId } = data

  // Get payment details
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .select(`
      *,
      household_members!inner(user_id, display_name, email),
      households!inner(name)
    `)
    .eq('id', paymentId)
    .eq('household_members.user_id', userId)
    .single()

  if (paymentError || !payment) {
    return new Response(
      JSON.stringify({ error: 'Payment not found or unauthorized' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    // Step 1: Authenticate with PayMob
    const authResponse = await fetch('https://accept.paymob.com/api/auth/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: Deno.env.get('PAYMOB_API_KEY'),
      }),
    })

    if (!authResponse.ok) {
      throw new Error('PayMob authentication failed')
    }

    const authData: PaymobAuthResponse = await authResponse.json()

    // Step 2: Create order
    const orderResponse = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: authData.token,
        delivery_needed: false,
        amount_cents: Math.round(parseFloat(payment.amount) * 100),
        currency: 'EGP',
        merchant_order_id: payment.id,
        items: [{
          name: `Rent Payment - ${payment.households.name}`,
          amount_cents: Math.round(parseFloat(payment.amount) * 100),
          description: `Monthly rent payment for ${payment.households.name}`,
          quantity: 1,
        }],
      }),
    })

    if (!orderResponse.ok) {
      throw new Error('PayMob order creation failed')
    }

    const orderData: PaymobOrderResponse = await orderResponse.json()

    // Step 3: Get payment key
    const paymentKeyResponse = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: authData.token,
        amount_cents: Math.round(parseFloat(payment.amount) * 100),
        expiration: 3600,
        order_id: orderData.id,
        billing_data: {
          apartment: 'NA',
          email: payment.household_members.email,
          floor: 'NA',
          first_name: payment.household_members.display_name.split(' ')[0] || 'User',
          street: 'NA',
          building: 'NA',
          phone_number: '+201000000000',
          shipping_method: 'NA',
          postal_code: 'NA',
          city: 'NA',
          country: 'EG',
          last_name: payment.household_members.display_name.split(' ').slice(1).join(' ') || 'User',
          state: 'NA',
        },
        currency: 'EGP',
        integration_id: parseInt(Deno.env.get('PAYMOB_INTEGRATION_ID') ?? '0'),
        lock_order_when_paid: true,
      }),
    })

    if (!paymentKeyResponse.ok) {
      throw new Error('PayMob payment key generation failed')
    }

    const paymentKeyData: PaymobPaymentKeyResponse = await paymentKeyResponse.json()

    // Update payment record with PayMob details
    await supabase
      .from('payments')
      .update({
        paymob_order_id: orderData.id.toString(),
        payment_token: paymentKeyData.token,
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentId)

    return new Response(
      JSON.stringify({
        success: true,
        payment_token: paymentKeyData.token,
        iframe_url: `https://accept.paymob.com/api/acceptance/iframes/${Deno.env.get('PAYMOB_IFRAME_ID')}?payment_token=${paymentKeyData.token}`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('PayMob integration error:', error)
    return new Response(
      JSON.stringify({ error: 'Payment initiation failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function verifyPayment(data: any, supabase: any) {
  const { paymentId, transactionId } = data

  try {
    // Update payment status
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'paid',
        tx_id: transactionId,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentId)

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Payment verification error:', error)
    return new Response(
      JSON.stringify({ error: 'Payment verification failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}