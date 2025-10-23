# Referly - Referral & Affiliate Management for Whop

Referly is a powerful referral and affiliate tracking system built for Whop creators. Incentivize member-driven growth, automate rewards, and run campaigns—all integrated directly with your Whop community.

## Features

- 🔗 **Unique Referral Links** - Auto-generated referral codes for each member
- 📊 **Tracking Dashboard** - Real-time analytics for creators
- 🎁 **Automated Rewards** - Milestone-based perks and product unlocks
- 🏆 **Leaderboards** - Gamified rankings to boost engagement
- 🎯 **Campaigns** - Run timed referral challenges
- 🛡️ **Anti-Fraud** - Built-in fraud detection and prevention

## Quick Start

To run this project: 

1. Install dependencies with: `pnpm i`

2. Create a Whop App on your [whop developer dashboard](https://whop.com/dashboard/developer/), then go to the "Hosting" section and:
	- Ensure the "Base URL" is set to the domain you intend to deploy the site on.
	- Ensure the "App path" is set to `/experiences/[experienceId]`
	- Ensure the "Dashboard path" is set to `/dashboard/[companyId]` 
	- Ensure the "Discover path" is set to `/discover` 

3. Copy the environment variables into a `.env.local` file. See `docs/environment-variables.md` for the template.

4. **(Optional)** Set up Supabase for data persistence. See `docs/supabase-setup.md` for instructions. The app works with mock data if Supabase is not configured.

5. Go to a Whop created in the same org as the app you created. Navigate to the tools section and add your app.

6. Run `pnpm dev` to start the dev server. Then in the top right of the window find a translucent settings icon. Select "localhost". The default port 3000 should work.

## Project Structure

```
referly/
├── app/
│   ├── api/referrals/        # Referral API endpoints
│   ├── dashboard/            # Creator dashboard pages
│   ├── experiences/          # User-facing pages
│   │   └── [experienceId]/
│   │       └── referrals/    # User referral page
│   └── discover/             # Public discover page
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── referrals/           # Referral-specific components
│   ├── leaderboard/         # Leaderboard components
│   └── campaigns/           # Campaign components
├── lib/
│   ├── types.ts            # TypeScript type definitions
│   ├── mock-data.ts        # Mock data generators
│   ├── whop-sdk.ts         # Whop API helpers
│   └── supabase.ts         # Supabase client
└── docs/
    ├── database-schema.md   # Database structure
    ├── api-spec.md          # API documentation
    ├── supabase-setup.md    # Supabase setup guide
    ├── progress.md          # Development progress
    └── colorscheme.md       # Brand colors

```

## Development Status

Current features available for testing:

✅ **User Referral Page** - Share referral links, track stats  
✅ **Referral API** - Generate codes, track clicks and conversions  
✅ **Referral Middleware** - Automatic link tracking via cookies  

In progress:

🚧 **Creator Dashboard** - Analytics and referrer management  
📋 **Rewards System** - Automated milestone rewards  
📋 **Leaderboards** - Real-time rankings  
📋 **Campaigns** - Timed referral challenges  

See `docs/progress.md` for detailed status.

## Deploying

1. Upload your fork / copy of this template to github. 

2. Go to [Vercel](https://vercel.com/new) and link the repository. Deploy your application with the environment variables from your `.env.local`

3. If necessary update you "Base Domain" and webhook callback urls on the app settings page on the whop dashboard.

## Configuration

### Environment Variables

Required variables (see `docs/environment-variables.md`):
- `NEXT_PUBLIC_WHOP_APP_ID` - Your Whop app ID
- `WHOP_API_KEY` - Whop API key
- `NEXT_PUBLIC_WHOP_AGENT_USER_ID` - Agent user ID
- `NEXT_PUBLIC_WHOP_COMPANY_ID` - Your company ID

Optional (for database persistence):
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_KEY` - Supabase service role key

### Whop Dashboard Settings

In your Whop developer dashboard, configure:
- **App path**: `/experiences/[experienceId]`
- **Dashboard path**: `/dashboard/[companyId]`
- **Discover path**: `/discover`
- **Base URL**: Your deployment domain

## Documentation

- [Database Schema](docs/database-schema.md) - Complete database structure
- [API Specification](docs/api-spec.md) - All API endpoints
- [Supabase Setup](docs/supabase-setup.md) - Database setup guide
- [Development Progress](docs/progress.md) - Current build status
- [Color Scheme](colorscheme.md) - Brand colors and usage

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with custom color scheme
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Auth**: Whop OAuth
- **Deployment**: Vercel-ready

## Troubleshooting

**App not loading properly?**  
Make sure to set the "App path" in your Whop developer dashboard. The placeholder text doesn't mean it's set - you must explicitly enter `/experiences/[experienceId]`

**No data showing?**  
The app uses mock data when Supabase is not configured. To enable real data persistence, follow the Supabase setup guide.

**TypeScript errors?**  
Run `pnpm install` to ensure all dependencies are installed.

## Contributing

This is a custom Whop app for referral management. For Whop platform docs, visit https://dev.whop.com/introduction

## License

Proprietary - Built for Whop creators
