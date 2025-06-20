
-- Fix the remaining function that still has a mutable search path
CREATE OR REPLACE FUNCTION public.create_rent_period_for_bill()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.rent_periods (
    household_id,
    month_year,
    start_date,
    end_date,
    due_date,
    status
  ) VALUES (
    NEW.household_id,
    NEW.month_year,
    DATE_TRUNC('month', NEW.due_date),
    (DATE_TRUNC('month', NEW.due_date) + INTERVAL '1 month' - INTERVAL '1 day')::DATE,
    NEW.due_date,
    'active'
  )
  ON CONFLICT (household_id, month_year) DO NOTHING;
  
  RETURN NEW;
END;
$$;
