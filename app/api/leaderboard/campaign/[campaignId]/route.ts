// Campaign-Specific Leaderboard API Route

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, LeaderboardEntry, TimeFrame } from '@/lib/types';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ campaignId: string }> }
): Promise<NextResponse<ApiResponse<LeaderboardEntry[]>>> {
	try {
		const { campaignId } = await params;
		const { searchParams } = new URL(request.url);
		const companyId = searchParams.get('companyId');
		const timeframe = (searchParams.get('timeframe') as TimeFrame) || '30d';
		const limit = parseInt(searchParams.get('limit') || '50');

		if (!companyId) {
			return NextResponse.json({
				success: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: 'Company ID is required',
				},
			}, { status: 400 });
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

		// Calculate date range based on timeframe
		const now = new Date();
		let startDate = new Date();
		
		switch (timeframe) {
			case '7d':
				startDate.setDate(now.getDate() - 7);
				break;
			case '30d':
				startDate.setDate(now.getDate() - 30);
				break;
			case 'all':
				startDate = new Date(2020, 0, 1);
				break;
		}

		// Get campaign-specific referrals
		const { data: referrals, error } = await supabaseAdmin
			.from('referrals')
			.select(`
				status,
				created_at,
				referrer:users!referrals_referrer_id_fkey (
					id,
					username,
					avatar_url,
					whop_company_id
				)
			`)
			.eq('campaign_id', campaignId)
			.eq('referrer.whop_company_id', companyId)
			.gte('created_at', startDate.toISOString());

		if (error) {
			console.error('Failed to fetch campaign referrals:', error);
			return NextResponse.json({
				success: false,
				error: {
					code: 'DATABASE_ERROR',
					message: 'Failed to fetch campaign leaderboard',
				},
			}, { status: 500 });
		}

		// Process leaderboard data
		const leaderboardMap: Record<string, LeaderboardEntry> = {};

		referrals?.forEach(referral => {
			const referrer = (referral.referrer as any);
			if (!referrer) return;

			const userId = referrer.id;
			if (!leaderboardMap[userId]) {
				leaderboardMap[userId] = {
					user_id: userId,
					username: referrer.username || 'Anonymous',
					avatar_url: referrer.avatar_url,
					referrals: 0,
					conversions: 0,
					points: 0,
					rank: 0,
				};
			}

			leaderboardMap[userId].referrals++;
			if (referral.status === 'converted') {
				leaderboardMap[userId].conversions++;
			}
		});

		// Convert to array and calculate points
		const leaderboardEntries = Object.values(leaderboardMap).map(entry => ({
			...entry,
			points: entry.conversions * 10, // 10 points per conversion
		}));

		// Sort by points and assign ranks
		leaderboardEntries.sort((a, b) => b.points - a.points);
		leaderboardEntries.forEach((entry, index) => {
			entry.rank = index + 1;
		});

		return NextResponse.json({
			success: true,
			data: leaderboardEntries.slice(0, limit),
		});

	} catch (error) {
		console.error('Error fetching campaign leaderboard:', error);
		return NextResponse.json({
			success: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: 'An unexpected error occurred',
			},
		}, { status: 500 });
	}
}
