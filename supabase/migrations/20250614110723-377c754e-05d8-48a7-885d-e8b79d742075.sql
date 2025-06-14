
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create households table
CREATE TABLE public.households (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  rent_amount DECIMAL(10,2) NOT NULL,
  due_day INTEGER NOT NULL CHECK (due_day >= 1 AND due_day <= 28),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create household_members table
CREATE TABLE public.household_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES public.households(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(household_id, user_id)
);

-- Create bills table
CREATE TABLE public.bills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES public.households(id) ON DELETE CASCADE NOT NULL,
  month_year TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'complete')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(household_id, month_year)
);

-- Create bill_splits table
CREATE TABLE public.bill_splits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bill_id UUID REFERENCES public.bills(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  paid_at TIMESTAMPTZ,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bill_id, user_id)
);

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for households
CREATE POLICY "Users can view households they're members of" ON public.households
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.household_members 
      WHERE household_id = households.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create households" ON public.households
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Household creators can update their households" ON public.households
  FOR UPDATE USING (auth.uid() = created_by);

-- RLS Policies for household_members
CREATE POLICY "Users can view members of their households" ON public.household_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.household_members hm2 
      WHERE hm2.household_id = household_members.household_id AND hm2.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert themselves as members" ON public.household_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for bills
CREATE POLICY "Users can view bills for their households" ON public.bills
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.household_members 
      WHERE household_id = bills.household_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Household members can create bills" ON public.bills
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.household_members 
      WHERE household_id = bills.household_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for bill_splits
CREATE POLICY "Users can view splits for their households" ON public.bill_splits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bills b
      JOIN public.household_members hm ON b.household_id = hm.household_id
      WHERE b.id = bill_splits.bill_id AND hm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own splits" ON public.bill_splits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert splits for household bills" ON public.bill_splits
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bills b
      JOIN public.household_members hm ON b.household_id = hm.household_id
      WHERE b.id = bill_splits.bill_id AND hm.user_id = auth.uid()
    )
  );

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
