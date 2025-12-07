-- Add price fields to businesses table
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS min_price numeric DEFAULT NULL,
ADD COLUMN IF NOT EXISTS max_price numeric DEFAULT NULL,
ADD COLUMN IF NOT EXISTS price_note text DEFAULT NULL;