-- Add missing DELETE policies for better data management

-- Allow users to delete their own bill splits if they're the bill owner or household creator
CREATE POLICY "Users can delete bill splits" ON public.bill_splits
  FOR DELETE USING (
    user_id = auth.uid() OR 
    EXISTS(
      SELECT 1 FROM public.bills b 
      WHERE b.id = bill_id 
      AND public.is_household_creator(b.household_id)
    )
  );

-- Allow household creators to delete bills they created
CREATE POLICY "Household creators can delete bills" ON public.bills
  FOR DELETE USING (public.is_household_creator(household_id));

-- Allow household creators to delete invitations
CREATE POLICY "Users can delete invitations for their households" ON public.household_invitations
  FOR DELETE USING (
    public.is_household_creator(household_id) OR 
    created_by = auth.uid()
  );

-- Allow users to delete their own notifications
CREATE POLICY "Users can delete their own notifications" ON public.notifications
  FOR DELETE USING (user_id = auth.uid());

-- Allow household creators to delete households (soft delete recommended)
CREATE POLICY "Household creators can delete households" ON public.households
  FOR DELETE USING (created_by = auth.uid());

-- Add policy to allow users to delete their own profiles (if needed)
CREATE POLICY "Users can delete their own profile" ON public.profiles
  FOR DELETE USING (id = auth.uid());

-- Create audit logging function for sensitive operations
CREATE OR REPLACE FUNCTION public.log_sensitive_operation()
RETURNS TRIGGER AS $$
BEGIN
  -- Log household deletions
  IF TG_TABLE_NAME = 'households' AND TG_OP = 'DELETE' THEN
    INSERT INTO public.notifications (user_id, type, title, message)
    SELECT 
      hm.user_id,
      'household_deleted',
      'Household Deleted',
      'The household "' || OLD.name || '" has been permanently deleted.'
    FROM public.household_members hm 
    WHERE hm.household_id = OLD.id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for audit logging
CREATE TRIGGER log_household_deletion
  BEFORE DELETE ON public.households
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_operation();

-- Ensure email verification is tracked
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verification_token TEXT,
ADD COLUMN IF NOT EXISTS email_verification_expires_at TIMESTAMP WITH TIME ZONE;

-- Create function to handle email verification
CREATE OR REPLACE FUNCTION public.verify_user_email(verification_token TEXT)
RETURNS JSON AS $$
DECLARE
  profile_record RECORD;
BEGIN
  -- Find user with valid token
  SELECT * INTO profile_record
  FROM public.profiles
  WHERE email_verification_token = verification_token
    AND email_verification_expires_at > NOW()
    AND email_verified = FALSE;
    
  IF profile_record IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid or expired verification token');
  END IF;
  
  -- Mark email as verified
  UPDATE public.profiles
  SET 
    email_verified = TRUE,
    email_verification_token = NULL,
    email_verification_expires_at = NULL,
    updated_at = NOW()
  WHERE id = profile_record.id;
  
  RETURN json_build_object('success', true, 'message', 'Email verified successfully');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create comprehensive data validation triggers
CREATE OR REPLACE FUNCTION public.validate_household_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate rent amount is positive
  IF NEW.rent_amount <= 0 THEN
    RAISE EXCEPTION 'Rent amount must be greater than zero';
  END IF;
  
  -- Validate due day is between 1 and 28
  IF NEW.due_day < 1 OR NEW.due_day > 28 THEN
    RAISE EXCEPTION 'Due day must be between 1 and 28';
  END IF;
  
  -- Validate household name is not empty
  IF TRIM(NEW.name) = '' THEN
    RAISE EXCEPTION 'Household name cannot be empty';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_household_trigger
  BEFORE INSERT OR UPDATE ON public.households
  FOR EACH ROW EXECUTE FUNCTION public.validate_household_data();

-- Add indexes for better performance on frequently queried columns
CREATE INDEX IF NOT EXISTS idx_household_members_user_household ON public.household_members(user_id, household_id);
CREATE INDEX IF NOT EXISTS idx_bills_household_month ON public.bills(household_id, month_year);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone_number);

-- Create function to clean up expired invitations and verification codes
CREATE OR REPLACE FUNCTION public.cleanup_expired_data()
RETURNS VOID AS $$
BEGIN
  -- Delete expired invitations
  DELETE FROM public.household_invitations
  WHERE expires_at < NOW() - INTERVAL '7 days';
  
  -- Clear expired phone verification codes
  UPDATE public.profiles
  SET 
    phone_verification_code = NULL,
    phone_verification_expires_at = NULL
  WHERE phone_verification_expires_at < NOW();
  
  -- Clear expired email verification tokens
  UPDATE public.profiles
  SET 
    email_verification_token = NULL,
    email_verification_expires_at = NULL
  WHERE email_verification_expires_at < NOW();
  
  -- Delete old phone verification attempts (older than 30 days)
  DELETE FROM public.phone_verification_attempts
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;