// Dashboard Chart Data API Route

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, TimeFrame } from '@/lib/types';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

interface ChartDataPoint {
	date: string;
	referrals: number;
	conversions: number;
}

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<ChartDataPoint[]>>> {
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

		// If Supabase is not configured, return mock data
		if (!isSupabaseConfigured()) {
			const mockData: ChartDataPoint[] = [
				{ date: 'Mon', referrals: 12, conversions: 5 },
				{ date: 'Tue', referrals: 19, conversions: 8 },
				{ date: 'Wed', referrals: 15, conversions: 7 },
				{ date: 'Thu', referrals: 22, conversions: 11 },
				{ date: 'Fri', referrals: 28, conversions: 14 },
				{ date: 'Sat', referrals: 35, conversions: 18 },
				{ date: 'Sun', referrals: 30, conversions: 15 },
			];
			
			return NextResponse.json({
				success: true,
				data: mockData,
			});
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

		// Get referrals grouped by day
		const { data: referrals, error } = await supabaseAdmin
			.from('referrals')
			.select(`
				created_at,
				status,
				referrer:users!referrals_referrer_id_fkey (
					whop_company_id
				)
			`)
			.eq('referrer.whop_company_id', companyId)
			.gte('created_at', startDate.toISOString())
			.order('created_at', { ascending: true });

		if (error) {
			console.error('Failed to fetch chart data:', error);
			return NextResponse.json({
				success: false,
				error: {
					code: 'DATABASE_ERROR',
					message: 'Failed to fetch chart data',
				},
			}, { status: 500 });
		}

		// Group by date and calculate daily stats
		const dailyStats: Record<string, { referrals: number; conversions: number }> = {};
		
		referrals?.forEach(referral => {
			const date = new Date(referral.created_at).toISOString().split('T')[0];
			if (!dailyStats[date]) {
				dailyStats[date] = { referrals: 0, conversions: 0 };
			}
			dailyStats[date].referrals++;
			if (referral.status === 'converted') {
				dailyStats[date].conversions++;
			}
		});

		// Generate chart data for the last 7 days
		const chartData: ChartDataPoint[] = [];
		const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
		
		for (let i = 6; i >= 0; i--) {
			const date = new Date();
			date.setDate(date.getDate() - i);
			const dateStr = date.toISOString().split('T')[0];
			const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1]; // Adjust for Sunday
			
			chartData.push({
				date: dayName,
				referrals: dailyStats[dateStr]?.referrals || 0,
				conversions: dailyStats[dateStr]?.conversions || 0,
			});
		}

		return NextResponse.json({
			success: true,
			data: chartData,
		});

	} catch (error) {
		console.error('Error fetching chart data:', error);
		return NextResponse.json({
			success: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: 'An unexpected error occurred',
			},
		}, { status: 500 });
	}
}
