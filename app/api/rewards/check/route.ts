// Check Reward Eligibility API Route

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, RewardEligibility } from '@/lib/types';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<RewardEligibility>>> {
	try {
		const body = await request.json();
		const { user_id, company_id } = body;

		if (!user_id || !company_id) {
			return NextResponse.json({
				success: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: 'User ID and Company ID are required',
				},
			}, { status: 400 });
		}

		// If Supabase is not configured, return mock data
		if (!isSupabaseConfigured()) {
			return NextResponse.json({
				success: true,
				data: {
					eligible_rewards: [
						{
							reward_id: 'mock_reward_1',
							name: '5 Referrals Bonus',
							can_claim: true,
						},
					],
					next_milestone: {
						reward_id: 'mock_reward_2',
						name: '10 Referrals Bonus',
						referrals_needed: 3,
					},
				},
			});
		}

		// Get user from database
		const { data: user } = await supabaseAdmin
			.from('users')
			.select('id')
			.eq('whop_user_id', user_id)
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

		// Get user's total conversions
		const { data: referrals } = await supabaseAdmin
			.from('referrals')
			.select('status')
			.eq('referrer_id', user.id)
			.eq('status', 'converted');

		const totalConversions = referrals?.length || 0;

		// Get all active rewards for this company
		const { data: allRewards } = await supabaseAdmin
			.from('rewards')
			.select('*')
			.eq('whop_company_id', company_id)
			.eq('is_active', true)
			.order('threshold', { ascending: true });

		// Get already redeemed rewards
		const { data: redemptions } = await supabaseAdmin
			.from('reward_redemptions')
			.select('reward_id')
			.eq('user_id', user.id)
			.in('status', ['granted', 'claimed']);

		const redeemedRewardIds = new Set(redemptions?.map(r => r.reward_id) || []);

		// Determine eligible rewards and next milestone
		const eligibleRewards = [];
		let nextMilestone = null;

		for (const reward of allRewards || []) {
			if (totalConversions >= reward.threshold && !redeemedRewardIds.has(reward.id)) {
				eligibleRewards.push({
					reward_id: reward.id,
					name: reward.name,
					can_claim: true,
				});
			} else if (totalConversions < reward.threshold && !nextMilestone) {
				nextMilestone = {
					reward_id: reward.id,
					name: reward.name,
					referrals_needed: reward.threshold - totalConversions,
				};
			}
		}

		return NextResponse.json({
			success: true,
			data: {
				eligible_rewards: eligibleRewards,
				next_milestone: nextMilestone,
			},
		});

	} catch (error) {
		console.error('Error checking reward eligibility:', error);
		return NextResponse.json({
			success: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: 'An unexpected error occurred',
			},
		}, { status: 500 });
	}
}


