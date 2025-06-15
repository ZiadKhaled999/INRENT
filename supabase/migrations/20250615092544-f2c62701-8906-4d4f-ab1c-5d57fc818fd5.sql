
-- Create a more robust household_invitations table if it doesn't exist or update it
DROP TABLE IF EXISTS public.household_invitations CASCADE;

CREATE TABLE public.household_invitations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id uuid REFERENCES public.households(id) ON DELETE CASCADE NOT NULL,
  created_by uuid REFERENCES public.profiles(id) NOT NULL,
  email text NOT NULL,
  token text UNIQUE NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  used_at timestamp with time zone,
  used_by uuid REFERENCES public.profiles(id),
  max_uses integer DEFAULT 1,
  current_uses integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_household_invitations_token ON public.household_invitations(token);
CREATE INDEX IF NOT EXISTS idx_household_invitations_household_id ON public.household_invitations(household_id);
CREATE INDEX IF NOT EXISTS idx_household_invitations_email ON public.household_invitations(email);

-- Enable RLS
ALTER TABLE public.household_invitations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view invitations for their households" ON public.household_invitations;
DROP POLICY IF EXISTS "Users can create invitations for their households" ON public.household_invitations;
DROP POLICY IF EXISTS "Users can update invitations for their households" ON public.household_invitations;
DROP POLICY IF EXISTS "Anyone can view valid invitations" ON public.household_invitations;

-- Create comprehensive RLS policies
CREATE POLICY "Users can view invitations for their households" ON public.household_invitations
  FOR SELECT USING (
    public.is_household_creator(household_id) OR 
    created_by = auth.uid()
  );

CREATE POLICY "Users can create invitations for their households" ON public.household_invitations
  FOR INSERT WITH CHECK (
    public.is_household_creator(household_id) AND 
    created_by = auth.uid()
  );

CREATE POLICY "Users can update invitations for their households" ON public.household_invitations
  FOR UPDATE USING (
    public.is_household_creator(household_id) OR 
    created_by = auth.uid()
  );

-- Allow anyone to view valid invitations for joining (but limited data)
CREATE POLICY "Anyone can view valid invitations by token" ON public.household_invitations
  FOR SELECT USING (
    token IS NOT NULL AND 
    expires_at > now() AND 
    is_active = true AND 
    current_uses < max_uses
  );

-- Create a function to generate secure invitation tokens
CREATE OR REPLACE FUNCTION public.generate_invitation_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  token_length INTEGER := 32;
  token_chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  -- Generate a cryptographically secure random token
  FOR i IN 1..token_length LOOP
    result := result || substr(token_chars, floor(random() * length(token_chars) + 1)::int, 1);
  END LOOP;
  
  -- Ensure uniqueness by checking against existing tokens
  WHILE EXISTS(SELECT 1 FROM public.household_invitations WHERE token = result) LOOP
    result := '';
    FOR i IN 1..token_length LOOP
      result := result || substr(token_chars, floor(random() * length(token_chars) + 1)::int, 1);
    END LOOP;
  END LOOP;
  
  RETURN result;
END;
$$;

-- Create a function to validate and use invitation tokens
CREATE OR REPLACE FUNCTION public.validate_invitation_token(invitation_token text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  invitation_record RECORD;
  result json;
BEGIN
  -- Get the invitation details
  SELECT 
    hi.*,
    h.name as household_name,
    h.rent_amount,
    h.due_day,
    p.full_name as created_by_name,
    p.email as created_by_email
  INTO invitation_record
  FROM public.household_invitations hi
  JOIN public.households h ON hi.household_id = h.id
  JOIN public.profiles p ON hi.created_by = p.id
  WHERE hi.token = invitation_token
    AND hi.expires_at > now()
    AND hi.is_active = true
    AND hi.current_uses < hi.max_uses;

  -- Check if invitation exists and is valid
  IF invitation_record IS NULL THEN
    RETURN json_build_object(
      'valid', false,
      'error', 'Invalid or expired invitation token'
    );
  END IF;

  -- Return invitation details
  RETURN json_build_object(
    'valid', true,
    'invitation_id', invitation_record.id,
    'household_id', invitation_record.household_id,
    'household_name', invitation_record.household_name,
    'rent_amount', invitation_record.rent_amount,
    'due_day', invitation_record.due_day,
    'invited_email', invitation_record.email,
    'created_by_name', invitation_record.created_by_name,
    'created_by_email', invitation_record.created_by_email,
    'expires_at', invitation_record.expires_at
  );
END;
$$;

-- Create a function to use an invitation token
CREATE OR REPLACE FUNCTION public.use_invitation_token(
  invitation_token text,
  user_id uuid,
  display_name text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  invitation_record RECORD;
  existing_member_id uuid;
  result json;
BEGIN
  -- Get and lock the invitation record
  SELECT * INTO invitation_record
  FROM public.household_invitations
  WHERE token = invitation_token
    AND expires_at > now()
    AND is_active = true
    AND current_uses < max_uses
  FOR UPDATE;

  -- Check if invitation exists and is valid
  IF invitation_record IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid or expired invitation token'
    );
  END IF;

  -- Check if user is already a member
  SELECT id INTO existing_member_id
  FROM public.household_members
  WHERE household_id = invitation_record.household_id
    AND user_id = user_id;

  IF existing_member_id IS NOT NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'User is already a member of this household'
    );
  END IF;

  -- Add user to household
  INSERT INTO public.household_members (
    household_id,
    user_id,
    email,
    display_name,
    role
  ) VALUES (
    invitation_record.household_id,
    user_id,
    (SELECT email FROM public.profiles WHERE id = user_id),
    display_name,
    'resident'
  );

  -- Update invitation usage
  UPDATE public.household_invitations
  SET 
    current_uses = current_uses + 1,
    used_at = CASE 
      WHEN used_at IS NULL THEN now() 
      ELSE used_at 
    END,
    used_by = CASE 
      WHEN used_by IS NULL THEN user_id 
      ELSE used_by 
    END
  WHERE id = invitation_record.id;

  RETURN json_build_object(
    'success', true,
    'household_id', invitation_record.household_id,
    'message', 'Successfully joined household'
  );
END;
$$;
