// Get User Referral Stats API Route

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, ReferralStats } from '@/lib/types';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<ReferralStats>>> {
	try {
		const whopUserId = request.headers.get('x-whop-user-id');
		
		if (!whopUserId) {
			return NextResponse.json({
				success: false,
				error: {
					code: 'UNAUTHORIZED',
					message: 'User authentication required',
				},
			}, { status: 401 });
		}

		// Ensure Supabase is configured
		if (!isSupabaseConfigured()) {
			return NextResponse.json({
				success: false,
				error: {
					code: 'DATABASE_NOT_CONFIGURED',
					message: 'Database not configured. Please set up Supabase.',
				},
			}, { status: 500 });
		}

		// Get user ID
		const { data: user } = await supabaseAdmin
			.from('users')
			.select('id')
			.eq('whop_user_id', whopUserId)
			.single();

		if (!user) {
			return NextResponse.json({
				success: false,
				error: {
					code: 'USER_NOT_FOUND',
					message: 'User not found',
				},
			}, { status: 404 });
		}

		// Get referral statistics
		const { data: referrals, error } = await supabaseAdmin
			.from('referrals')
			.select('status, revenue_attributed')
			.eq('referrer_id', user.id);

		if (error) {
			console.error('Failed to fetch referral stats:', error);
			return NextResponse.json({
				success: false,
				error: {
					code: 'DATABASE_ERROR',
					message: 'Failed to fetch referral statistics',
				},
			}, { status: 500 });
		}

		const totalReferrals = referrals?.length || 0;
		const totalConversions = referrals?.filter(r => r.status === 'converted').length || 0;
		const conversionRate = totalReferrals > 0 ? (totalConversions / totalReferrals) * 100 : 0;
		const revenueAttributed = referrals?.reduce((sum, r) => sum + (r.revenue_attributed || 0), 0) || 0;

		// Get rewards earned count
		const { data: rewards } = await supabaseAdmin
			.from('reward_redemptions')
			.select('id')
			.eq('user_id', user.id)
			.eq('status', 'granted');

		const rewardsEarned = rewards?.length || 0;

		// Get user rank (position in leaderboard)
		const { data: allReferrers } = await supabaseAdmin
			.from('referrals')
			.select('referrer_id')
			.eq('status', 'converted');

		// Count referrals per user
		const referralCounts: Record<string, number> = {};
		allReferrers?.forEach(r => {
			if (r.referrer_id) {
				referralCounts[r.referrer_id] = (referralCounts[r.referrer_id] || 0) + 1;
			}
		});

		// Sort and find rank
		const sortedReferrers = Object.entries(referralCounts)
			.sort(([, a], [, b]) => b - a);
		
		const userRank = sortedReferrers.findIndex(([id]) => id === user.id) + 1;

		const stats: ReferralStats = {
			total_referrals: totalReferrals,
			total_conversions: totalConversions,
			conversion_rate: Math.round(conversionRate * 10) / 10,
			revenue_attributed: Math.round(revenueAttributed * 100) / 100,
			rewards_earned: rewardsEarned,
			rank: userRank > 0 ? userRank : null,
		};

		return NextResponse.json({
			success: true,
			data: stats,
		});

	} catch (error) {
		console.error('Error fetching referral stats:', error);
		return NextResponse.json({
			success: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: 'An unexpected error occurred',
			},
		}, { status: 500 });
	}
}

