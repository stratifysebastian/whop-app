# Referly - Referral & Affiliate Management for Whop

A comprehensive referral and affiliate management system built specifically for Whop creators. Track referrals, reward top performers, and grow your community with automated campaigns and leaderboards.

## 🚀 Features

### Core Functionality
- **🎯 Referral Link Generation**: Unique, trackable referral codes for each user
- **📊 Real-Time Analytics**: Comprehensive dashboard with conversion tracking
- **🏆 Automated Rewards**: Milestone-based reward system with Whop integration
- **🎪 Campaign Management**: Time-limited referral campaigns with custom rewards
- **🏅 Leaderboards**: Global and campaign-specific rankings with embeddable widgets
- **🛡️ Anti-Fraud Protection**: IP tracking, self-referral detection, and velocity limits

### Advanced Features
- **📱 Embeddable Widgets**: Leaderboards that can be embedded anywhere
- **📈 CSV Export**: Download referral data for external analysis
- **⚡ Real-Time Updates**: Live leaderboard updates and campaign progress
- **📱 Mobile Responsive**: Optimized for all device sizes
- **🔐 Whop OAuth**: Seamless integration with Whop authentication

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Whop OAuth
- **Deployment**: Vercel
- **Fonts**: Hegarty (headings), Arimo (body)

### Project Structure
```
whop-app/
├── app/                          # Next.js 15 app directory
│   ├── api/                      # API routes
│   │   ├── referrals/           # Referral management endpoints
│   │   ├── dashboard/           # Dashboard analytics endpoints
│   │   ├── campaigns/           # Campaign management endpoints
│   │   ├── rewards/             # Reward system endpoints
│   │   ├── leaderboard/         # Leaderboard endpoints
│   │   └── fraud/               # Anti-fraud endpoints
│   ├── dashboard/               # Creator dashboard pages
│   ├── experiences/             # User-facing pages
│   ├── embed/                   # Embeddable widgets
│   └── discover/                # Marketing pages
├── components/                  # Reusable UI components
│   ├── ui/                      # shadcn/ui components
│   ├── navigation/              # Navigation components
│   ├── referrals/               # Referral-specific components
│   └── leaderboard/             # Leaderboard components
├── lib/                         # Utility functions and configurations
│   ├── supabase.ts             # Supabase client setup
│   ├── whop-sdk.ts              # Whop SDK extensions
│   ├── types.ts                 # TypeScript type definitions
│   └── fraud-detection.ts       # Anti-fraud utilities
└── docs/                        # Documentation
    ├── admin-manual.md          # Admin user guide
    ├── api-documentation.md     # API reference
    ├── deployment-guide.md      # Production deployment
    └── database-schema.md       # Database documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Whop developer account
- Supabase account (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd whop-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Whop Configuration
   WHOP_APP_ID=your-whop-app-id
   WHOP_APP_SECRET=your-whop-app-secret
   
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   
   # NextAuth Configuration
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the migration script from `docs/supabase-migration.sql`
   - Verify all tables are created

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Complete the Whop OAuth flow
   - Start creating campaigns and referral links

## 📊 Development Status

### ✅ Completed Features
- **Phase 1**: Foundation & Architecture Setup
- **Phase 2**: Referral Links & Code Generation
- **Phase 3**: Tracking Dashboard
- **Phase 4**: Automated Rewards System
- **Phase 5**: Referral Leaderboard
- **Phase 6**: Campaign Builder
- **Phase 7**: Anti-Fraud Mechanisms
- **Phase 8**: Polish & Documentation

### 🎯 Key Implementations
- **Referral System**: Complete with code generation, tracking, and validation
- **Dashboard Analytics**: Real-time stats, charts, and export functionality
- **Campaign Management**: Create, edit, copy, and manage time-limited campaigns
- **Reward Automation**: Milestone-based rewards with Whop integration
- **Leaderboards**: Global and campaign-specific with embeddable widgets
- **Anti-Fraud**: IP tracking, self-referral detection, and velocity limits
- **UI/UX**: Loading states, error boundaries, empty states, and responsive design

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   - Import your repository to Vercel
   - Configure build settings (auto-detected for Next.js)

2. **Set environment variables**
   - Add all environment variables from your `.env.local`
   - Ensure production URLs are used

3. **Deploy**
   - Vercel will automatically deploy on every push to main
   - Your app will be available at the provided Vercel URL

### Environment Variables for Production

```env
# Production URLs
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-supabase-service-role-key

# Whop Production App
WHOP_APP_ID=your-production-whop-app-id
WHOP_APP_SECRET=your-production-whop-app-secret
```

## ⚙️ Configuration

### Whop Dashboard Settings

1. **Create a Whop App**
   - Go to your Whop Dashboard
   - Navigate to Apps → Create App
   - Fill in app details

2. **Configure OAuth**
   - Set redirect URI: `https://your-domain.com/auth/callback`
   - Add allowed origins: `https://your-domain.com`
   - Configure required scopes: `user:read`, `company:read`

3. **Get Credentials**
   - Copy your App ID and App Secret
   - Use these in your environment variables

### Supabase Setup

1. **Create Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Choose a region close to your users

2. **Run Migration**
   - Copy the SQL from `docs/supabase-migration.sql`
   - Paste and run in the Supabase SQL Editor
   - Verify all tables are created

3. **Get API Keys**
   - Go to Settings → API
   - Copy Project URL, anon key, and service role key
   - Use these in your environment variables

## 📚 Documentation

- **[Admin Manual](docs/admin-manual.md)**: Complete guide for managing referrals and campaigns
- **[API Documentation](docs/api-documentation.md)**: Comprehensive API reference
- **[Deployment Guide](docs/deployment-guide.md)**: Production deployment instructions
- **[Database Schema](docs/database-schema.md)**: Database structure and relationships

## 🧪 Testing

### Local Testing
```bash
# Run development server
pnpm dev

# Run build test
pnpm build

# Run linting
pnpm lint
```

### Test Scenarios
- ✅ OAuth authentication flow
- ✅ Referral code generation and tracking
- ✅ Campaign creation and management
- ✅ Reward system automation
- ✅ Leaderboard functionality
- ✅ Anti-fraud detection
- ✅ Mobile responsiveness

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📖 Check the [documentation](docs/)
- 🐛 Open an issue on GitHub
- 💬 Contact the development team

---

**Built with ❤️ for the Whop community**

*Referly - Empowering creators to grow their communities through intelligent referral systems.*