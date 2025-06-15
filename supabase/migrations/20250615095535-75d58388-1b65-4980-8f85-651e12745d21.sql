
-- Fix ambiguous column reference in "use_invitation_token" function to eliminate "user_id is ambiguous" error
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

  -- Check if user is already a member (disambiguate user_id)
  SELECT id INTO existing_member_id
  FROM public.household_members
  WHERE household_id = invitation_record.household_id
    AND household_members.user_id = user_id;

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
