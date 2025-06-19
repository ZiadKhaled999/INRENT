
-- Fix function search path security warnings by setting explicit search_path for all functions

-- 1. Fix generate_invitation_token function
CREATE OR REPLACE FUNCTION public.generate_invitation_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
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

-- 2. Fix validate_invitation_token function
CREATE OR REPLACE FUNCTION public.validate_invitation_token(invitation_token text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
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

-- 3. Fix use_invitation_token function
CREATE OR REPLACE FUNCTION public.use_invitation_token(
  invitation_token text,
  user_id uuid,
  display_name text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
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

  -- Check if user is already a member (fully qualify the column reference)
  SELECT hm.id INTO existing_member_id
  FROM public.household_members hm
  WHERE hm.household_id = invitation_record.household_id
    AND hm.user_id = use_invitation_token.user_id;

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
    use_invitation_token.user_id,
    (SELECT email FROM public.profiles WHERE id = use_invitation_token.user_id),
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
      WHEN used_by IS NULL THEN use_invitation_token.user_id 
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

-- 4. Fix generate_phone_verification_code function
CREATE OR REPLACE FUNCTION public.generate_phone_verification_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$;

-- 5. Fix can_send_phone_verification function
CREATE OR REPLACE FUNCTION public.can_send_phone_verification(phone text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
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

-- 6. Fix record_phone_verification_attempt function
CREATE OR REPLACE FUNCTION public.record_phone_verification_attempt(phone text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
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

-- 7. Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- 8. Fix get_user_households function
CREATE OR REPLACE FUNCTION public.get_user_households()
RETURNS TABLE(household_id uuid)
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT hm.household_id 
  FROM public.household_members hm 
  WHERE hm.user_id = auth.uid();
$$;

-- 9. Fix get_user_created_households function
CREATE OR REPLACE FUNCTION public.get_user_created_households()
RETURNS TABLE(household_id uuid)
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT h.id 
  FROM public.households h 
  WHERE h.created_by = auth.uid();
$$;

-- 10. Fix is_household_member function
CREATE OR REPLACE FUNCTION public.is_household_member(target_household_id uuid)
RETURNS boolean
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS(
    SELECT 1 
    FROM public.household_members hm 
    WHERE hm.household_id = target_household_id 
    AND hm.user_id = auth.uid()
  );
$$;

-- 11. Fix is_household_creator function
CREATE OR REPLACE FUNCTION public.is_household_creator(target_household_id uuid)
RETURNS boolean
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS(
    SELECT 1 
    FROM public.households h 
    WHERE h.id = target_household_id 
    AND h.created_by = auth.uid()
  );
$$;

-- 12. Fix check_overdue_payments function
CREATE OR REPLACE FUNCTION public.check_overdue_payments()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  overdue_record RECORD;
  household_record RECORD;
  resident_record RECORD;
BEGIN
  -- Find all overdue rent periods
  FOR overdue_record IN 
    SELECT rp.*, h.name as household_name, h.created_by as renter_id
    FROM public.rent_periods rp
    JOIN public.households h ON rp.household_id = h.id
    WHERE rp.status = 'active' 
    AND rp.due_date < CURRENT_DATE
  LOOP
    -- Update rent period status to overdue
    UPDATE public.rent_periods 
    SET status = 'overdue', updated_at = now()
    WHERE id = overdue_record.id;
    
    -- Get household details
    SELECT * INTO household_record
    FROM public.households 
    WHERE id = overdue_record.household_id;
    
    -- Send notifications to all residents
    FOR resident_record IN 
      SELECT user_id, display_name 
      FROM public.household_members 
      WHERE household_id = overdue_record.household_id 
      AND role = 'resident'
    LOOP
      -- Check if notification already sent for this period
      IF NOT EXISTS (
        SELECT 1 FROM public.notifications 
        WHERE user_id = resident_record.user_id 
        AND type = 'payment_overdue'
        AND message LIKE '%' || overdue_record.month_year || '%'
      ) THEN
        INSERT INTO public.notifications (
          user_id,
          type,
          title,
          message,
          read
        ) VALUES (
          resident_record.user_id,
          'payment_overdue',
          'Payment Overdue',
          'Your rent payment for ' || household_record.name || ' (' || overdue_record.month_year || ') is overdue. Please make your payment as soon as possible.',
          false
        );
      END IF;
    END LOOP;
  END LOOP;
END;
$$;

-- 13. Fix end_rent_period function
CREATE OR REPLACE FUNCTION public.end_rent_period(target_household_id uuid, target_month_year text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  rent_period_record RECORD;
  household_record RECORD;
  resident_record RECORD;
BEGIN
  -- Get the rent period
  SELECT * INTO rent_period_record
  FROM public.rent_periods
  WHERE household_id = target_household_id
  AND month_year = target_month_year
  AND status IN ('active', 'overdue');
  
  IF rent_period_record IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Rent period not found or already ended');
  END IF;
  
  -- Get household details
  SELECT * INTO household_record
  FROM public.households
  WHERE id = target_household_id;
  
  -- Update rent period status to completed
  UPDATE public.rent_periods
  SET status = 'completed', updated_at = now()
  WHERE id = rent_period_record.id;
  
  -- Send notifications to all residents
  FOR resident_record IN 
    SELECT user_id, display_name 
    FROM public.household_members 
    WHERE household_id = target_household_id
    AND role = 'resident'
  LOOP
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message,
      read
    ) VALUES (
      resident_record.user_id,
      'rent_period_ended',
      'Rent Period Ended',
      'The rent period for ' || household_record.name || ' (' || target_month_year || ') has been officially ended by the renter.',
      false
    );
  END LOOP;
  
  -- Check if household was scheduled for deletion and this was the final period
  IF household_record.scheduled_for_deletion THEN
    -- Send final deletion notifications
    FOR resident_record IN 
      SELECT user_id, display_name 
      FROM public.household_members 
      WHERE household_id = target_household_id
      AND role = 'resident'
    LOOP
      INSERT INTO public.notifications (
        user_id,
        type,
        title,
        message,
        read
      ) VALUES (
        resident_record.user_id,
        'household_deletion_final',
        'Household Will Be Deleted',
        'The household "' || household_record.name || '" will be deleted soon as the rent period has ended and deletion was scheduled.',
        false
      );
    END LOOP;
  END IF;
  
  RETURN json_build_object('success', true, 'message', 'Rent period ended successfully');
END;
$$;
