// Local Referral Code Generator
// Generates and manages referral codes locally when database is not available

interface LocalReferralCode {
	id: string;
	user_id: string;
	experience_id: string;
	code: string;
	url: string;
	clicks: number;
	conversions: number;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

// Generate a unique referral code
export function generateReferralCode(): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let code = '';
	for (let i = 0; i < 6; i++) {
		code += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return code;
}

// Generate a unique code that's not already in localStorage
export function generateUniqueReferralCode(experienceId: string): string {
	const existingCodes = getAllLocalReferralCodes();
	const usedCodes = new Set(existingCodes.map(c => c.code));
	
	let code = generateReferralCode();
	let attempts = 0;
	const maxAttempts = 100;
	
	while (usedCodes.has(code) && attempts < maxAttempts) {
		code = generateReferralCode();
		attempts++;
	}
	
	if (attempts >= maxAttempts) {
		// Fallback to timestamp-based code if we can't generate unique
		code = `REF${Date.now().toString(36).toUpperCase().slice(-6)}`;
	}
	
	return code;
}

// Get all referral codes from localStorage
export function getAllLocalReferralCodes(): LocalReferralCode[] {
	if (typeof window === 'undefined') return [];
	
	try {
		const stored = localStorage.getItem('referly_referral_codes');
		return stored ? JSON.parse(stored) : [];
	} catch (error) {
		console.error('Failed to load referral codes from localStorage:', error);
		return [];
	}
}

// Save referral code to localStorage
export function saveLocalReferralCode(referralCode: LocalReferralCode): void {
	if (typeof window === 'undefined') return;
	
	try {
		const existingCodes = getAllLocalReferralCodes();
		const updatedCodes = existingCodes.filter(c => c.id !== referralCode.id);
		updatedCodes.push(referralCode);
		
		localStorage.setItem('referly_referral_codes', JSON.stringify(updatedCodes));
	} catch (error) {
		console.error('Failed to save referral code to localStorage:', error);
	}
}

// Get referral code for a specific user and experience
export function getLocalReferralCode(userId: string, experienceId: string): LocalReferralCode | null {
	const allCodes = getAllLocalReferralCodes();
	return allCodes.find(c => c.user_id === userId && c.experience_id === experienceId) || null;
}

// Create or get existing referral code for user
export function createOrGetReferralCode(userId: string, experienceId: string): LocalReferralCode {
	// Check if user already has a code for this experience
	const existingCode = getLocalReferralCode(userId, experienceId);
	if (existingCode) {
		return existingCode;
	}
	
	// Generate new code
	const code = generateUniqueReferralCode(experienceId);
	const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
	
	const newReferralCode: LocalReferralCode = {
		id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
		user_id: userId,
		experience_id: experienceId,
		code,
		url: `${baseUrl}?ref=${code}`,
		clicks: 0,
		conversions: 0,
		is_active: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	};
	
	// Save to localStorage
	saveLocalReferralCode(newReferralCode);
	
	return newReferralCode;
}

// Update referral code stats
export function updateLocalReferralStats(code: string, type: 'click' | 'conversion'): void {
	const allCodes = getAllLocalReferralCodes();
	const referralCode = allCodes.find(c => c.code === code);
	
	if (referralCode) {
		if (type === 'click') {
			referralCode.clicks++;
		} else if (type === 'conversion') {
			referralCode.conversions++;
		}
		
		referralCode.updated_at = new Date().toISOString();
		saveLocalReferralCode(referralCode);
	}
}

// Get user's referral stats
export function getLocalReferralStats(userId: string): {
	total_referrals: number;
	total_conversions: number;
	conversion_rate: number;
	revenue_attributed: number;
	rewards_earned: number;
	rank: number | null;
} {
	const allCodes = getAllLocalReferralCodes();
	const userCodes = allCodes.filter(c => c.user_id === userId);
	
	const totalReferrals = userCodes.reduce((sum, c) => sum + c.clicks, 0);
	const totalConversions = userCodes.reduce((sum, c) => sum + c.conversions, 0);
	const conversionRate = totalReferrals > 0 ? (totalConversions / totalReferrals) * 100 : 0;
	
	// Calculate rank (simplified - just based on conversions)
	const allUserStats = getAllLocalReferralCodes()
		.reduce((acc, code) => {
			if (!acc[code.user_id]) {
				acc[code.user_id] = 0;
			}
			acc[code.user_id] += code.conversions;
			return acc;
		}, {} as Record<string, number>);
	
	const sortedUsers = Object.entries(allUserStats)
		.sort(([, a], [, b]) => b - a);
	
	const userRank = sortedUsers.findIndex(([id]) => id === userId) + 1;
	
	return {
		total_referrals: totalReferrals,
		total_conversions: totalConversions,
		conversion_rate: Math.round(conversionRate * 10) / 10,
		revenue_attributed: 0, // Not tracked locally
		rewards_earned: 0, // Not tracked locally
		rank: userRank > 0 ? userRank : null,
	};
}
