
-- Create subscribers table to track subscription information
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create chat_usage table to track daily chat limits
CREATE TABLE public.chat_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  chat_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies for subscribers table
CREATE POLICY "Users can view their own subscription" ON public.subscribers
FOR SELECT USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Users can update their own subscription" ON public.subscribers
FOR UPDATE USING (true);

CREATE POLICY "Users can insert their own subscription" ON public.subscribers
FOR INSERT WITH CHECK (true);

-- RLS policies for chat_usage table
CREATE POLICY "Users can view their own chat usage" ON public.chat_usage
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own chat usage" ON public.chat_usage
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own chat usage" ON public.chat_usage
FOR INSERT WITH CHECK (user_id = auth.uid());

-- Function to increment chat count for a user
CREATE OR REPLACE FUNCTION increment_chat_count(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  current_count INTEGER;
BEGIN
  INSERT INTO public.chat_usage (user_id, date, chat_count)
  VALUES (user_uuid, CURRENT_DATE, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET 
    chat_count = chat_usage.chat_count + 1,
    updated_at = now();
  
  SELECT chat_count INTO current_count
  FROM public.chat_usage
  WHERE user_id = user_uuid AND date = CURRENT_DATE;
  
  RETURN current_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
