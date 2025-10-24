# Referly API Documentation

## Overview

The Referly API provides programmatic access to referral and campaign management functionality. All API endpoints use RESTful conventions and return JSON responses.

## Base URL

```
https://your-domain.com/api
```

## Authentication

All API requests require authentication via Whop OAuth tokens passed in headers:

```
Authorization: Bearer <whop-access-token>
x-whop-user-id: <user-id>
x-whop-company-id: <company-id>
```

## Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

## Error Codes

- `VALIDATION_ERROR`: Invalid request parameters
- `AUTHENTICATION_ERROR`: Invalid or missing authentication
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `DATABASE_ERROR`: Database operation failed
- `DATABASE_NOT_CONFIGURED`: Supabase not set up
- `INTERNAL_ERROR`: Unexpected server error

## Referral Management

### Generate Referral Code

**POST** `/api/referrals/generate`

Generates a unique referral code for a user.

**Headers:**
- `x-whop-user-id`: User ID
- `x-whop-company-id`: Company ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "string",
    "code": "ABC123",
    "url": "https://domain.com?ref=ABC123",
    "clicks": 0,
    "conversions": 0,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### Validate Referral Code

**GET** `/api/referrals/validate?code=ABC123`

Validates a referral code and returns user information.

**Query Parameters:**
- `code`: Referral code to validate

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "referrer_id": "uuid",
    "referrer_username": "string",
    "campaign_id": "uuid",
    "campaign_name": "string"
  }
}
```

### Track Referral Click

**POST** `/api/referrals/track-click`

Records a referral link click.

**Body:**
```json
{
  "code": "ABC123",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "referrer_url": "https://twitter.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "click_id": "uuid",
    "tracked": true
  }
}
```

### Track Referral Conversion

**POST** `/api/referrals/track-conversion`

Records a successful referral conversion.

**Body:**
```json
{
  "code": "ABC123",
  "referred_user_id": "uuid",
  "revenue": 29.99,
  "campaign_id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "referral_id": "uuid",
    "conversion_tracked": true,
    "rewards_triggered": ["reward-id-1", "reward-id-2"]
  }
}
```

### Get Referral Stats

**GET** `/api/referrals/stats`

Returns referral statistics for a user.

**Headers:**
- `x-whop-user-id`: User ID

**Response:**
```json
{
  "success": true,
  "data": {
    "total_referrals": 15,
    "total_conversions": 8,
    "conversion_rate": 53.33,
    "revenue_attributed": 239.92,
    "rewards_earned": 3,
    "rank": 5
  }
}
```

## Campaign Management

### List Campaigns

**GET** `/api/campaigns?companyId=company-id`

Returns all campaigns for a company.

**Query Parameters:**
- `companyId`: Company ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "whop_company_id": "string",
      "name": "Summer Campaign",
      "description": "Campaign description",
      "start_date": "2024-06-01T00:00:00Z",
      "end_date": "2024-08-31T23:59:59Z",
      "status": "active",
      "point_multiplier": 2.5,
      "prize_pool": "$1000 in prizes",
      "is_active": true,
      "total_referrals": 45,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create Campaign

**POST** `/api/campaigns`

Creates a new campaign.

**Body:**
```json
{
  "companyId": "company-id",
  "name": "Campaign Name",
  "description": "Campaign description",
  "start_date": "2024-06-01T00:00:00Z",
  "end_date": "2024-08-31T23:59:59Z",
  "point_multiplier": 2.5,
  "prize_pool": "Prize description"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "whop_company_id": "company-id",
    "name": "Campaign Name",
    "description": "Campaign description",
    "start_date": "2024-06-01T00:00:00Z",
    "end_date": "2024-08-31T23:59:59Z",
    "status": "draft",
    "point_multiplier": 2.5,
    "prize_pool": "Prize description",
    "is_active": true,
    "total_referrals": 0,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### Get Campaign

**GET** `/api/campaigns/[campaignId]`

Returns a specific campaign.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "whop_company_id": "company-id",
    "name": "Campaign Name",
    "description": "Campaign description",
    "start_date": "2024-06-01T00:00:00Z",
    "end_date": "2024-08-31T23:59:59Z",
    "status": "active",
    "point_multiplier": 2.5,
    "prize_pool": "Prize description",
    "is_active": true,
    "total_referrals": 45,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### Update Campaign

**PUT** `/api/campaigns/[campaignId]`

Updates an existing campaign.

**Body:**
```json
{
  "name": "Updated Campaign Name",
  "description": "Updated description",
  "start_date": "2024-06-01T00:00:00Z",
  "end_date": "2024-08-31T23:59:59Z",
  "point_multiplier": 3.0,
  "prize_pool": "Updated prize description",
  "is_active": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "whop_company_id": "company-id",
    "name": "Updated Campaign Name",
    "description": "Updated description",
    "start_date": "2024-06-01T00:00:00Z",
    "end_date": "2024-08-31T23:59:59Z",
    "status": "active",
    "point_multiplier": 3.0,
    "prize_pool": "Updated prize description",
    "is_active": true,
    "total_referrals": 45,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### Delete Campaign

**DELETE** `/api/campaigns/[campaignId]`

Deletes a campaign.

**Response:**
```json
{
  "success": true,
  "data": null
}
```

## Dashboard Analytics

### Get Overview Stats

**GET** `/api/dashboard/overview?companyId=company-id`

Returns high-level dashboard statistics.

**Query Parameters:**
- `companyId`: Company ID

**Response:**
```json
{
  "success": true,
  "data": {
    "total_referrals": 150,
    "total_conversions": 89,
    "conversion_rate": 59.33,
    "revenue_attributed": 2670.00,
    "active_campaigns": 3,
    "top_referrer": {
      "username": "top_user",
      "referrals": 25,
      "conversions": 18
    }
  }
}
```

### Get Referrers Data

**GET** `/api/dashboard/referrers?companyId=company-id&limit=50&offset=0`

Returns paginated referrer data.

**Query Parameters:**
- `companyId`: Company ID
- `limit`: Number of results (default: 50)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "referrers": [
      {
        "user_id": "uuid",
        "username": "user1",
        "email": "user1@example.com",
        "total_referrals": 25,
        "conversions": 18,
        "conversion_rate": 72.0,
        "revenue_attributed": 540.00,
        "rewards_earned": 2,
        "joined_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total": 150,
      "limit": 50,
      "offset": 0,
      "has_more": true
    }
  }
}
```

### Get Chart Data

**GET** `/api/dashboard/chart-data?companyId=company-id&timeframe=30d`

Returns time-series data for charts.

**Query Parameters:**
- `companyId`: Company ID
- `timeframe`: Time period (7d, 30d, 90d, all)

**Response:**
```json
{
  "success": true,
  "data": {
    "referrals_over_time": [
      {
        "date": "2024-01-01",
        "referrals": 5,
        "conversions": 3
      }
    ],
    "revenue_over_time": [
      {
        "date": "2024-01-01",
        "revenue": 89.97
      }
    ]
  }
}
```

### Export Data

**GET** `/api/dashboard/export?companyId=company-id&format=csv`

Exports referral data in CSV format.

**Query Parameters:**
- `companyId`: Company ID
- `format`: Export format (csv)

**Response:** CSV file download

## Leaderboard

### Get Global Leaderboard

**GET** `/api/leaderboard?companyId=company-id&limit=25`

Returns the global leaderboard.

**Query Parameters:**
- `companyId`: Company ID
- `limit`: Number of entries (default: 25)

**Response:**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "user_id": "uuid",
        "username": "top_referrer",
        "avatar_url": "https://...",
        "referrals": 50,
        "conversions": 35,
        "points": 125
      }
    ],
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### Get Campaign Leaderboard

**GET** `/api/leaderboard/campaign/[campaignId]?limit=25`

Returns a campaign-specific leaderboard.

**Query Parameters:**
- `limit`: Number of entries (default: 25)

**Response:**
```json
{
  "success": true,
  "data": {
    "campaign_id": "uuid",
    "campaign_name": "Summer Campaign",
    "leaderboard": [
      {
        "rank": 1,
        "user_id": "uuid",
        "username": "campaign_winner",
        "avatar_url": "https://...",
        "referrals": 15,
        "conversions": 12,
        "points": 30
      }
    ],
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

## Rewards System

### List Rewards

**GET** `/api/rewards?companyId=company-id`

Returns configured rewards for a company.

**Query Parameters:**
- `companyId`: Company ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "whop_company_id": "company-id",
      "name": "5 Referrals Reward",
      "description": "Unlock premium features",
      "type": "product_access",
      "value": "Premium Access",
      "threshold": 5,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Check User Rewards

**GET** `/api/rewards/check?userId=user-id`

Checks if a user is eligible for any rewards.

**Query Parameters:**
- `userId`: User ID

**Response:**
```json
{
  "success": true,
  "data": {
    "eligible_rewards": [
      {
        "reward_id": "uuid",
        "reward_name": "5 Referrals Reward",
        "threshold": 5,
        "current_referrals": 5,
        "eligible": true
      }
    ],
    "granted_rewards": [
      {
        "reward_id": "uuid",
        "reward_name": "5 Referrals Reward",
        "granted_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### Grant Reward

**POST** `/api/rewards/grant`

Manually grants a reward to a user.

**Body:**
```json
{
  "user_id": "uuid",
  "reward_id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "redemption_id": "uuid",
    "status": "granted",
    "granted_at": "2024-01-01T00:00:00Z"
  }
}
```

## Fraud Detection

### Check Fraud

**POST** `/api/fraud/check`

Checks a referral for fraud indicators.

**Body:**
```json
{
  "referral_id": "uuid",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "device_fingerprint": "abc123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fraud_detected": false,
    "risk_score": 0.1,
    "flags": [],
    "recommendation": "approve"
  }
}
```

### Get Flagged Referrals

**GET** `/api/fraud/flagged?companyId=company-id`

Returns referrals flagged for fraud review.

**Query Parameters:**
- `companyId`: Company ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "referral_id": "uuid",
      "referrer_id": "uuid",
      "flagged_at": "2024-01-01T00:00:00Z",
      "reason": "suspicious_ip",
      "details": {
        "ip_address": "192.168.1.1",
        "previous_referrals": 0,
        "velocity": "high"
      }
    }
  ]
}
```

## Rate Limiting

API requests are rate limited to prevent abuse:

- **General endpoints**: 100 requests per minute
- **Referral tracking**: 50 requests per minute
- **Dashboard exports**: 10 requests per minute

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Webhooks

Referly supports webhooks for real-time updates:

### Webhook Events

- `referral.created`: New referral created
- `referral.converted`: Referral converted to signup
- `reward.granted`: Reward automatically granted
- `campaign.started`: Campaign became active
- `campaign.ended`: Campaign ended

### Webhook Configuration

Configure webhooks in your dashboard settings:

```
Webhook URL: https://your-domain.com/webhooks/referly
Secret: your-webhook-secret
Events: referral.created, referral.converted, reward.granted
```

### Webhook Payload

```json
{
  "event": "referral.converted",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "referral_id": "uuid",
    "referrer_id": "uuid",
    "referred_user_id": "uuid",
    "revenue": 29.99,
    "campaign_id": "uuid"
  }
}
```

## SDKs and Libraries

### JavaScript/TypeScript

```typescript
import { ReferlyClient } from '@referly/sdk';

const client = new ReferlyClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://your-domain.com/api'
});

// Generate referral code
const referral = await client.referrals.generate({
  userId: 'user-id',
  companyId: 'company-id'
});

// Track conversion
await client.referrals.trackConversion({
  code: 'ABC123',
  referredUserId: 'referred-user-id',
  revenue: 29.99
});
```

### Python

```python
from referly import ReferlyClient

client = ReferlyClient(
    api_key='your-api-key',
    base_url='https://your-domain.com/api'
)

# Generate referral code
referral = client.referrals.generate(
    user_id='user-id',
    company_id='company-id'
)

# Track conversion
client.referrals.track_conversion(
    code='ABC123',
    referred_user_id='referred-user-id',
    revenue=29.99
)
```

## Testing

### Sandbox Environment

Use the sandbox environment for testing:

```
Base URL: https://sandbox.referly.com/api
```

### Test Data

Sandbox includes pre-populated test data:
- Test users and companies
- Sample campaigns and rewards
- Mock referral data

### API Testing

Use tools like Postman or curl to test endpoints:

```bash
curl -X POST https://your-domain.com/api/referrals/generate \
  -H "Authorization: Bearer your-token" \
  -H "x-whop-user-id: user-id" \
  -H "x-whop-company-id: company-id" \
  -H "Content-Type: application/json"
```

## Support

For API support and questions:
- **Documentation**: This guide and inline API docs
- **Support**: Contact through your Whop dashboard
- **Community**: Join the Referly developer community
- **Status Page**: Check API status at status.referly.com
