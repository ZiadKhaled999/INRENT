import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const payload = await req.json()
    console.log('PayMob webhook received:', JSON.stringify(payload, null, 2))

    // PayMob webhook verification
    const hmacSecret = Deno.env.get('PAYMOB_HMAC_SECRET')
    if (!hmacSecret) {
      console.error('PAYMOB_HMAC_SECRET not configured')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify webhook signature (optional but recommended)
    const signature = req.headers.get('x-paymob-signature')
    if (signature) {
      const crypto = await import('node:crypto')
      const expectedSignature = crypto
        .createHmac('sha512', hmacSecret)
        .update(JSON.stringify(payload))
        .digest('hex')
      
      if (signature !== expectedSignature) {
        console.error('Invalid webhook signature')
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Extract payment information from PayMob webhook
    const {
      type,
      obj: paymentData
    } = payload

    if (type === 'TRANSACTION') {
      const {
        id: paymobTransactionId,
        order: { id: paymobOrderId, merchant_order_id },
        success,
        txn_response_code,
        amount_cents,
        paid_amount_cents,
        source_data_type,
        source_data_sub_type
      } = paymentData

      console.log('Processing transaction:', {
        paymobTransactionId,
        paymobOrderId,
        merchant_order_id,
        success,
        amount_cents
      })

      // Find the payment by PayMob order ID or merchant order ID
      const { data: payment, error: findError } = await supabase
        .from('payments')
        .select('id, status, amount, resident_id, household_id')
        .or(`paymob_order_id.eq.${paymobOrderId},id.eq.${merchant_order_id}`)
        .single()

      if (findError || !payment) {
        console.error('Payment not found:', findError)
        return new Response(
          JSON.stringify({ error: 'Payment not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Determine payment status based on PayMob response
      let status = 'failed'
      if (success && txn_response_code === 'APPROVED') {
        status = 'paid'
      } else if (txn_response_code === 'PENDING') {
        status = 'pending'
      }

      // Update payment status
      const updateData: any = {
        status,
        tx_id: paymobTransactionId.toString(),
        updated_at: new Date().toISOString()
      }

      if (status === 'paid') {
        updateData.paid_at = new Date().toISOString()
      }

      const { error: updateError } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', payment.id)

      if (updateError) {
        console.error('Failed to update payment:', updateError)
        return new Response(
          JSON.stringify({ error: 'Failed to update payment' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // If payment is successful, send notification to resident
      if (status === 'paid') {
        // Get household member info
        const { data: member } = await supabase
          .from('household_members')
          .select('user_id, display_name, households(name)')
          .eq('id', payment.resident_id)
          .single()

        if (member) {
          // Send success notification
          await supabase
            .from('notifications')
            .insert({
              user_id: member.user_id,
              type: 'payment_success',
              title: 'Payment Successful',
              message: `Your payment of ${(amount_cents / 100).toFixed(2)} EGP for ${member.households?.name} has been processed successfully.`,
              read: false
            })

          console.log('Payment success notification sent to user:', member.user_id)
        }

        // Get renter info and send notification
        const { data: household } = await supabase
          .from('households')
          .select('created_by, name')
          .eq('id', payment.household_id)
          .single()

        if (household) {
          await supabase
            .from('notifications')
            .insert({
              user_id: household.created_by,
              type: 'payment_received',
              title: 'Payment Received',
              message: `Payment of ${(amount_cents / 100).toFixed(2)} EGP received for ${household.name} from ${member?.display_name || 'a resident'}.`,
              read: false
            })

          console.log('Payment received notification sent to renter:', household.created_by)
        }
      }

      console.log(`Payment ${payment.id} updated to status: ${status}`)

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Payment status updated',
          payment_id: payment.id,
          new_status: status
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // For other webhook types, just acknowledge
    return new Response(
      JSON.stringify({ success: true, message: 'Webhook received' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})