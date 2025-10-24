// Get Flagged Referrals API Route

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/lib/types';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

interface FlaggedReferral {
	id: string;
	referrer_username: string;
	referred_username: string;
	check_type: string;
	flagged_at: string;
	details: any;
	status: 'pending' | 'approved' | 'rejected';
}

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<FlaggedReferral[]>>> {
	try {
		const { searchParams } = new URL(request.url);
		const companyId = searchParams.get('companyId');

		if (!companyId) {
			return NextResponse.json({
				success: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: 'Company ID is required',
				},
			}, { status: 400 });
		}

		// If Supabase is not configured, return mock data
		if (!isSupabaseConfigured()) {
			return NextResponse.json({
				success: true,
				data: [
					{
						id: 'fraud_1',
						referrer_username: 'user123',
						referred_username: 'user456',
						check_type: 'ip_duplicate',
						flagged_at: new Date().toISOString(),
						details: { description: 'Same IP address used multiple times' },
						status: 'pending' as const,
					},
				],
			});
		}

		// Get all fraud checks that are flagged
		const { data: fraudChecks, error } = await supabaseAdmin
			.from('fraud_checks')
			.select(`
				id,
				referral_id,
				check_type,
				flagged,
				details,
				created_at,
				referral:referrals (
					id,
					status,
					referrer:users!referrals_referrer_id_fkey (
						username,
						whop_company_id
					),
					referred:users!referrals_referred_id_fkey (
						username
					)
				)
			`)
			.eq('flagged', true)
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Failed to fetch flagged referrals:', error);
			return NextResponse.json({
				success: false,
				error: {
					code: 'DATABASE_ERROR',
					message: 'Failed to fetch flagged referrals',
				},
			}, { status: 500 });
		}

		// Filter by company and format results
		const flaggedReferrals: FlaggedReferral[] = [];
		
		for (const check of fraudChecks || []) {
			const referral = (check.referral as any);
			const referrer = referral?.referrer;
			
			// Only include referrals from this company
			if (referrer?.whop_company_id === companyId) {
				flaggedReferrals.push({
					id: check.id,
					referrer_username: referrer?.username || 'Unknown',
					referred_username: (referral?.referred as any)?.username || 'Unknown',
					check_type: check.check_type,
					flagged_at: check.created_at,
					details: check.details,
					status: 'pending', // TODO: Add status tracking
				});
			}
		}

		return NextResponse.json({
			success: true,
			data: flaggedReferrals,
		});

	} catch (error) {
		console.error('Error fetching flagged referrals:', error);
		return NextResponse.json({
			success: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: 'An unexpected error occurred',
			},
		}, { status: 500 });
	}
}

