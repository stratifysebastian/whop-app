import { WhopServerSdk } from "@whop/api";
import type { WhopUser } from "./types";

export const whopSdk = WhopServerSdk({
	// Add your app id here - this is required.
	// You can get this from the Whop dashboard after creating an app section.
	appId: process.env.NEXT_PUBLIC_WHOP_APP_ID ?? "fallback",

	// Add your app api key here - this is required.
	// You can get this from the Whop dashboard after creating an app section.
	appApiKey: process.env.WHOP_API_KEY ?? "fallback",

	// This will make api requests on behalf of this user.
	// This is optional, however most api requests need to be made on behalf of a user.
	// You can create an agent user for your app, and use their userId here.
	// You can also apply a different userId later with the `withUser` function.
	onBehalfOfUserId: process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID,

	// This is the companyId that will be used for the api requests.
	// When making api requests that query or mutate data about a company, you need to specify the companyId.
	// This is optional, however if not specified certain requests will fail.
	// This can also be applied later with the `withCompany` function.
	companyId: process.env.NEXT_PUBLIC_WHOP_COMPANY_ID,
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get authenticated user information from Whop
 */
export async function getAuthenticatedUser(userId: string): Promise<WhopUser | null> {
	try {
		const sdk = whopSdk.withUser(userId);
		const user = await sdk.users.getUser({ userId });
		
		if (!user) return null;
		
		return {
			id: user.id,
			username: user.username || '',
			email: '', // Email not available in public profile
			avatar_url: undefined, // Use profilePicture if available
			company_id: '', // Get from membership
		};
	} catch (error) {
		console.error('Failed to get authenticated user:', error);
		return null;
	}
}

/**
 * Verify if a user is a member of a company
 * Note: This is a placeholder - actual implementation depends on Whop SDK methods
 */
export async function verifyMembership(
	userId: string, 
	companyId: string
): Promise<boolean> {
	try {
		// TODO: Implement actual membership verification when needed
		// For now, use Whop's access.checkIfUserHasAccessToCompany method
		console.log('Verifying membership for', userId, 'in', companyId);
		return true;
	} catch (error) {
		console.error('Failed to verify membership:', error);
		return false;
	}
}

/**
 * Get all members of a company
 * Note: This is a placeholder - actual implementation depends on Whop SDK methods
 */
export async function getCompanyMembers(companyId: string): Promise<WhopUser[]> {
	try {
		// TODO: Implement actual member fetching when needed
		// The Whop SDK may not expose a direct method for this
		console.log('Getting members for company', companyId);
		return [];
	} catch (error) {
		console.error('Failed to get company members:', error);
		return [];
	}
}

/**
 * Unlock a product for a user (reward redemption)
 * Note: This is a placeholder - actual implementation depends on Whop setup
 */
export async function unlockProductForUser(
	userId: string,
	companyId: string,
	productId: string
): Promise<{ success: boolean; error?: string }> {
	try {
		// TODO: Implement actual product unlock logic when rewards system is built
		// This will likely involve creating a membership or granting access via Whop API
		console.log('Unlocking product', productId, 'for user', userId, 'in company', companyId);
		return { success: true };
	} catch (error) {
		console.error('Failed to unlock product:', error);
		return { 
			success: false, 
			error: error instanceof Error ? error.message : 'Unknown error' 
		};
	}
}

/**
 * Create a discount code for a user
 */
export async function createDiscountCode(
	companyId: string,
	percentage: number,
	userId?: string
): Promise<{ success: boolean; code?: string; error?: string }> {
	try {
		const sdk = whopSdk.withCompany(companyId);
		
		// Create a promo code
		// Note: Actual implementation depends on Whop API
		const promoCode = `REFER${percentage}_${userId?.substring(0, 6) || 'GENERIC'}`;
		
		// This is a placeholder - actual Whop API call would go here
		console.log('Creating promo code:', promoCode);
		
		return { success: true, code: promoCode };
	} catch (error) {
		console.error('Failed to create discount code:', error);
		return { 
			success: false, 
			error: error instanceof Error ? error.message : 'Unknown error' 
		};
	}
}

/**
 * Check if a user has purchased/subscribed recently
 * Note: This is a placeholder - actual implementation depends on Whop SDK methods
 */
export async function checkRecentPurchase(
	userId: string, 
	companyId: string,
	withinDays: number = 7
): Promise<boolean> {
	try {
		// TODO: Implement actual purchase verification when needed
		// This will be used for fraud detection and reward eligibility
		console.log('Checking recent purchase for', userId, 'in', companyId, 'within', withinDays, 'days');
		return true;
	} catch (error) {
		console.error('Failed to check recent purchase:', error);
		return false;
	}
}

/**
 * Get company information
 */
export async function getCompanyInfo(companyId: string) {
	try {
		const sdk = whopSdk.withCompany(companyId);
		const company = await sdk.companies.getCompany({ companyId });
		return company;
	} catch (error) {
		console.error('Failed to get company info:', error);
		return null;
	}
}
