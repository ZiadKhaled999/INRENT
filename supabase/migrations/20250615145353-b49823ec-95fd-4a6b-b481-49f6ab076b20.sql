
-- Add phone verification fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN phone_number TEXT,
ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN phone_verification_code TEXT,
ADD COLUMN phone_verification_expires_at TIMESTAMP WITH TIME ZONE;

-- Create phone verification attempts table for rate limiting
CREATE TABLE public.phone_verification_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  attempts_count INTEGER DEFAULT 1,
  last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for phone verification attempts
CREATE INDEX idx_phone_verification_attempts_phone ON public.phone_verification_attempts(phone_number);
CREATE INDEX idx_phone_verification_attempts_blocked ON public.phone_verification_attempts(blocked_until);

-- Function to generate verification code
CREATE OR REPLACE FUNCTION generate_phone_verification_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$;

-- Function to check if phone number can receive verification
CREATE OR REPLACE FUNCTION can_send_phone_verification(phone TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  attempt_record RECORD;
  max_attempts INTEGER := 5;
  block_duration INTERVAL := '1 hour';
BEGIN
  SELECT * INTO attempt_record 
  FROM public.phone_verification_attempts 
  WHERE phone_number = phone 
  ORDER BY last_attempt_at DESC 
  LIMIT 1;
  
  -- If no previous attempts, allow
  IF attempt_record IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- If currently blocked, check if block period has expired
  IF attempt_record.blocked_until IS NOT NULL AND attempt_record.blocked_until > NOW() THEN
    RETURN FALSE;
  END IF;
  
  -- If too many attempts in short time, block
  IF attempt_record.attempts_count >= max_attempts AND 
     attempt_record.last_attempt_at > NOW() - block_duration THEN
    -- Update block time
    UPDATE public.phone_verification_attempts 
    SET blocked_until = NOW() + block_duration
    WHERE id = attempt_record.id;
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Function to record phone verification attempt
CREATE OR REPLACE FUNCTION record_phone_verification_attempt(phone TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  existing_record RECORD;
BEGIN
  SELECT * INTO existing_record 
  FROM public.phone_verification_attempts 
  WHERE phone_number = phone 
  ORDER BY last_attempt_at DESC 
  LIMIT 1;
  
  IF existing_record IS NULL OR existing_record.last_attempt_at < NOW() - INTERVAL '1 hour' THEN
    -- Create new record or reset if old
    INSERT INTO public.phone_verification_attempts (phone_number, attempts_count, last_attempt_at)
    VALUES (phone, 1, NOW())
    ON CONFLICT (phone_number) DO UPDATE SET
      attempts_count = 1,
      last_attempt_at = NOW(),
      blocked_until = NULL;
  ELSE
    -- Increment existing record
    UPDATE public.phone_verification_attempts 
    SET attempts_count = attempts_count + 1,
        last_attempt_at = NOW()
    WHERE id = existing_record.id;
  END IF;
END;
$$;

-- Add RLS policies
ALTER TABLE public.phone_verification_attempts ENABLE ROW LEVEL SECURITY;

-- Users can only see their own verification attempts (admin function)
CREATE POLICY "Users can view own phone verification attempts" ON public.phone_verification_attempts
  FOR SELECT USING (FALSE); -- Only accessible via functions

-- Update profiles table RLS to include phone fields
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
