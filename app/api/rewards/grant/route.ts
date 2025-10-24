// Grant Reward API Route

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, RewardRedemption } from '@/lib/types';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { unlockProductForUser, createDiscountCode } from '@/lib/whop-sdk';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Partial<RewardRedemption>>>> {
	try {
		const body = await request.json();
		const { user_id, reward_id, company_id } = body;

		if (!user_id || !reward_id) {
			return NextResponse.json({
				success: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: 'User ID and Reward ID are required',
				},
			}, { status: 400 });
		}

		// If Supabase is not configured, return mock response
		if (!isSupabaseConfigured()) {
			console.log('Mock: Granting reward', reward_id, 'to user', user_id);
			return NextResponse.json({
				success: true,
				data: {
					id: 'mock_redemption_id',
					user_id: 'mock_user_id',
					reward_id,
					status: 'granted',
					granted_at: new Date().toISOString(),
				} as Partial<RewardRedemption>,
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

		// Get reward details
		const { data: reward, error: rewardError } = await supabaseAdmin
			.from('rewards')
			.select('*')
			.eq('id', reward_id)
			.single();

		if (rewardError || !reward) {
			return NextResponse.json({
				success: false,
				error: {
					code: 'REWARD_NOT_FOUND',
					message: 'Reward not found',
				},
			}, { status: 404 });
		}

		// Check if already redeemed
		const { data: existingRedemption } = await supabaseAdmin
			.from('reward_redemptions')
			.select('id')
			.eq('user_id', user.id)
			.eq('reward_id', reward_id)
			.single();

		if (existingRedemption) {
			return NextResponse.json({
				success: false,
				error: {
					code: 'ALREADY_REDEEMED',
					message: 'Reward already redeemed',
				},
			}, { status: 409 });
		}

		// Create redemption record
		const { data: redemption, error: redemptionError } = await supabaseAdmin
			.from('reward_redemptions')
			.insert({
				user_id: user.id,
				reward_id: reward_id,
				status: 'pending',
			})
			.select('*')
			.single();

		if (redemptionError) {
			console.error('Failed to create redemption:', redemptionError);
			return NextResponse.json({
				success: false,
				error: {
					code: 'DATABASE_ERROR',
					message: 'Failed to create redemption',
				},
			}, { status: 500 });
		}

		// Grant the actual reward based on type
		let grantSuccess = false;
		let errorMessage = '';

		try {
			switch (reward.reward_type) {
				case 'product_unlock':
					const productId = reward.reward_data?.product_id;
					if (productId && company_id) {
						const result = await unlockProductForUser(user_id, company_id, productId);
						grantSuccess = result.success;
						errorMessage = result.error || '';
					}
					break;

				case 'discount':
					const percentage = reward.reward_data?.discount_percentage || 10;
					if (company_id) {
						const result = await createDiscountCode(company_id, percentage, user_id);
						grantSuccess = result.success;
						errorMessage = result.error || '';
					}
					break;

				case 'custom':
					// For custom rewards, just mark as granted
					// The creator will handle fulfillment manually
					grantSuccess = true;
					break;
			}
		} catch (error) {
			console.error('Error granting reward:', error);
			errorMessage = error instanceof Error ? error.message : 'Unknown error';
		}

		// Update redemption status
		const newStatus = grantSuccess ? 'granted' : 'failed';
		await supabaseAdmin
			.from('reward_redemptions')
			.update({
				status: newStatus,
				granted_at: grantSuccess ? new Date().toISOString() : null,
				error_message: errorMessage || null,
			})
			.eq('id', redemption.id);

		if (!grantSuccess) {
			return NextResponse.json({
				success: false,
				error: {
					code: 'GRANT_FAILED',
					message: errorMessage || 'Failed to grant reward',
				},
			}, { status: 500 });
		}

		return NextResponse.json({
			success: true,
			data: {
				id: redemption.id,
				user_id: redemption.user_id,
				reward_id: redemption.reward_id,
				status: newStatus,
				granted_at: new Date().toISOString(),
			},
		});

	} catch (error) {
		console.error('Error granting reward:', error);
		return NextResponse.json({
			success: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: 'An unexpected error occurred',
			},
		}, { status: 500 });
	}
}


