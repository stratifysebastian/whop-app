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
		const user = await sdk.users.retrieve({ userId });
		
		if (!user) return null;
		
		return {
			id: user.id,
			username: user.username || '',
			email: user.email || '',
			avatar_url: user.profile_pic_url || undefined,
			company_id: '', // Get from membership
		};
	} catch (error) {
		console.error('Failed to get authenticated user:', error);
		return null;
	}
}

/**
 * Verify if a user is a member of a company
 */
export async function verifyMembership(
	userId: string, 
	companyId: string
): Promise<boolean> {
	try {
		const sdk = whopSdk.withUser(userId).withCompany(companyId);
		const memberships = await sdk.memberships.list({ userId });
		
		// Check if user has any active membership in this company
		const activeMembership = memberships.data?.find(
			(membership) => membership.valid && membership.company_id === companyId
		);
		
		return !!activeMembership;
	} catch (error) {
		console.error('Failed to verify membership:', error);
		return false;
	}
}

/**
 * Get all members of a company
 */
export async function getCompanyMembers(companyId: string): Promise<WhopUser[]> {
	try {
		const sdk = whopSdk.withCompany(companyId);
		const memberships = await sdk.memberships.list({ company_id: companyId });
		
		if (!memberships.data) return [];
		
		// Get unique user IDs
		const userIds = [...new Set(memberships.data.map(m => m.user_id))];
		
		// Fetch user details (in batches if needed)
		const users: WhopUser[] = [];
		for (const userId of userIds) {
			try {
				const user = await sdk.users.retrieve({ userId });
				if (user) {
					users.push({
						id: user.id,
						username: user.username || '',
						email: user.email || '',
						avatar_url: user.profile_pic_url || undefined,
						company_id: companyId,
					});
				}
			} catch (err) {
				console.error(`Failed to fetch user ${userId}:`, err);
			}
		}
		
		return users;
	} catch (error) {
		console.error('Failed to get company members:', error);
		return [];
	}
}

/**
 * Unlock a product for a user (reward redemption)
 */
export async function unlockProductForUser(
	userId: string,
	companyId: string,
	productId: string
): Promise<{ success: boolean; error?: string }> {
	try {
		const sdk = whopSdk.withUser(userId).withCompany(companyId);
		
		// Grant access to the product
		// Note: The actual implementation depends on your Whop setup
		// This is a placeholder for the product unlock logic
		await sdk.memberships.create({
			product_id: productId,
			user_id: userId,
			// Additional parameters as needed
		} as any);
		
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
 */
export async function checkRecentPurchase(
	userId: string, 
	companyId: string,
	withinDays: number = 7
): Promise<boolean> {
	try {
		const sdk = whopSdk.withUser(userId).withCompany(companyId);
		const memberships = await sdk.memberships.list({ userId });
		
		if (!memberships.data) return false;
		
		const cutoffDate = new Date();
		cutoffDate.setDate(cutoffDate.getDate() - withinDays);
		
		// Check if any membership was created recently
		const recentPurchase = memberships.data.find((membership) => {
			const createdAt = new Date(membership.created_at * 1000); // Unix timestamp
			return createdAt >= cutoffDate && membership.company_id === companyId;
		});
		
		return !!recentPurchase;
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
		const company = await sdk.companies.retrieve({ companyId });
		return company;
	} catch (error) {
		console.error('Failed to get company info:', error);
		return null;
	}
}
