# Referly Admin Manual

## Overview

Referly is a comprehensive referral and affiliate management system designed specifically for Whop creators. This manual will guide you through setting up and managing your referral program.

## Getting Started

### 1. Initial Setup

1. **Access Your Dashboard**
   - Navigate to `/dashboard/[your-company-id]/referrals`
   - This is your main control center for managing referrals

2. **Configure Your Program**
   - Set up your first referral campaign
   - Configure reward milestones
   - Customize your referral links

### 2. Dashboard Overview

Your dashboard provides several key sections:

- **Overview**: High-level statistics and performance metrics
- **Referrals**: Detailed referral tracking and management
- **Campaigns**: Create and manage time-limited referral campaigns
- **Rewards**: Configure automated reward milestones
- **Security**: Monitor for fraudulent referrals

## Campaign Management

### Creating Campaigns

1. **Navigate to Campaigns**
   - Go to `/dashboard/[company-id]/campaigns`
   - Click "Create Campaign"

2. **Campaign Configuration**
   - **Name**: Descriptive campaign title
   - **Description**: Campaign details and goals
   - **Point Multiplier**: How many points per referral (e.g., 2.5x)
   - **Start/End Dates**: Campaign duration
   - **Prize Pool**: Rewards for top performers

3. **Campaign Actions**
   - **Edit**: Modify campaign details
   - **Copy**: Duplicate campaign with new dates
   - **Play/Pause**: Toggle campaign status
   - **View Leaderboard**: See campaign-specific rankings
   - **Settings**: Advanced campaign configuration

### Campaign Status

- **Draft**: Campaign created but not yet active
- **Active**: Currently running and accepting referrals
- **Ended**: Campaign has concluded
- **Archived**: Campaign is no longer visible to users

## Reward System

### Setting Up Rewards

1. **Navigate to Rewards**
   - Go to `/dashboard/[company-id]/rewards`

2. **Create Reward Milestones**
   - **Threshold**: Number of referrals required
   - **Reward Type**: Product access, discount, custom reward
   - **Auto-apply**: Automatically grant rewards when threshold is met

3. **Reward Types**
   - **Product Access**: Unlock specific products for users
   - **Discount Codes**: Generate percentage or fixed discounts
   - **Custom Rewards**: Manual rewards requiring approval

### Automated Rewards

- Rewards are automatically checked when new referrals are made
- Users receive notifications when they earn rewards
- Failed reward grants are logged for manual review

## Referral Tracking

### Understanding Referral Data

**Key Metrics:**
- **Total Referrals**: Number of people referred
- **Conversions**: Successful sign-ups from referrals
- **Conversion Rate**: Percentage of referrals that convert
- **Revenue Attributed**: Total revenue from referrals

### Referrer Management

1. **View Top Referrers**
   - Access the referrers table in your dashboard
   - Sort by referrals, conversions, or revenue
   - Export data for external analysis

2. **Referrer Profiles**
   - View individual referrer performance
   - Track their referral history
   - Monitor reward eligibility

## Leaderboards

### Global Leaderboard
- Shows all-time top referrers across all campaigns
- Updates in real-time
- Accessible at `/embed/leaderboard/[company-id]`

### Campaign-Specific Leaderboards
- Shows rankings for specific campaigns
- Includes campaign-specific metrics
- Accessible via campaign "View Leaderboard" button

### Embedding Leaderboards
- Copy the embed code from your dashboard
- Paste into your website or community
- Customize appearance and refresh rate

## Security & Fraud Prevention

### Fraud Detection

Referly includes several fraud prevention mechanisms:

1. **IP Tracking**: Monitors referral sources
2. **Self-Referral Detection**: Prevents users from referring themselves
3. **Velocity Limits**: Flags suspicious referral patterns
4. **Device Fingerprinting**: Tracks unique devices

### Fraud Management

1. **Review Flagged Referrals**
   - Go to `/dashboard/[company-id]/security`
   - Review flagged referrals
   - Approve or reject suspicious activity

2. **Fraud Settings**
   - Configure detection sensitivity
   - Set velocity limits
   - Customize fraud rules

## User Experience

### Referral Links

Users can access their referral information at:
- `/experiences/[experience-id]/referrals`

**Features:**
- Unique referral codes
- Shareable referral links
- Social media sharing buttons
- Real-time statistics

### User Rewards

Users can view their rewards at:
- `/experiences/[experience-id]/rewards`

**Features:**
- Available milestones
- Progress tracking
- Earned rewards history
- Claim functionality

## Best Practices

### Campaign Design

1. **Clear Goals**: Define specific, measurable objectives
2. **Appealing Rewards**: Offer valuable incentives
3. **Time Limits**: Create urgency with campaign deadlines
4. **Regular Updates**: Keep users informed of progress

### Reward Strategy

1. **Tiered Rewards**: Offer increasing rewards for more referrals
2. **Time-Sensitive**: Create limited-time bonus rewards
3. **Social Proof**: Highlight top performers
4. **Clear Communication**: Explain how rewards work

### Community Engagement

1. **Regular Updates**: Share campaign progress
2. **Leaderboard Promotion**: Highlight top referrers
3. **Success Stories**: Share referral success examples
4. **Feedback Collection**: Gather user input for improvements

## Troubleshooting

### Common Issues

**Referral Links Not Working**
- Check if campaign is active
- Verify referral code format
- Ensure proper URL encoding

**Rewards Not Granting**
- Check reward configuration
- Verify user eligibility
- Review fraud detection logs

**Dashboard Not Loading**
- Clear browser cache
- Check internet connection
- Verify company ID in URL

### Getting Help

1. **Check Documentation**: Review this manual and API docs
2. **Contact Support**: Reach out through your Whop dashboard
3. **Community**: Join the Referly community for tips and support

## Advanced Features

### API Integration

- Use the Referly API for custom integrations
- Webhook support for real-time updates
- Custom dashboard development

### Analytics

- Export referral data for external analysis
- Integration with Google Analytics
- Custom reporting and insights

### Customization

- Branded referral pages
- Custom reward types
- Advanced fraud rules
- White-label options

## Security Considerations

### Data Protection

- All referral data is encrypted
- GDPR compliance for EU users
- Secure API endpoints
- Regular security audits

### Access Control

- Role-based permissions
- API key management
- Audit logs for all actions
- Secure authentication

## Performance Optimization

### Dashboard Performance

- Optimized queries for large datasets
- Caching for frequently accessed data
- Real-time updates without page refresh
- Mobile-responsive design

### Referral Tracking

- Lightweight tracking scripts
- Minimal impact on page load times
- Efficient database operations
- Scalable architecture

---

*This manual is regularly updated. Check back for the latest features and best practices.*
