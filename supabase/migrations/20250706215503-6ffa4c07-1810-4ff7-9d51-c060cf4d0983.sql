-- Add PIN authentication to profiles
ALTER TABLE public.profiles 
ADD COLUMN payment_pin_hash TEXT,
ADD COLUMN payment_pin_created_at TIMESTAMP WITH TIME ZONE;

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id UUID NOT NULL,
  resident_id UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  method TEXT DEFAULT 'paymob',
  tx_id TEXT,
  paymob_order_id TEXT,
  payment_token TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  due_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT payments_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.households(id) ON DELETE CASCADE,
  CONSTRAINT payments_resident_id_fkey FOREIGN KEY (resident_id) REFERENCES public.household_members(id) ON DELETE CASCADE,
  CONSTRAINT payments_status_check CHECK (status IN ('pending', 'paid', 'overdue', 'failed'))
);

-- Add indexes for performance
CREATE INDEX idx_payments_household_id ON public.payments(household_id);
CREATE INDEX idx_payments_resident_id ON public.payments(resident_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_due_date ON public.payments(due_date);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payments
CREATE POLICY "Users can view payments for their households" 
ON public.payments 
FOR SELECT 
USING (
  household_id IN (
    SELECT household_id FROM public.household_members WHERE user_id = auth.uid()
    UNION
    SELECT id FROM public.households WHERE created_by = auth.uid()
  )
);

CREATE POLICY "Household creators can create payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (
  household_id IN (SELECT id FROM public.households WHERE created_by = auth.uid())
);

CREATE POLICY "Household creators and residents can update payments" 
ON public.payments 
FOR UPDATE 
USING (
  household_id IN (
    SELECT household_id FROM public.household_members WHERE user_id = auth.uid()
    UNION
    SELECT id FROM public.households WHERE created_by = auth.uid()
  )
);

-- Function to check overdue payments
CREATE OR REPLACE FUNCTION public.update_overdue_payments()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.payments 
  SET status = 'overdue', updated_at = now()
  WHERE status = 'pending' 
  AND due_date < CURRENT_DATE;
END;
$$;

-- Function to create payments for household members
CREATE OR REPLACE FUNCTION public.create_household_payments(
  target_household_id UUID,
  target_due_date DATE,
  target_amount DECIMAL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  member_record RECORD;
  member_count INTEGER;
  individual_amount DECIMAL;
BEGIN
  -- Check if user is household creator
  IF NOT EXISTS(SELECT 1 FROM public.households WHERE id = target_household_id AND created_by = auth.uid()) THEN
    RETURN json_build_object('success', false, 'error', 'Not authorized');
  END IF;
  
  -- Count household members
  SELECT COUNT(*) INTO member_count 
  FROM public.household_members 
  WHERE household_id = target_household_id;
  
  IF member_count = 0 THEN
    RETURN json_build_object('success', false, 'error', 'No members found');
  END IF;
  
  -- Calculate individual amount
  individual_amount := target_amount / member_count;
  
  -- Create payments for each member
  FOR member_record IN 
    SELECT id, user_id, display_name 
    FROM public.household_members 
    WHERE household_id = target_household_id
  LOOP
    INSERT INTO public.payments (
      household_id,
      resident_id,
      amount,
      due_date,
      status
    ) VALUES (
      target_household_id,
      member_record.id,
      individual_amount,
      target_due_date,
      'pending'
    );
  END LOOP;
  
  RETURN json_build_object('success', true, 'message', 'Payments created successfully');
END;
$$;