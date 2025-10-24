// Dashboard Export API Route

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const companyId = searchParams.get('companyId');
		const format = searchParams.get('format') || 'csv';

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

		// Fetch real data from Supabase
		const { data: users } = await supabaseAdmin
			.from('users')
			.select('*')
			.eq('whop_company_id', companyId);

		const referrers: any[] = [];

		for (const user of users || []) {
			const { data: referrals } = await supabaseAdmin
				.from('referrals')
				.select('status, revenue_attributed')
				.eq('referrer_id', user.id);

			const totalReferrals = referrals?.length || 0;
			if (totalReferrals > 0) {
				const conversions = referrals?.filter(r => r.status === 'converted').length || 0;
				const conversionRate = totalReferrals > 0 ? (conversions / totalReferrals) * 100 : 0;
				const revenueAttributed = referrals?.reduce((sum, r) => sum + (r.revenue_attributed || 0), 0) || 0;

				referrers.push({
					user_id: user.id,
					username: user.username || 'Unknown',
					email: user.email || '',
					referrals: totalReferrals,
					conversions,
					conversion_rate: conversionRate,
					revenue_attributed: revenueAttributed,
					rewards_earned: 0, // TODO: Calculate from rewards table
					joined_at: user.created_at,
				});
			}
		}

		if (format === 'csv') {
			// Generate CSV
			const headers = [
				'User ID',
				'Username',
				'Email',
				'Total Referrals',
				'Conversions',
				'Conversion Rate (%)',
				'Revenue Attributed ($)',
				'Rewards Earned',
				'Joined At',
			];

			const rows = referrers.map(r => [
				r.user_id,
				r.username,
				r.email,
				r.referrals,
				r.conversions,
				r.conversion_rate.toFixed(2),
				r.revenue_attributed.toFixed(2),
				r.rewards_earned,
				new Date(r.joined_at).toLocaleDateString(),
			]);

			const csvContent = [headers, ...rows]
				.map(row => row.map(field => `"${field}"`).join(','))
				.join('\n');

			return new NextResponse(csvContent, {
				headers: {
					'Content-Type': 'text/csv',
					'Content-Disposition': `attachment; filename="referrers-${Date.now()}.csv"`,
				},
			});
		}

		// Default to JSON
		return NextResponse.json({
			success: true,
			data: referrers,
		});

	} catch (error) {
		console.error('Error exporting data:', error);
		return NextResponse.json({
			success: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: 'An unexpected error occurred',
			},
		}, { status: 500 });
	}
}