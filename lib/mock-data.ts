// Mock Data Generators for Referly Development

import type {
	User,
	ReferralCode,
	ReferralCodeWithUrl,
	Referral,
	ReferralStats,
	Campaign,
	Reward,
	RewardRedemption,
	LeaderboardEntry,
	DashboardOverview,
	ReferrerListItem,
	FraudCheck,
} from './types';

// Helper function to generate random IDs
const generateId = () => `${Math.random().toString(36).substring(2, 15)}`;

// Helper function to generate dates
const randomDate = (start: Date, end: Date) => {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to generate random number in range
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// ============================================================================
// Mock Users
// ============================================================================

const MOCK_USERNAMES = [
	'crypto_king', 'trading_guru', 'nft_collector', 'defi_master', 'web3_wizard',
	'blockchain_bro', 'satoshi_fan', 'eth_maximalist', 'dao_builder', 'metaverse_pro',
	'yield_farmer', 'hodler_life', 'alpha_hunter', 'whale_tracker', 'pump_chaser',
	'diamond_hands', 'moon_boy', 'bear_killer', 'bull_run', 'degen_trader',
];

const MOCK_AVATARS = [
	'https://i.pravatar.cc/150?img=1',
	'https://i.pravatar.cc/150?img=2',
	'https://i.pravatar.cc/150?img=3',
	'https://i.pravatar.cc/150?img=4',
	'https://i.pravatar.cc/150?img=5',
	'https://i.pravatar.cc/150?img=6',
	'https://i.pravatar.cc/150?img=7',
	'https://i.pravatar.cc/150?img=8',
	'https://i.pravatar.cc/150?img=9',
	'https://i.pravatar.cc/150?img=10',
];

export function generateMockUser(index?: number): User {
	const id = generateId();
	const username = index !== undefined 
		? MOCK_USERNAMES[index % MOCK_USERNAMES.length] 
		: MOCK_USERNAMES[randomInt(0, MOCK_USERNAMES.length - 1)];
	
	return {
		id,
		whop_user_id: `user_${id}`,
		whop_company_id: `biz_${generateId()}`,
		username,
		email: `${username}@example.com`,
		avatar_url: MOCK_AVATARS[randomInt(0, MOCK_AVATARS.length - 1)],
		created_at: randomDate(new Date(2023, 0, 1), new Date()).toISOString(),
		updated_at: new Date().toISOString(),
	};
}

export function generateMockUsers(count: number): User[] {
	return Array.from({ length: count }, (_, i) => generateMockUser(i));
}

// ============================================================================
// Mock Referral Codes
// ============================================================================

const generateReferralCode = () => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let code = '';
	for (let i = 0; i < 6; i++) {
		code += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return code;
};

export function generateMockReferralCode(userId: string): ReferralCodeWithUrl {
	const code = generateReferralCode();
	const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://example.com';
	
	return {
		id: generateId(),
		user_id: userId,
		code,
		url: `${baseUrl}?ref=${code}`,
		clicks: randomInt(0, 500),
		conversions: randomInt(0, 100),
		is_active: true,
		created_at: randomDate(new Date(2024, 0, 1), new Date()).toISOString(),
		updated_at: new Date().toISOString(),
	};
}

// ============================================================================
// Mock Referrals
// ============================================================================

export function generateMockReferral(referrerId: string, referredId: string): Referral {
	const isConverted = Math.random() > 0.4;
	
	return {
		id: generateId(),
		referrer_id: referrerId,
		referred_id: referredId,
		referral_code_id: generateId(),
		campaign_id: Math.random() > 0.7 ? generateId() : null,
		status: isConverted ? 'converted' : 'pending',
		converted_at: isConverted ? randomDate(new Date(2024, 0, 1), new Date()).toISOString() : null,
		revenue_attributed: isConverted ? randomInt(10, 200) : 0,
		ip_address: `192.168.${randomInt(1, 255)}.${randomInt(1, 255)}`,
		user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		device_fingerprint: generateId(),
		is_verified: isConverted,
		fraud_score: randomInt(0, 30),
		created_at: randomDate(new Date(2024, 0, 1), new Date()).toISOString(),
		updated_at: new Date().toISOString(),
	};
}

export function generateMockReferrals(count: number, users: User[]): Referral[] {
	return Array.from({ length: count }, () => {
		const referrer = users[randomInt(0, Math.min(5, users.length - 1))]; // Top users refer more
		const referred = users[randomInt(0, users.length - 1)];
		return generateMockReferral(referrer.id, referred.id);
	});
}

// ============================================================================
// Mock Referral Stats
// ============================================================================

export function generateMockReferralStats(): ReferralStats {
	const totalReferrals = randomInt(5, 150);
	const totalConversions = randomInt(0, Math.floor(totalReferrals * 0.7));
	
	return {
		total_referrals: totalReferrals,
		total_conversions: totalConversions,
		conversion_rate: totalReferrals > 0 ? (totalConversions / totalReferrals) * 100 : 0,
		revenue_attributed: totalConversions * randomInt(10, 100),
		rewards_earned: Math.floor(totalConversions / 5),
		rank: randomInt(1, 100),
	};
}

// ============================================================================
// Mock Campaigns
// ============================================================================

export function generateMockCampaign(companyId: string, status?: Campaign['status']): Campaign {
	const now = new Date();
	const startDate = randomDate(new Date(2024, 0, 1), now);
	const endDate = randomDate(startDate, new Date(2025, 11, 31));
	
	const campaignStatus = status || (['draft', 'active', 'ended'][randomInt(0, 2)] as Campaign['status']);
	
	const names = [
		'Summer Referral Blast',
		'Holiday Growth Challenge',
		'Spring Acquisition Sprint',
		'Q4 Revenue Rush',
		'New Year New Members',
		'Anniversary Celebration',
	];
	
	return {
		id: generateId(),
		whop_company_id: companyId,
		name: names[randomInt(0, names.length - 1)],
		description: 'Refer the most members and win amazing prizes! Track your progress on the leaderboard.',
		start_date: startDate.toISOString(),
		end_date: endDate.toISOString(),
		status: campaignStatus,
		rules: {
			points_per_referral: 1,
			bonus_points: {
				'5': 5,
				'10': 15,
				'25': 50,
			},
		},
		prizes: [
			{ rank: 1, prize: '$500 Cash', description: 'First place winner', value: 500 },
			{ rank: 2, prize: '$250 Cash', description: 'Second place winner', value: 250 },
			{ rank: 3, prize: '$100 Cash', description: 'Third place winner', value: 100 },
		],
		total_referrals: randomInt(50, 1000),
		created_at: randomDate(new Date(2023, 6, 1), now).toISOString(),
		updated_at: now.toISOString(),
	};
}

export function generateMockCampaigns(count: number, companyId: string): Campaign[] {
	return Array.from({ length: count }, () => generateMockCampaign(companyId));
}

// ============================================================================
// Mock Rewards
// ============================================================================

export function generateMockReward(companyId: string): Reward {
	const thresholds = [3, 5, 10, 25, 50, 100];
	const threshold = thresholds[randomInt(0, thresholds.length - 1)];
	
	const rewardTypes: Array<{ name: string; type: Reward['reward_type'] }> = [
		{ name: '1 Month Free', type: 'product_unlock' },
		{ name: '25% Off Discount', type: 'discount' },
		{ name: 'Premium Access', type: 'product_unlock' },
		{ name: 'Exclusive Role', type: 'custom' },
		{ name: '50% Off Coupon', type: 'discount' },
	];
	
	const reward = rewardTypes[randomInt(0, rewardTypes.length - 1)];
	
	return {
		id: generateId(),
		whop_company_id: companyId,
		name: `${threshold} Referrals - ${reward.name}`,
		description: `Unlock ${reward.name} when you reach ${threshold} successful referrals!`,
		threshold,
		reward_type: reward.type,
		reward_data: reward.type === 'discount' 
			? { discount_percentage: randomInt(10, 50) }
			: { product_id: `prod_${generateId()}` },
		auto_apply: Math.random() > 0.3,
		is_active: true,
		created_at: randomDate(new Date(2024, 0, 1), new Date()).toISOString(),
		updated_at: new Date().toISOString(),
	};
}

export function generateMockRewards(count: number, companyId: string): Reward[] {
	return Array.from({ length: count }, () => generateMockReward(companyId));
}

// ============================================================================
// Mock Leaderboard
// ============================================================================

export function generateMockLeaderboard(users: User[], count: number = 25): LeaderboardEntry[] {
	return users
		.slice(0, count)
		.map((user, index) => {
			const referrals = randomInt(1, 200 - index * 5);
			const conversions = randomInt(0, Math.floor(referrals * 0.6));
			
			return {
				rank: index + 1,
				user_id: user.id,
				username: user.username || 'Anonymous',
				avatar_url: user.avatar_url,
				referrals,
				conversions,
				points: referrals + Math.floor(conversions * 0.5),
			};
		})
		.sort((a, b) => b.points - a.points)
		.map((entry, index) => ({ ...entry, rank: index + 1 }));
}

// ============================================================================
// Mock Dashboard Overview
// ============================================================================

export function generateMockDashboardOverview(users: User[]): DashboardOverview {
	const totalReferrals = randomInt(500, 5000);
	const totalConversions = randomInt(Math.floor(totalReferrals * 0.3), Math.floor(totalReferrals * 0.6));
	
	return {
		total_referrals: totalReferrals,
		total_conversions: totalConversions,
		conversion_rate: (totalConversions / totalReferrals) * 100,
		revenue_attributed: totalConversions * randomInt(20, 150),
		active_users: randomInt(50, Math.min(500, users.length)),
		top_referrers: users.slice(0, 5).map(user => ({
			user_id: user.id,
			username: user.username || 'Anonymous',
			referrals: randomInt(50, 300),
			conversions: randomInt(20, 100),
		})),
	};
}

// ============================================================================
// Mock Referrer List
// ============================================================================

export function generateMockReferrerList(users: User[]): ReferrerListItem[] {
	return users.map(user => {
		const referrals = randomInt(1, 150);
		const conversions = randomInt(0, Math.floor(referrals * 0.7));
		
		return {
			user_id: user.id,
			username: user.username || 'Anonymous',
			email: user.email,
			referrals,
			conversions,
			conversion_rate: referrals > 0 ? (conversions / referrals) * 100 : 0,
			revenue_attributed: conversions * randomInt(20, 150),
			rewards_earned: Math.floor(conversions / 5),
			joined_at: user.created_at,
		};
	}).sort((a, b) => b.referrals - a.referrals);
}

// ============================================================================
// Mock Fraud Checks
// ============================================================================

export function generateMockFraudCheck(referralId: string): FraudCheck {
	const checkTypes: FraudCheck['check_type'][] = [
		'ip_duplicate',
		'device_duplicate',
		'email_duplicate',
		'velocity_limit',
	];
	
	const checkType = checkTypes[randomInt(0, checkTypes.length - 1)];
	const flagged = Math.random() > 0.8;
	
	return {
		id: generateId(),
		referral_id: referralId,
		check_type: checkType,
		flagged,
		details: flagged ? {
			message: `Potential fraud detected: ${checkType.replace('_', ' ')}`,
			count: randomInt(2, 10),
		} : null,
		created_at: new Date().toISOString(),
	};
}

// ============================================================================
// Complete Mock Data Set
// ============================================================================

export interface MockDataSet {
	users: User[];
	referralCodes: ReferralCodeWithUrl[];
	referrals: Referral[];
	campaigns: Campaign[];
	rewards: Reward[];
	leaderboard: LeaderboardEntry[];
	dashboardOverview: DashboardOverview;
	referrerList: ReferrerListItem[];
}

export function generateCompleteMockData(companyId: string): MockDataSet {
	const users = generateMockUsers(50);
	const referralCodes = users.map(user => generateMockReferralCode(user.id));
	const referrals = generateMockReferrals(500, users);
	const campaigns = generateMockCampaigns(5, companyId);
	const rewards = generateMockRewards(6, companyId);
	const leaderboard = generateMockLeaderboard(users);
	const dashboardOverview = generateMockDashboardOverview(users);
	const referrerList = generateMockReferrerList(users);
	
	return {
		users,
		referralCodes,
		referrals,
		campaigns,
		rewards,
		leaderboard,
		dashboardOverview,
		referrerList,
	};
}

// ============================================================================
// Current User Mock Data
// ============================================================================

export const MOCK_CURRENT_USER: User = {
	id: 'current_user_id',
	whop_user_id: 'user_CurrentMock',
	whop_company_id: 'biz_MockCompany',
	username: 'demo_user',
	email: 'demo@referly.app',
	avatar_url: 'https://i.pravatar.cc/150?img=12',
	created_at: new Date(2024, 0, 1).toISOString(),
	updated_at: new Date().toISOString(),
};

export const MOCK_CURRENT_USER_REFERRAL_CODE = generateMockReferralCode(MOCK_CURRENT_USER.id);
export const MOCK_CURRENT_USER_STATS = generateMockReferralStats();

