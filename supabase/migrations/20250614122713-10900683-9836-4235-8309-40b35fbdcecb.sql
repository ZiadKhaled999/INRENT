
-- Enable RLS on all tables if not already enabled
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies completely
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

DROP POLICY IF EXISTS "Users can view bills for their households" ON public.bills;
DROP POLICY IF EXISTS "Users can create bills for their households" ON public.bills;
DROP POLICY IF EXISTS "Users can create bills for households they created" ON public.bills;
DROP POLICY IF EXISTS "Users can update bills for their households" ON public.bills;
DROP POLICY IF EXISTS "Users can update bills for households they created" ON public.bills;
DROP POLICY IF EXISTS "Household members can create bills" ON public.bills;

DROP POLICY IF EXISTS "Users can view their bill splits" ON public.bill_splits;
DROP POLICY IF EXISTS "Users can view splits for their households" ON public.bill_splits;
DROP POLICY IF EXISTS "Users can create their bill splits" ON public.bill_splits;
DROP POLICY IF EXISTS "Users can create bill splits" ON public.bill_splits;
DROP POLICY IF EXISTS "Users can update their bill splits" ON public.bill_splits;
DROP POLICY IF EXISTS "Users can update their own bill splits" ON public.bill_splits;
DROP POLICY IF EXISTS "Users can update their own splits" ON public.bill_splits;
DROP POLICY IF EXISTS "Users can insert splits for household bills" ON public.bill_splits;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create comprehensive RLS policies for households
CREATE POLICY "Users can view households they created or are members of" ON public.households
  FOR SELECT USING (
    created_by = auth.uid() OR 
    id IN (SELECT household_id FROM public.household_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create households" ON public.households
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update households they created" ON public.households
  FOR UPDATE USING (created_by = auth.uid());

-- Create RLS policies for household_members
CREATE POLICY "Users can view household members" ON public.household_members
  FOR SELECT USING (
    user_id = auth.uid() OR 
    household_id IN (SELECT household_id FROM public.household_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can add members to households they created" ON public.household_members
  FOR INSERT WITH CHECK (
    household_id IN (SELECT id FROM public.households WHERE created_by = auth.uid()) OR
    user_id = auth.uid()
  );

CREATE POLICY "Users can update household members" ON public.household_members
  FOR UPDATE USING (
    user_id = auth.uid() OR 
    household_id IN (SELECT id FROM public.households WHERE created_by = auth.uid())
  );

-- Create RLS policies for bills
CREATE POLICY "Users can view bills for their households" ON public.bills
  FOR SELECT USING (
    household_id IN (SELECT household_id FROM public.household_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create bills for households they created" ON public.bills
  FOR INSERT WITH CHECK (
    household_id IN (SELECT id FROM public.households WHERE created_by = auth.uid())
  );

CREATE POLICY "Users can update bills for households they created" ON public.bills
  FOR UPDATE USING (
    household_id IN (SELECT id FROM public.households WHERE created_by = auth.uid())
  );

-- Create RLS policies for bill_splits
CREATE POLICY "Users can view their bill splits" ON public.bill_splits
  FOR SELECT USING (
    user_id = auth.uid() OR 
    bill_id IN (
      SELECT id FROM public.bills WHERE household_id IN (
        SELECT household_id FROM public.household_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create bill splits" ON public.bill_splits
  FOR INSERT WITH CHECK (
    bill_id IN (
      SELECT id FROM public.bills WHERE household_id IN (
        SELECT id FROM public.households WHERE created_by = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update their own bill splits" ON public.bill_splits
  FOR UPDATE USING (
    user_id = auth.uid() OR 
    bill_id IN (
      SELECT id FROM public.bills WHERE household_id IN (
        SELECT id FROM public.households WHERE created_by = auth.uid()
      )
    )
  );

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());
