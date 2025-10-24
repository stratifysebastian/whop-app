// Fraud Check API Route

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, FraudCheckResult } from '@/lib/types';
import { performFraudCheck, getIPAddress, getUserAgent } from '@/lib/fraud-detection';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<FraudCheckResult>>> {
	try {
		const body = await request.json();
		const { referral_id, referrer_id, referred_id } = body;

		if (!referral_id) {
			return NextResponse.json({
				success: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: 'Referral ID is required',
				},
			}, { status: 400 });
		}

		// Extract IP and user agent from request
		const ip_address = getIPAddress(request);
		const user_agent = getUserAgent(request);

		// Perform fraud checks
		const fraudResult = await performFraudCheck(
			{
				ip_address: ip_address || undefined,
				user_agent: user_agent || undefined,
				referrer_id,
				referred_id,
			},
			{
				check_ip_duplicates: true,
				check_self_referral: true,
				check_velocity: true,
				velocity_limit: 10,
			}
		);

		// If Supabase is configured, store the fraud check result
		if (isSupabaseConfigured()) {
			for (const check of fraudResult.checks) {
				await supabaseAdmin
					.from('fraud_checks')
					.insert({
						referral_id,
						check_type: check.type,
						flagged: check.flagged,
						details: {
							description: check.details,
							ip_address: ip_address || null,
							user_agent: user_agent || null,
							fraud_score: fraudResult.fraud_score,
						},
					});
			}
		}

		return NextResponse.json({
			success: true,
			data: fraudResult,
		});

	} catch (error) {
		console.error('Error performing fraud check:', error);
		return NextResponse.json({
			success: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: 'An unexpected error occurred',
			},
		}, { status: 500 });
	}
}

