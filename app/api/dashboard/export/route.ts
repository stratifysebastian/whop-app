// Dashboard Export API Route

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { generateMockReferrerList, generateMockUsers } from '@/lib/mock-data';

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

		let referrers: any[] = [];

		// If Supabase is not configured, use mock data
		if (!isSupabaseConfigured()) {
			const mockUsers = generateMockUsers(50);
			referrers = generateMockReferrerList(mockUsers);
		} else {
			// Fetch real data from Supabase
			const { data: users } = await supabaseAdmin
				.from('users')
				.select('*')
				.eq('whop_company_id', companyId);

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

					const { data: rewards } = await supabaseAdmin
						.from('reward_redemptions')
						.select('id')
						.eq('user_id', user.id)
						.eq('status', 'granted');

					referrers.push({
						user_id: user.id,
						username: user.username || 'Anonymous',
						email: user.email,
						referrals: totalReferrals,
						conversions,
						conversion_rate: conversionRate.toFixed(1),
						revenue_attributed: revenueAttributed.toFixed(2),
						rewards_earned: rewards?.length || 0,
						joined_at: user.created_at,
					});
				}
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
				r.email || '',
				r.referrals,
				r.conversions,
				r.conversion_rate,
				r.revenue_attributed,
				r.rewards_earned,
				r.joined_at,
			]);

			const csvContent = [
				headers.join(','),
				...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
			].join('\n');

			return new NextResponse(csvContent, {
				headers: {
					'Content-Type': 'text/csv',
					'Content-Disposition': `attachment; filename="referly-referrers-${Date.now()}.csv"`,
				},
			});
		}

		// JSON format
		return NextResponse.json(referrers, {
			headers: {
				'Content-Disposition': `attachment; filename="referly-referrers-${Date.now()}.json"`,
			},
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


