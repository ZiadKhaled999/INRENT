
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { code, userId } = await req.json()

    if (!code || !userId) {
      throw new Error('Verification code and user ID are required')
    }

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user profile with verification code
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('phone_verification_code, phone_verification_expires_at, phone_number')
      .eq('id', userId)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      throw new Error('User not found')
    }

    if (!profile.phone_verification_code) {
      throw new Error('No verification code found. Please request a new one.')
    }

    // Check if code has expired
    const expiresAt = new Date(profile.phone_verification_expires_at)
    const now = new Date()

    if (now > expiresAt) {
      throw new Error('Verification code has expired. Please request a new one.')
    }

    // Check if code matches
    if (profile.phone_verification_code !== code) {
      throw new Error('Invalid verification code')
    }

    // Mark phone as verified
    const { error: verifyError } = await supabaseAdmin
      .from('profiles')
      .update({
        phone_verified: true,
        phone_verification_code: null,
        phone_verification_expires_at: null
      })
      .eq('id', userId)

    if (verifyError) {
      console.error('Error marking phone as verified:', verifyError)
      throw new Error('Failed to verify phone number')
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Phone number verified successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Phone verification error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
