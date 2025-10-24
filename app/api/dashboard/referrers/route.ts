// Dashboard Referrers List API Route

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, PaginatedResponse, ReferrerListItem, DashboardFilters } from '@/lib/types';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { generateMockReferrerList, generateMockUsers } from '@/lib/mock-data';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<PaginatedResponse<ReferrerListItem>>>> {
	try {
		const { searchParams } = new URL(request.url);
		const companyId = searchParams.get('companyId');
		const page = parseInt(searchParams.get('page') || '1');
		const limit = parseInt(searchParams.get('limit') || '25');
		const sort = searchParams.get('sort') || 'referrals';
		const order = searchParams.get('order') || 'desc';
		const search = searchParams.get('search') || '';

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
			const mockUsers = generateMockUsers(50);
			let mockReferrers = generateMockReferrerList(mockUsers);

			// Apply search filter
			if (search) {
				mockReferrers = mockReferrers.filter(r => 
					r.username.toLowerCase().includes(search.toLowerCase())
				);
			}

			// Apply sorting
			mockReferrers.sort((a, b) => {
				const aVal = a[sort as keyof ReferrerListItem] as number;
				const bVal = b[sort as keyof ReferrerListItem] as number;
				return order === 'desc' ? bVal - aVal : aVal - bVal;
			});

			// Apply pagination
			const start = (page - 1) * limit;
			const paginatedReferrers = mockReferrers.slice(start, start + limit);

			return NextResponse.json({
				success: true,
				data: {
					data: paginatedReferrers,
					pagination: {
						page,
						limit,
						total: mockReferrers.length,
						total_pages: Math.ceil(mockReferrers.length / limit),
					},
				},
			});
		}

		// Get all users for this company with their referral stats
		const { data: users, error: usersError } = await supabaseAdmin
			.from('users')
			.select('*')
			.eq('whop_company_id', companyId);

		if (usersError) {
			console.error('Failed to fetch users:', usersError);
			return NextResponse.json({
				success: false,
				error: {
					code: 'DATABASE_ERROR',
					message: 'Failed to fetch referrers',
				},
			}, { status: 500 });
		}

		// Get referral stats for each user
		const referrerList: ReferrerListItem[] = [];

		for (const user of users || []) {
			const { data: referrals } = await supabaseAdmin
				.from('referrals')
				.select('status, revenue_attributed')
				.eq('referrer_id', user.id);

			const totalReferrals = referrals?.length || 0;
			const conversions = referrals?.filter(r => r.status === 'converted').length || 0;
			const conversionRate = totalReferrals > 0 ? (conversions / totalReferrals) * 100 : 0;
			const revenueAttributed = referrals?.reduce((sum, r) => sum + (r.revenue_attributed || 0), 0) || 0;

			// Get rewards earned
			const { data: rewards } = await supabaseAdmin
				.from('reward_redemptions')
				.select('id')
				.eq('user_id', user.id)
				.eq('status', 'granted');

			// Only include users who have made referrals
			if (totalReferrals > 0) {
				referrerList.push({
					user_id: user.id,
					username: user.username || 'Anonymous',
					email: user.email,
					referrals: totalReferrals,
					conversions,
					conversion_rate: Math.round(conversionRate * 10) / 10,
					revenue_attributed: Math.round(revenueAttributed * 100) / 100,
					rewards_earned: rewards?.length || 0,
					joined_at: user.created_at,
				});
			}
		}

		// Apply search filter
		let filteredReferrers = referrerList;
		if (search) {
			filteredReferrers = referrerList.filter(r =>
				r.username.toLowerCase().includes(search.toLowerCase()) ||
				r.email?.toLowerCase().includes(search.toLowerCase())
			);
		}

		// Apply sorting
		filteredReferrers.sort((a, b) => {
			const aVal = a[sort as keyof ReferrerListItem] as number;
			const bVal = b[sort as keyof ReferrerListItem] as number;
			if (order === 'desc') {
				return (bVal || 0) - (aVal || 0);
			}
			return (aVal || 0) - (bVal || 0);
		});

		// Apply pagination
		const start = (page - 1) * limit;
		const paginatedReferrers = filteredReferrers.slice(start, start + limit);

		return NextResponse.json({
			success: true,
			data: {
				data: paginatedReferrers,
				pagination: {
					page,
					limit,
					total: filteredReferrers.length,
					total_pages: Math.ceil(filteredReferrers.length / limit),
				},
			},
		});

	} catch (error) {
		console.error('Error fetching referrers:', error);
		return NextResponse.json({
			success: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: 'An unexpected error occurred',
			},
		}, { status: 500 });
	}
}


