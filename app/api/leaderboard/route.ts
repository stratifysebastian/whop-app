// Global Leaderboard API Route

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, LeaderboardEntry, TimeFrame } from '@/lib/types';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<LeaderboardEntry[]>>> {
	try {
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

		// Get all users for this company
		const { data: users, error: usersError } = await supabaseAdmin
			.from('users')
			.select('id, username, avatar_url')
			.eq('whop_company_id', companyId);

		if (usersError) {
			console.error('Failed to fetch users:', usersError);
			return NextResponse.json({
				success: false,
				error: {
					code: 'DATABASE_ERROR',
					message: 'Failed to fetch leaderboard data',
				},
			}, { status: 500 });
		}

		// Get referral stats for each user
		const leaderboardEntries: LeaderboardEntry[] = [];

		for (const user of users || []) {
			const { data: referrals } = await supabaseAdmin
				.from('referrals')
				.select('status')
				.eq('referrer_id', user.id)
				.gte('created_at', startDate.toISOString());

			const totalReferrals = referrals?.length || 0;
			const conversions = referrals?.filter(r => r.status === 'converted').length || 0;

			if (conversions > 0) {
				leaderboardEntries.push({
					user_id: user.id,
					username: user.username || 'Anonymous',
					avatar_url: user.avatar_url,
					referrals: totalReferrals,
					conversions,
					points: conversions, // Points equal to conversions for now
					rank: 0, // Will be set after sorting
				});
			}
		}

		// Sort by conversions and assign ranks
		leaderboardEntries.sort((a, b) => b.conversions - a.conversions);
		leaderboardEntries.forEach((entry, index) => {
			entry.rank = index + 1;
		});

		return NextResponse.json({
			success: true,
			data: leaderboardEntries.slice(0, limit),
		});

	} catch (error) {
		console.error('Error fetching leaderboard:', error);
		return NextResponse.json({
			success: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: 'An unexpected error occurred',
			},
		}, { status: 500 });
	}
}

