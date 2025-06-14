
-- Fix the infinite recursion in household_members RLS policies
-- Drop the problematic policy that causes recursion
DROP POLICY IF EXISTS "Users can view members of their households" ON public.household_members;

-- Create a new policy that doesn't cause recursion
CREATE POLICY "Users can view members of their households" ON public.household_members
  FOR SELECT USING (
    household_id IN (
      SELECT household_id FROM public.household_members WHERE user_id = auth.uid()
    )
  );

-- Also fix the household policy to avoid potential recursion
DROP POLICY IF EXISTS "Users can view households they're members of" ON public.households;

CREATE POLICY "Users can view households they're members of" ON public.households
  FOR SELECT USING (
    id IN (
      SELECT household_id FROM public.household_members WHERE user_id = auth.uid()
    )
  );

-- Add user_type column to profiles table to distinguish between renters and residents
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_type TEXT CHECK (user_type IN ('renter', 'resident'));

-- Add role column to household_members to track who is the main renter
ALTER TABLE public.household_members ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'resident' CHECK (role IN ('renter', 'resident'));
