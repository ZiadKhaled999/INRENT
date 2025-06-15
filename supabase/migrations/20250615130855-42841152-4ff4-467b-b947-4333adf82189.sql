
-- Add a field to track household deletion schedule
ALTER TABLE public.households 
ADD COLUMN scheduled_for_deletion BOOLEAN DEFAULT FALSE,
ADD COLUMN deletion_scheduled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN deletion_reason TEXT;

-- Create a table to track rent periods and their status
CREATE TABLE public.rent_periods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  month_year TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'overdue')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(household_id, month_year)
);

-- Enable RLS on rent_periods table
ALTER TABLE public.rent_periods ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for rent_periods
CREATE POLICY "Users can view rent periods for their households" 
  ON public.rent_periods 
  FOR SELECT 
  USING (
    household_id IN (
      SELECT household_id FROM public.household_members WHERE user_id = auth.uid()
      UNION
      SELECT id FROM public.households WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Household creators can manage rent periods" 
  ON public.rent_periods 
  FOR ALL 
  USING (
    household_id IN (
      SELECT id FROM public.households WHERE created_by = auth.uid()
    )
  );

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can create notifications for users" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

-- Create RLS policies for notifications table
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications for users" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- Create function to automatically create rent periods when bills are created
CREATE OR REPLACE FUNCTION public.create_rent_period_for_bill()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create rent periods
CREATE TRIGGER create_rent_period_trigger
  AFTER INSERT ON public.bills
  FOR EACH ROW
  EXECUTE FUNCTION public.create_rent_period_for_bill();

-- Create function to check for overdue payments and send notifications
CREATE OR REPLACE FUNCTION public.check_overdue_payments()
RETURNS void AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to end active rent periods
CREATE OR REPLACE FUNCTION public.end_rent_period(target_household_id UUID, target_month_year TEXT)
RETURNS json AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;
