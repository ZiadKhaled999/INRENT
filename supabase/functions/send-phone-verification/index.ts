
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TwilioConfig {
  accountSid: string
  authToken: string
  fromNumber: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phoneNumber } = await req.json()

    if (!phoneNumber) {
      throw new Error('Phone number is required')
    }

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if we can send verification to this number
    const { data: canSend, error: canSendError } = await supabaseAdmin
      .rpc('can_send_phone_verification', { phone: phoneNumber })

    if (canSendError) {
      console.error('Error checking verification eligibility:', canSendError)
      throw new Error('Failed to check verification eligibility')
    }

    if (!canSend) {
      throw new Error('Too many verification attempts. Please try again later.')
    }

    // Generate verification code
    const { data: verificationCode, error: codeError } = await supabaseAdmin
      .rpc('generate_phone_verification_code')

    if (codeError) {
      console.error('Error generating verification code:', codeError)
      throw new Error('Failed to generate verification code')
    }

    // Get Twilio credentials
    const twilioConfig: TwilioConfig = {
      accountSid: Deno.env.get('TWILIO_ACCOUNT_SID') ?? '',
      authToken: Deno.env.get('TWILIO_AUTH_TOKEN') ?? '',
      fromNumber: Deno.env.get('TWILIO_FROM_NUMBER') ?? ''
    }

    if (!twilioConfig.accountSid || !twilioConfig.authToken || !twilioConfig.fromNumber) {
      throw new Error('Twilio configuration is incomplete')
    }

    // Send SMS via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioConfig.accountSid}/Messages.json`
    
    const formData = new URLSearchParams()
    formData.append('To', phoneNumber)
    formData.append('From', twilioConfig.fromNumber)
    formData.append('Body', `Your Rentable verification code is: ${verificationCode}. Valid for 10 minutes.`)

    const twilioResponse = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${twilioConfig.accountSid}:${twilioConfig.authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    })

    if (!twilioResponse.ok) {
      const error = await twilioResponse.json()
      console.error('Twilio error:', error)
      throw new Error('Failed to send SMS')
    }

    // Store verification code in database
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10) // 10 minutes expiry

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        phone_number: phoneNumber,
        phone_verification_code: verificationCode,
        phone_verification_expires_at: expiresAt.toISOString(),
        phone_verified: false
      })
      .eq('id', req.headers.get('user-id'))

    if (updateError) {
      console.error('Error storing verification code:', updateError)
      throw new Error('Failed to store verification code')
    }

    // Record attempt
    await supabaseAdmin.rpc('record_phone_verification_attempt', { phone: phoneNumber })

    return new Response(
      JSON.stringify({ success: true, message: 'Verification code sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Send phone verification error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
