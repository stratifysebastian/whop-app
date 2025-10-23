# Referly API Specification

This document defines all API endpoints for the Referly application.

## Base URL
- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

## Authentication
All API routes require Whop authentication via the `x-whop-user-token` header or Whop session cookies.

---

## Referral Endpoints

### Generate Referral Code
**POST** `/api/referrals/generate`

Generates a unique referral code for the authenticated user.

**Request Headers:**
```json
{
  "x-whop-user-token": "user_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "code": "ABC123",
    "url": "https://your-domain.com?ref=ABC123",
    "clicks": 0,
    "conversions": 0
  }
}
```

### Get User Referral Code
**GET** `/api/referrals/code`

Retrieves the authenticated user's referral code.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "code": "ABC123",
    "url": "https://your-domain.com?ref=ABC123",
    "clicks": 45,
    "conversions": 12,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Validate Referral Code
**GET** `/api/referrals/validate?code=ABC123`

Validates if a referral code exists and is active.

**Query Parameters:**
- `code` (string, required): The referral code to validate

**Response:**
```json
{
  "success": true,
  "valid": true,
  "referrer": {
    "username": "john_doe",
    "avatar_url": "https://..."
  }
}
```

### Track Referral Click
**POST** `/api/referrals/track-click`

Tracks a click on a referral link.

**Request Body:**
```json
{
  "code": "ABC123",
  "metadata": {
    "referrer_url": "https://twitter.com/...",
    "device_fingerprint": "abc123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Click tracked"
}
```

### Track Referral Conversion
**POST** `/api/referrals/track-conversion`

Converts a referral click into a successful referral.

**Request Body:**
```json
{
  "code": "ABC123",
  "referred_user_id": "whop_user_id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "referral_id": "uuid",
    "referrer_id": "uuid",
    "referred_id": "uuid"
  }
}
```

### Get User Referral Stats
**GET** `/api/referrals/stats`

Get referral statistics for the authenticated user.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_referrals": 25,
    "total_conversions": 12,
    "conversion_rate": 48,
    "revenue_attributed": 1200.50,
    "rewards_earned": 3,
    "rank": 5
  }
}
```

---

## Dashboard Endpoints

### Get Dashboard Overview
**GET** `/api/dashboard/overview?companyId=biz_xxx`

Get overview statistics for a company.

**Query Parameters:**
- `companyId` (string, required): Whop company ID
- `timeframe` (string, optional): "7d", "30d", "all" (default: "30d")

**Response:**
```json
{
  "success": true,
  "data": {
    "total_referrals": 1250,
    "total_conversions": 456,
    "conversion_rate": 36.5,
    "revenue_attributed": 12500.00,
    "active_users": 89,
    "top_referrers": [
      {
        "user_id": "uuid",
        "username": "john_doe",
        "referrals": 45,
        "conversions": 20
      }
    ]
  }
}
```

### Get Referrers List
**GET** `/api/dashboard/referrers?companyId=biz_xxx`

Get paginated list of referrers with detailed stats.

**Query Parameters:**
- `companyId` (string, required)
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 25)
- `sort` (string, optional): "referrals", "conversions", "revenue" (default: "referrals")
- `order` (string, optional): "asc", "desc" (default: "desc")
- `search` (string, optional): Search by username

**Response:**
```json
{
  "success": true,
  "data": {
    "referrers": [
      {
        "user_id": "uuid",
        "username": "john_doe",
        "email": "john@example.com",
        "referrals": 45,
        "conversions": 20,
        "conversion_rate": 44.4,
        "revenue_attributed": 800.00,
        "rewards_earned": 2,
        "joined_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 25,
      "total": 156,
      "total_pages": 7
    }
  }
}
```

### Export Referral Data
**GET** `/api/dashboard/export?companyId=biz_xxx&format=csv`

Export referral data as CSV.

**Query Parameters:**
- `companyId` (string, required)
- `format` (string, optional): "csv", "json" (default: "csv")
- `timeframe` (string, optional): "7d", "30d", "all"

**Response:**
Returns CSV file download or JSON array.

---

## Rewards Endpoints

### Get Reward Milestones
**GET** `/api/rewards?companyId=biz_xxx`

Get all reward milestones for a company.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "5 Referrals Bonus",
      "description": "Get 1 month free",
      "threshold": 5,
      "reward_type": "product_unlock",
      "reward_data": {
        "product_id": "prod_xxx"
      },
      "auto_apply": true,
      "is_active": true
    }
  ]
}
```

### Create Reward Milestone
**POST** `/api/rewards/create`

Create a new reward milestone.

**Request Body:**
```json
{
  "companyId": "biz_xxx",
  "name": "10 Referrals Bonus",
  "description": "Get premium access",
  "threshold": 10,
  "reward_type": "product_unlock",
  "reward_data": {
    "product_id": "prod_xxx"
  },
  "auto_apply": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "10 Referrals Bonus",
    ...
  }
}
```

### Update Reward Milestone
**PUT** `/api/rewards/[id]`

Update an existing reward milestone.

### Delete Reward Milestone
**DELETE** `/api/rewards/[id]`

Delete a reward milestone.

### Check Reward Eligibility
**POST** `/api/rewards/check`

Check if a user is eligible for rewards.

**Request Body:**
```json
{
  "user_id": "whop_user_id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "eligible_rewards": [
      {
        "reward_id": "uuid",
        "name": "5 Referrals Bonus",
        "can_claim": true
      }
    ],
    "next_milestone": {
      "reward_id": "uuid",
      "name": "10 Referrals Bonus",
      "referrals_needed": 3
    }
  }
}
```

### Grant Reward
**POST** `/api/rewards/grant`

Grant a reward to a user (auto or manual).

**Request Body:**
```json
{
  "user_id": "whop_user_id",
  "reward_id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "redemption_id": "uuid",
    "status": "granted"
  }
}
```

### Get User Rewards
**GET** `/api/rewards/user?userId=whop_user_id`

Get all rewards for a specific user.

---

## Leaderboard Endpoints

### Get Global Leaderboard
**GET** `/api/leaderboard/global?companyId=biz_xxx`

Get global leaderboard rankings.

**Query Parameters:**
- `companyId` (string, required)
- `timeframe` (string, optional): "7d", "30d", "all" (default: "all")
- `limit` (number, optional): Number of entries (default: 25)

**Response:**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "user_id": "uuid",
        "username": "john_doe",
        "avatar_url": "https://...",
        "referrals": 125,
        "conversions": 56,
        "points": 125
      }
    ],
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### Get Campaign Leaderboard
**GET** `/api/leaderboard/campaign/[campaignId]`

Get leaderboard for a specific campaign.

---

## Campaign Endpoints

### Get Campaigns
**GET** `/api/campaigns?companyId=biz_xxx`

Get all campaigns for a company.

**Query Parameters:**
- `companyId` (string, required)
- `status` (string, optional): "active", "upcoming", "ended", "all" (default: "all")

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Summer Campaign",
      "description": "Refer and win prizes!",
      "start_date": "2024-06-01T00:00:00Z",
      "end_date": "2024-08-31T23:59:59Z",
      "status": "active",
      "total_referrals": 450,
      "rules": {...},
      "prizes": {...}
    }
  ]
}
```

### Create Campaign
**POST** `/api/campaigns/create`

Create a new campaign.

**Request Body:**
```json
{
  "companyId": "biz_xxx",
  "name": "Winter Challenge",
  "description": "Refer the most to win!",
  "start_date": "2024-12-01T00:00:00Z",
  "end_date": "2024-12-31T23:59:59Z",
  "rules": {
    "points_per_referral": 1,
    "bonus_points": {
      "5": 5,
      "10": 15
    }
  },
  "prizes": [
    {
      "rank": 1,
      "prize": "$500 cash",
      "description": "Top referrer wins"
    }
  ]
}
```

### Update Campaign
**PUT** `/api/campaigns/[id]`

Update a campaign.

### Delete Campaign
**DELETE** `/api/campaigns/[id]`

Archive a campaign.

### Track Campaign Referral
**POST** `/api/campaigns/[id]/track`

Track a referral for a specific campaign.

---

## Fraud Detection Endpoints

### Check Referral for Fraud
**POST** `/api/fraud/check`

Check a referral for potential fraud.

**Request Body:**
```json
{
  "referral_id": "uuid",
  "checks": ["ip_duplicate", "device_duplicate", "velocity"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "flagged": true,
    "fraud_score": 75,
    "checks": [
      {
        "type": "ip_duplicate",
        "flagged": true,
        "details": "IP address used in 3 other referrals"
      }
    ]
  }
}
```

### Get Flagged Referrals
**GET** `/api/fraud/flagged?companyId=biz_xxx`

Get list of flagged referrals for review.

### Approve Referral
**POST** `/api/fraud/approve`

Manually approve a flagged referral.

### Reject Referral
**POST** `/api/fraud/reject`

Reject a flagged referral.

---

## Webhook Endpoints

### Whop Webhook Handler
**POST** `/api/webhooks/whop`

Handles webhooks from Whop for purchase events, membership changes, etc.

**Request Body:** (Whop webhook payload)

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes
- `UNAUTHORIZED`: Missing or invalid authentication
- `FORBIDDEN`: User doesn't have permission
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid request data
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

