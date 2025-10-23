# Referly Database Schema

This document defines the database structure for the Referly referral management system.

## Tables

### users
Caches Whop user data for quick lookups and tracking.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  whop_user_id TEXT UNIQUE NOT NULL,
  whop_company_id TEXT NOT NULL,
  username TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_whop_user_id ON users(whop_user_id);
CREATE INDEX idx_users_whop_company_id ON users(whop_company_id);
```

### referral_codes
Unique referral codes/links for each user.

```sql
CREATE TABLE referral_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_referral_codes_user_id ON referral_codes(user_id);
CREATE INDEX idx_referral_codes_code ON referral_codes(code);
```

### referrals
Tracks referral relationships and conversions.

```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  referred_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referral_code_id UUID REFERENCES referral_codes(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, converted, cancelled
  converted_at TIMESTAMP WITH TIME ZONE,
  revenue_attributed DECIMAL(10, 2) DEFAULT 0,
  ip_address TEXT,
  user_agent TEXT,
  device_fingerprint TEXT,
  is_verified BOOLEAN DEFAULT false,
  fraud_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX idx_referrals_campaign_id ON referrals(campaign_id);
CREATE INDEX idx_referrals_status ON referrals(status);
CREATE INDEX idx_referrals_created_at ON referrals(created_at);
```

### campaigns
Timed referral challenges and promotions.

```sql
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  whop_company_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, active, ended, archived
  rules JSONB, -- Store campaign rules (point values, tiers, etc.)
  prizes JSONB, -- Store prize information
  total_referrals INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_campaigns_whop_company_id ON campaigns(whop_company_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);
```

### rewards
Reward milestone configurations and redemptions.

```sql
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  whop_company_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  threshold INTEGER NOT NULL, -- Number of referrals required
  reward_type TEXT NOT NULL, -- product_unlock, discount, custom
  reward_data JSONB, -- Store reward details (product_id, discount_code, etc.)
  auto_apply BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rewards_whop_company_id ON rewards(whop_company_id);
CREATE INDEX idx_rewards_threshold ON rewards(threshold);
```

### reward_redemptions
Tracks when users earn and claim rewards.

```sql
CREATE TABLE reward_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reward_id UUID REFERENCES rewards(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, granted, claimed, failed
  granted_at TIMESTAMP WITH TIME ZONE,
  claimed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reward_redemptions_user_id ON reward_redemptions(user_id);
CREATE INDEX idx_reward_redemptions_reward_id ON reward_redemptions(reward_id);
CREATE INDEX idx_reward_redemptions_status ON reward_redemptions(status);
```

### fraud_checks
Tracks fraud detection data.

```sql
CREATE TABLE fraud_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referral_id UUID REFERENCES referrals(id) ON DELETE CASCADE,
  check_type TEXT NOT NULL, -- ip_duplicate, device_duplicate, email_duplicate, velocity_limit
  flagged BOOLEAN DEFAULT false,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_fraud_checks_referral_id ON fraud_checks(referral_id);
CREATE INDEX idx_fraud_checks_flagged ON fraud_checks(flagged);
```

### referral_clicks
Tracks anonymous clicks before conversion.

```sql
CREATE TABLE referral_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referral_code_id UUID REFERENCES referral_codes(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  device_fingerprint TEXT,
  referrer_url TEXT,
  converted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_referral_clicks_code_id ON referral_clicks(referral_code_id);
CREATE INDEX idx_referral_clicks_converted ON referral_clicks(converted);
CREATE INDEX idx_referral_clicks_created_at ON referral_clicks(created_at);
```

## Relationships

- `users` → `referral_codes` (one-to-many)
- `users` → `referrals` (one-to-many as referrer)
- `users` → `referrals` (one-to-many as referred)
- `users` → `reward_redemptions` (one-to-many)
- `referral_codes` → `referrals` (one-to-many)
- `referral_codes` → `referral_clicks` (one-to-many)
- `campaigns` → `referrals` (one-to-many)
- `rewards` → `reward_redemptions` (one-to-many)
- `referrals` → `fraud_checks` (one-to-many)

## Functions and Triggers

### Update timestamp function
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';
```

### Apply to all tables with updated_at
```sql
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referral_codes_updated_at BEFORE UPDATE ON referral_codes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON referrals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON rewards 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reward_redemptions_updated_at BEFORE UPDATE ON reward_redemptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Notes

- All IDs use UUID for better security and distribution
- Timestamps are stored in UTC
- JSONB is used for flexible data structures (campaign rules, reward data)
- Indexes are created on foreign keys and commonly queried fields
- Cascading deletes are configured where appropriate
- The schema supports soft deletes through status fields rather than hard deletes

