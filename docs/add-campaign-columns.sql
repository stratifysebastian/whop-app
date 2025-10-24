-- Add missing columns to campaigns table
-- Run this in Supabase SQL Editor if you already have a campaigns table

-- Add missing columns to campaigns table if they don't exist
DO $$ 
BEGIN
  -- Add point_multiplier column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'campaigns' AND column_name = 'point_multiplier') THEN
    ALTER TABLE campaigns ADD COLUMN point_multiplier DECIMAL(3,1) DEFAULT 1.0;
    RAISE NOTICE 'Added point_multiplier column to campaigns table';
  ELSE
    RAISE NOTICE 'point_multiplier column already exists in campaigns table';
  END IF;
  
  -- Add prize_pool column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'campaigns' AND column_name = 'prize_pool') THEN
    ALTER TABLE campaigns ADD COLUMN prize_pool TEXT;
    RAISE NOTICE 'Added prize_pool column to campaigns table';
  ELSE
    RAISE NOTICE 'prize_pool column already exists in campaigns table';
  END IF;
  
  -- Add is_active column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'campaigns' AND column_name = 'is_active') THEN
    ALTER TABLE campaigns ADD COLUMN is_active BOOLEAN DEFAULT true;
    RAISE NOTICE 'Added is_active column to campaigns table';
  ELSE
    RAISE NOTICE 'is_active column already exists in campaigns table';
  END IF;
END $$;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'campaigns' 
AND column_name IN ('point_multiplier', 'prize_pool', 'is_active')
ORDER BY column_name;
