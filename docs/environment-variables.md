# Environment Variables Template

Copy these variables to your `.env.local` file and fill in the values.

## Whop Configuration

```env
NEXT_PUBLIC_WHOP_APP_ID=app_your_app_id_here
WHOP_API_KEY=your_whop_api_key_here
NEXT_PUBLIC_WHOP_AGENT_USER_ID=user_your_agent_user_id_here
NEXT_PUBLIC_WHOP_COMPANY_ID=biz_your_company_id_here
WHOP_WEBHOOK_SECRET=ws_your_webhook_secret_here
```

## Supabase Configuration

Get these from your Supabase project settings (see `supabase-setup.md`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_KEY=your_supabase_service_key_here
```

## App Configuration

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Getting Whop Credentials

1. Go to [Whop Developer Dashboard](https://whop.com/dashboard/developer/)
2. Create or select your app
3. Copy the App ID from the app settings
4. Generate an API key in the API section
5. Get your Agent User ID and Company ID from the appropriate sections

## Getting Supabase Credentials

See `docs/supabase-setup.md` for detailed instructions on setting up Supabase and getting your credentials.

## Security Notes

- Never commit `.env.local` to version control
- Keep your `SUPABASE_SERVICE_KEY` secret
- Use different credentials for development and production
- Rotate keys regularly for production environments

