
-- Create security definer functions to avoid infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION public.get_user_households()
RETURNS TABLE(household_id uuid)
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT hm.household_id 
  FROM public.household_members hm 
  WHERE hm.user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_user_created_households()
RETURNS TABLE(household_id uuid)
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT h.id 
  FROM public.households h 
  WHERE h.created_by = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_household_member(target_household_id uuid)
RETURNS boolean
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS(
    SELECT 1 
    FROM public.household_members hm 
    WHERE hm.household_id = target_household_id 
    AND hm.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_household_creator(target_household_id uuid)
RETURNS boolean
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS(
    SELECT 1 
    FROM public.households h 
    WHERE h.id = target_household_id 
    AND h.created_by = auth.uid()
  );
$$;

-- Drop ALL existing policies completely to start fresh
DROP POLICY IF EXISTS "Users can view households they created or are members of" ON public.households;
DROP POLICY IF EXISTS "Users can view households they're members of" ON public.households;
DROP POLICY IF EXISTS "Users can create households" ON public.households;
DROP POLICY IF EXISTS "Users can update their households" ON public.households;
DROP POLICY IF EXISTS "Users can update households they created" ON public.households;
DROP POLICY IF EXISTS "Household creators can update their households" ON public.households;

DROP POLICY IF EXISTS "Users can view household members" ON public.household_members;
DROP POLICY IF EXISTS "Users can view members of their households" ON public.household_members;
DROP POLICY IF EXISTS "Users can insert members to their households" ON public.household_members;
DROP POLICY IF EXISTS "Users can add members to households they created" ON public.household_members;
DROP POLICY IF EXISTS "Users can update members in their households" ON public.household_members;
DROP POLICY IF EXISTS "Users can update household members" ON public.household_members;
DROP POLICY IF EXISTS "Users can insert themselves as members" ON public.household_members;

-- Create new RLS policies using security definer functions
CREATE POLICY "Users can view households they created or are members of" ON public.households
  FOR SELECT USING (
    created_by = auth.uid() OR 
    public.is_household_member(id)
  );

CREATE POLICY "Users can create households" ON public.households
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update households they created" ON public.households
  FOR UPDATE USING (created_by = auth.uid());

-- Fixed household_members policies to prevent infinite recursion
CREATE POLICY "Users can view household members" ON public.household_members
  FOR SELECT USING (
    user_id = auth.uid() OR 
    public.is_household_member(household_id) OR
    public.is_household_creator(household_id)
  );

CREATE POLICY "Users can add members to households" ON public.household_members
  FOR INSERT WITH CHECK (
    public.is_household_creator(household_id) OR
    user_id = auth.uid()
  );

CREATE POLICY "Users can update household members" ON public.household_members
  FOR UPDATE USING (
    user_id = auth.uid() OR 
    public.is_household_creator(household_id)
  );

CREATE POLICY "Users can delete household members" ON public.household_members
  FOR DELETE USING (
    user_id = auth.uid() OR 
    public.is_household_creator(household_id)
  );

-- Update bills policies
DROP POLICY IF EXISTS "Users can view bills for their households" ON public.bills;
DROP POLICY IF EXISTS "Users can create bills for their households" ON public.bills;
DROP POLICY IF EXISTS "Users can create bills for households they created" ON public.bills;
DROP POLICY IF EXISTS "Users can update bills for their households" ON public.bills;
DROP POLICY IF EXISTS "Users can update bills for households they created" ON public.bills;

CREATE POLICY "Users can view bills for their households" ON public.bills
  FOR SELECT USING (public.is_household_member(household_id));

CREATE POLICY "Users can create bills for households they created" ON public.bills
  FOR INSERT WITH CHECK (public.is_household_creator(household_id));

CREATE POLICY "Users can update bills for households they created" ON public.bills
  FOR UPDATE USING (public.is_household_creator(household_id));

-- Update bill_splits policies
DROP POLICY IF EXISTS "Users can view their bill splits" ON public.bill_splits;
DROP POLICY IF EXISTS "Users can create bill splits" ON public.bill_splits;
DROP POLICY IF EXISTS "Users can update their own bill splits" ON public.bill_splits;

CREATE POLICY "Users can view bill splits" ON public.bill_splits
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS(
      SELECT 1 FROM public.bills b 
      WHERE b.id = bill_id 
      AND public.is_household_member(b.household_id)
    )
  );

CREATE POLICY "Users can create bill splits" ON public.bill_splits
  FOR INSERT WITH CHECK (
    EXISTS(
      SELECT 1 FROM public.bills b 
      WHERE b.id = bill_id 
      AND public.is_household_creator(b.household_id)
    )
  );

CREATE POLICY "Users can update bill splits" ON public.bill_splits
  FOR UPDATE USING (
    user_id = auth.uid() OR
    EXISTS(
      SELECT 1 FROM public.bills b 
      WHERE b.id = bill_id 
      AND public.is_household_creator(b.household_id)
    )
  );

-- Add payment tracking columns to bill_splits if they don't exist
ALTER TABLE public.bill_splits 
ADD COLUMN IF NOT EXISTS payment_proof_url text,
ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS verified_at timestamp with time zone;

-- Create notifications table for email verification and other notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Create household invitations table
CREATE TABLE IF NOT EXISTS public.household_invitations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id uuid REFERENCES public.households(id) ON DELETE CASCADE NOT NULL,
  created_by uuid REFERENCES public.profiles(id) NOT NULL,
  email text NOT NULL,
  token text UNIQUE NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  used_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on invitations
ALTER TABLE public.household_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view invitations for their households" ON public.household_invitations
  FOR SELECT USING (public.is_household_creator(household_id));

CREATE POLICY "Users can create invitations for their households" ON public.household_invitations
  FOR INSERT WITH CHECK (public.is_household_creator(household_id) AND created_by = auth.uid());

CREATE POLICY "Users can update invitations for their households" ON public.household_invitations
  FOR UPDATE USING (public.is_household_creator(household_id));
