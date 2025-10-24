// Dashboard Overview API Route

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, DashboardOverview, TimeFrame } from '@/lib/types';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<DashboardOverview>>> {
	try {
		const { searchParams } = new URL(request.url);
		const companyId = searchParams.get('companyId');
		const timeframe = (searchParams.get('timeframe') as TimeFrame) || '30d';

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
				startDate = new Date(2020, 0, 1); // Start from 2020
				break;
		}

		// Get all referrals in the timeframe
		const { data: referrals, error: referralsError } = await supabaseAdmin
			.from('referrals')
			.select(`
				id,
				status,
				revenue_attributed,
				created_at,
				referrer:users!referrals_referrer_id_fkey (
					id,
					username,
					whop_company_id
				)
			`)
			.eq('referrer.whop_company_id', companyId)
			.gte('created_at', startDate.toISOString());

		if (referralsError) {
			console.error('Failed to fetch referrals:', referralsError);
			return NextResponse.json({
				success: false,
				error: {
					code: 'DATABASE_ERROR',
					message: 'Failed to fetch dashboard data',
				},
			}, { status: 500 });
		}

		const totalReferrals = referrals?.length || 0;
		const totalConversions = referrals?.filter(r => r.status === 'converted').length || 0;
		const conversionRate = totalReferrals > 0 ? (totalConversions / totalReferrals) * 100 : 0;
		const revenueAttributed = referrals?.reduce((sum, r) => sum + (r.revenue_attributed || 0), 0) || 0;

		// Get unique active referrers
		const activeUsers = new Set(referrals?.map(r => (r.referrer as any)?.id).filter(Boolean));

		// Get top referrers
		const referrerCounts: Record<string, { count: number; conversions: number; username: string }> = {};
		referrals?.forEach(r => {
			const referrerId = (r.referrer as any)?.id;
			if (referrerId) {
				if (!referrerCounts[referrerId]) {
					referrerCounts[referrerId] = {
						count: 0,
						conversions: 0,
						username: (r.referrer as any)?.username || 'Anonymous',
					};
				}
				referrerCounts[referrerId].count++;
				if (r.status === 'converted') {
					referrerCounts[referrerId].conversions++;
				}
			}
		});

		const topReferrers = Object.entries(referrerCounts)
			.map(([user_id, data]) => ({
				user_id,
				username: data.username,
				referrals: data.count,
				conversions: data.conversions,
			}))
			.sort((a, b) => b.referrals - a.referrals)
			.slice(0, 5);

		const overview: DashboardOverview = {
			total_referrals: totalReferrals,
			total_conversions: totalConversions,
			conversion_rate: Math.round(conversionRate * 10) / 10,
			revenue_attributed: Math.round(revenueAttributed * 100) / 100,
			active_users: activeUsers.size,
			top_referrers: topReferrers,
		};

		return NextResponse.json({
			success: true,
			data: overview,
		});

	} catch (error) {
		console.error('Error fetching dashboard overview:', error);
		return NextResponse.json({
			success: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: 'An unexpected error occurred',
			},
		}, { status: 500 });
	}
}


