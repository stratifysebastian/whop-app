# Supabase Setup Guide for Referly

This guide walks you through setting up Supabase for the Referly application.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in the project details:
   - Project name: `referly-production` (or your preferred name)
   - Database password: Generate a strong password and save it securely
   - Region: Choose closest to your users
   - Pricing plan: Start with Free tier

## Step 2: Get Your API Keys

1. Once the project is created, go to **Settings** → **API**
2. Copy the following:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key**: This is your `SUPABASE_SERVICE_KEY` (keep this secret!)

## Step 3: Add Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-key-here
```

## Step 4: Create Database Tables

### Option A: Using SQL Editor (Recommended)

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New Query"
3. Copy the entire SQL schema from `docs/database-schema.md`
4. Run the query

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Push migrations (if you have migration files)
supabase db push
```

## Step 5: Enable Row Level Security (RLS)

For production, you'll want to enable RLS policies. Here are some basic policies:

### Users Table
```sql
-- Allow users to read all users (for leaderboards, etc.)
CREATE POLICY "Allow public read access" ON public.users
  FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid()::text = whop_user_id);
```

### Referral Codes Table
```sql
-- Users can read their own referral codes
CREATE POLICY "Users can read own referral codes" ON public.referral_codes
  FOR SELECT USING (user_id IN (
    SELECT id FROM users WHERE whop_user_id = auth.uid()::text
  ));
```

### Referrals Table
```sql
-- Users can see referrals they made or received
CREATE POLICY "Users can see own referrals" ON public.referrals
  FOR SELECT USING (
    referrer_id IN (SELECT id FROM users WHERE whop_user_id = auth.uid()::text)
    OR referred_id IN (SELECT id FROM users WHERE whop_user_id = auth.uid()::text)
  );
```

### Campaigns, Rewards (Public Read)
```sql
-- Allow anyone to read campaigns and rewards
CREATE POLICY "Public read access" ON public.campaigns
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON public.rewards
  FOR SELECT USING (true);
```

## Step 6: Set Up Real-time (Optional)

If you want real-time leaderboard updates:

1. Go to **Database** → **Replication**
2. Enable replication for the tables you want real-time updates on:
   - `referrals`
   - `referral_codes`
   - `campaigns`

## Step 7: Configure Storage (Optional)

If you want to store user-uploaded avatars or campaign images:

1. Go to **Storage**
2. Create a new bucket called `avatars` or `campaign-images`
3. Set appropriate access policies

## Step 8: Test the Connection

Run this test in your Next.js app:

```typescript
import { supabase } from '@/lib/supabase';

// Test connection
const testConnection = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('count')
    .single();
    
  if (error) {
    console.error('Supabase connection failed:', error);
  } else {
    console.log('Supabase connected successfully!');
  }
};
```

## Security Best Practices

1. **Never commit `.env.local` to Git**
   - It's already in `.gitignore`

2. **Use Row Level Security (RLS)**
   - Enable RLS on all tables
   - Create appropriate policies

3. **Service Key Security**
   - Only use the service key in server-side code
   - Never expose it to the client

4. **API Rate Limiting**
   - Supabase has built-in rate limiting
   - Monitor usage in the dashboard

5. **Backup Your Database**
   - Set up automatic daily backups
   - Go to **Settings** → **Database** → **Backups**

## Monitoring

Monitor your Supabase project:

1. **Database** → **Database Health**: Check query performance
2. **API** → **API Logs**: View API request logs
3. **Auth** → **Users**: Monitor user activity (if using Supabase Auth)
4. **Reports**: View bandwidth and storage usage

## Troubleshooting

### Connection Issues
- Verify your environment variables are correct
- Check that your IP isn't blocked (in **Settings** → **Database**)
- Ensure your Next.js app is restarted after adding env vars

### Query Performance
- Add indexes on frequently queried columns
- Use `.explain()` to analyze slow queries
- Check the Query Performance section in the dashboard

### RLS Issues
- Temporarily disable RLS for testing
- Check policy conditions match your auth setup
- Use `USING (true)` for public read access

## Migration to Production

When deploying to production:

1. Create a separate Supabase project for production
2. Run the same SQL schema
3. Update environment variables on Vercel:
   - Go to your Vercel project → **Settings** → **Environment Variables**
   - Add all `NEXT_PUBLIC_SUPABASE_*` and `SUPABASE_SERVICE_KEY` variables
4. Test thoroughly before directing traffic

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Management](https://supabase.com/docs/guides/database/overview)

