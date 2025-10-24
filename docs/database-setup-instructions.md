# Database Setup Instructions

## Quick Fix for Campaign Columns

If you're getting the error "Could not find the 'is_active' column of 'campaigns'", you need to add the missing columns to your campaigns table.

### Option 1: Run the Migration Script (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `docs/add-campaign-columns.sql`
4. Click "Run" to execute the script

### Option 2: Manual Column Addition

If you prefer to add the columns manually, run these SQL commands one by one:

```sql
-- Add point_multiplier column
ALTER TABLE campaigns ADD COLUMN point_multiplier DECIMAL(3,1) DEFAULT 1.0;

-- Add prize_pool column  
ALTER TABLE campaigns ADD COLUMN prize_pool TEXT;

-- Add is_active column
ALTER TABLE campaigns ADD COLUMN is_active BOOLEAN DEFAULT true;
```

### Option 3: Full Database Reset (If you don't have important data)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `docs/supabase-migration.sql`
4. Click "Run" to execute the full migration script

## Verify the Setup

After running the migration, you can verify the columns exist by running:

```sql
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'campaigns' 
ORDER BY column_name;
```

You should see columns: `id`, `whop_company_id`, `name`, `description`, `start_date`, `end_date`, `status`, `point_multiplier`, `prize_pool`, `is_active`, `rules`, `prizes`, `total_referrals`, `created_at`, `updated_at`.

## Environment Variables

Make sure you have these environment variables set in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing

After setting up the database:

1. Start your development server: `pnpm dev`
2. Navigate to `/dashboard/demo-company/campaigns`
3. Try creating a new campaign
4. The campaign should now save successfully to the database
