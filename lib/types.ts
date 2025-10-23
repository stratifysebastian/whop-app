// Referly Type Definitions

// ============================================================================
// User & Authentication Types
// ============================================================================

export interface User {
	id: string;
	whop_user_id: string;
	whop_company_id: string;
	username: string | null;
	email: string | null;
	avatar_url: string | null;
	created_at: string;
	updated_at: string;
}

export interface WhopUser {
	id: string;
	username: string;
	email: string;
	avatar_url?: string;
	company_id: string;
}

// ============================================================================
// Referral Types
// ============================================================================

export interface ReferralCode {
	id: string;
	user_id: string;
	code: string;
	clicks: number;
	conversions: number;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface ReferralCodeWithUrl extends ReferralCode {
	url: string;
}

export type ReferralStatus = 'pending' | 'converted' | 'cancelled';

export interface Referral {
	id: string;
	referrer_id: string | null;
	referred_id: string;
	referral_code_id: string | null;
	campaign_id: string | null;
	status: ReferralStatus;
	converted_at: string | null;
	revenue_attributed: number;
	ip_address: string | null;
	user_agent: string | null;
	device_fingerprint: string | null;
	is_verified: boolean;
	fraud_score: number;
	created_at: string;
	updated_at: string;
}

export interface ReferralWithDetails extends Referral {
	referrer?: User;
	referred?: User;
	referral_code?: ReferralCode;
	campaign?: Campaign;
}

export interface ReferralClick {
	id: string;
	referral_code_id: string;
	ip_address: string | null;
	user_agent: string | null;
	device_fingerprint: string | null;
	referrer_url: string | null;
	converted: boolean;
	created_at: string;
}

export interface ReferralStats {
	total_referrals: number;
	total_conversions: number;
	conversion_rate: number;
	revenue_attributed: number;
	rewards_earned: number;
	rank: number | null;
}

// ============================================================================
// Campaign Types
// ============================================================================

export type CampaignStatus = 'draft' | 'active' | 'ended' | 'archived';

export interface CampaignRules {
	points_per_referral?: number;
	bonus_points?: Record<string, number>; // threshold -> bonus points
	tiers?: Array<{
		name: string;
		threshold: number;
		multiplier: number;
	}>;
}

export interface CampaignPrize {
	rank: number;
	prize: string;
	description: string;
	value?: number;
}

export interface Campaign {
	id: string;
	whop_company_id: string;
	name: string;
	description: string | null;
	start_date: string;
	end_date: string;
	status: CampaignStatus;
	rules: CampaignRules | null;
	prizes: CampaignPrize[] | null;
	total_referrals: number;
	created_at: string;
	updated_at: string;
}

export interface CampaignWithStats extends Campaign {
	participant_count: number;
	top_referrer?: LeaderboardEntry;
}

// ============================================================================
// Reward Types
// ============================================================================

export type RewardType = 'product_unlock' | 'discount' | 'custom';

export interface RewardData {
	product_id?: string;
	discount_code?: string;
	discount_percentage?: number;
	custom_data?: Record<string, any>;
}

export interface Reward {
	id: string;
	whop_company_id: string;
	name: string;
	description: string | null;
	threshold: number;
	reward_type: RewardType;
	reward_data: RewardData | null;
	auto_apply: boolean;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export type RewardRedemptionStatus = 'pending' | 'granted' | 'claimed' | 'failed';

export interface RewardRedemption {
	id: string;
	user_id: string;
	reward_id: string;
	status: RewardRedemptionStatus;
	granted_at: string | null;
	claimed_at: string | null;
	error_message: string | null;
	created_at: string;
	updated_at: string;
}

export interface RewardRedemptionWithDetails extends RewardRedemption {
	reward: Reward;
	user: User;
}

export interface RewardEligibility {
	eligible_rewards: Array<{
		reward_id: string;
		name: string;
		can_claim: boolean;
	}>;
	next_milestone: {
		reward_id: string;
		name: string;
		referrals_needed: number;
	} | null;
}

// ============================================================================
// Leaderboard Types
// ============================================================================

export interface LeaderboardEntry {
	rank: number;
	user_id: string;
	username: string;
	avatar_url: string | null;
	referrals: number;
	conversions: number;
	points: number;
}

export interface Leaderboard {
	leaderboard: LeaderboardEntry[];
	updated_at: string;
}

// ============================================================================
// Fraud Detection Types
// ============================================================================

export type FraudCheckType =
	| 'ip_duplicate'
	| 'device_duplicate'
	| 'email_duplicate'
	| 'velocity_limit';

export interface FraudCheck {
	id: string;
	referral_id: string;
	check_type: FraudCheckType;
	flagged: boolean;
	details: Record<string, any> | null;
	created_at: string;
}

export interface FraudCheckResult {
	flagged: boolean;
	fraud_score: number;
	checks: Array<{
		type: FraudCheckType;
		flagged: boolean;
		details: string;
	}>;
}

// ============================================================================
// Dashboard Types
// ============================================================================

export interface DashboardOverview {
	total_referrals: number;
	total_conversions: number;
	conversion_rate: number;
	revenue_attributed: number;
	active_users: number;
	top_referrers: Array<{
		user_id: string;
		username: string;
		referrals: number;
		conversions: number;
	}>;
}

export interface ReferrerListItem {
	user_id: string;
	username: string;
	email: string | null;
	referrals: number;
	conversions: number;
	conversion_rate: number;
	revenue_attributed: number;
	rewards_earned: number;
	joined_at: string;
}

export interface PaginationInfo {
	page: number;
	limit: number;
	total: number;
	total_pages: number;
}

export interface PaginatedResponse<T> {
	data: T[];
	pagination: PaginationInfo;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: {
		code: string;
		message: string;
		details?: Record<string, any>;
	};
}

export interface ApiError {
	code: string;
	message: string;
	details?: Record<string, any>;
}

// ============================================================================
// Form Types
// ============================================================================

export interface CreateRewardForm {
	companyId: string;
	name: string;
	description: string;
	threshold: number;
	reward_type: RewardType;
	reward_data: RewardData;
	auto_apply: boolean;
}

export interface CreateCampaignForm {
	companyId: string;
	name: string;
	description: string;
	start_date: string;
	end_date: string;
	rules: CampaignRules;
	prizes: CampaignPrize[];
}

export interface TrackReferralForm {
	code: string;
	referred_user_id: string;
	campaign_id?: string;
}

// ============================================================================
// Filter & Sort Types
// ============================================================================

export type TimeFrame = '7d' | '30d' | 'all';
export type SortField = 'referrals' | 'conversions' | 'revenue' | 'created_at';
export type SortOrder = 'asc' | 'desc';

export interface DashboardFilters {
	companyId: string;
	timeframe?: TimeFrame;
	page?: number;
	limit?: number;
	sort?: SortField;
	order?: SortOrder;
	search?: string;
}

// ============================================================================
// Export Formats
// ============================================================================

export type ExportFormat = 'csv' | 'json';

export interface ExportOptions {
	companyId: string;
	format: ExportFormat;
	timeframe?: TimeFrame;
	include_fields?: string[];
}

// ============================================================================
// Webhook Types
// ============================================================================

export interface WhopWebhookPayload {
	type: string;
	data: Record<string, any>;
	timestamp: string;
}

// ============================================================================
// Chart Data Types
// ============================================================================

export interface ChartDataPoint {
	date: string;
	value: number;
	label?: string;
}

export interface ReferralChartData {
	referrals: ChartDataPoint[];
	conversions: ChartDataPoint[];
	revenue: ChartDataPoint[];
}

