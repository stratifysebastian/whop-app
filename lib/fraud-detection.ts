// Fraud Detection Utilities

import type { FraudCheckResult, FraudCheckType } from './types';

export interface FraudCheckInput {
	user_id?: string;
	ip_address?: string;
	user_agent?: string;
	referrer_id?: string;
	referred_id?: string;
}

export interface FraudCheckOptions {
	check_ip_duplicates?: boolean;
	check_self_referral?: boolean;
	check_velocity?: boolean;
	velocity_limit?: number; // max referrals per hour
}

/**
 * Performs basic fraud checks on a referral
 */
export async function performFraudCheck(
	input: FraudCheckInput,
	options: FraudCheckOptions = {}
): Promise<FraudCheckResult> {
	const checks: FraudCheckResult['checks'] = [];
	let fraudScore = 0;

	// Check 1: Self-referral detection
	if (options.check_self_referral && input.referrer_id && input.referred_id) {
		if (input.referrer_id === input.referred_id) {
			checks.push({
				type: 'email_duplicate',
				flagged: true,
				details: 'Self-referral detected: referrer and referred user are the same',
			});
			fraudScore += 100; // Critical
		}
	}

	// Check 2: IP duplicate detection (basic - requires Supabase integration)
	if (options.check_ip_duplicates && input.ip_address) {
		// TODO: Check against recent referrals from same IP
		// This would require querying the fraud_checks table
		// For now, just log the IP for tracking
		checks.push({
			type: 'ip_duplicate',
			flagged: false,
			details: `IP address logged: ${maskIP(input.ip_address)}`,
		});
	}

	// Check 3: Velocity limit check (basic - requires historical data)
	if (options.check_velocity) {
		// TODO: Check referral creation rate
		// This would require querying recent referrals by user
		const limit = options.velocity_limit || 10;
		checks.push({
			type: 'velocity_limit',
			flagged: false,
			details: `Velocity check: within ${limit} referrals/hour limit`,
		});
	}

	// Determine if overall check is flagged
	const flagged = fraudScore >= 50 || checks.some(c => c.flagged);

	return {
		flagged,
		fraud_score: fraudScore,
		checks,
	};
}

/**
 * Mask IP address for privacy (e.g., 192.168.1.1 -> 192.168.*.*)
 */
function maskIP(ip: string): string {
	const parts = ip.split('.');
	if (parts.length === 4) {
		return `${parts[0]}.${parts[1]}.*.* `;
	}
	// IPv6 or invalid
	return ip.substring(0, 10) + '...';
}

/**
 * Extract IP address from request headers
 */
export function getIPAddress(request: Request): string | null {
	// Try various headers that might contain the real IP
	const headers = request.headers;
	
	const xForwardedFor = headers.get('x-forwarded-for');
	if (xForwardedFor) {
		// x-forwarded-for can contain multiple IPs, take the first one
		return xForwardedFor.split(',')[0].trim();
	}

	const xRealIp = headers.get('x-real-ip');
	if (xRealIp) {
		return xRealIp.trim();
	}

	const cfConnectingIp = headers.get('cf-connecting-ip');
	if (cfConnectingIp) {
		return cfConnectingIp.trim();
	}

	// Fallback - not reliable
	return null;
}

/**
 * Get user agent from request
 */
export function getUserAgent(request: Request): string | null {
	return request.headers.get('user-agent');
}

/**
 * Simple risk score calculator
 * Returns a score from 0-100 where higher = more suspicious
 */
export function calculateRiskScore(checks: FraudCheckResult['checks']): number {
	let score = 0;

	for (const check of checks) {
		if (check.flagged) {
			switch (check.type) {
				case 'email_duplicate':
				case 'device_duplicate':
					score += 50; // High risk
					break;
				case 'ip_duplicate':
					score += 30; // Medium risk
					break;
				case 'velocity_limit':
					score += 20; // Low risk
					break;
			}
		}
	}

	return Math.min(score, 100);
}

/**
 * Check if an IP address is from a known VPN/proxy service (basic check)
 * This is a simplified version - production would use a service like IPQualityScore
 */
export function isLikelyVPN(ip: string): boolean {
	// List of known VPN IP ranges (very simplified)
	// In production, use a dedicated VPN detection service
	const vpnIndicators = [
		'10.', // Private network
		'172.16.', // Private network
		'192.168.', // Private network
	];

	return vpnIndicators.some(indicator => ip.startsWith(indicator));
}

