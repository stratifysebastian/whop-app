// Rewards API - List and Create

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, Reward } from '@/lib/types';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { generateMockRewards } from '@/lib/mock-data';

// GET - List all rewards for a company
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<Reward[]>>> {
	try {
		const { searchParams } = new URL(request.url);
		const companyId = searchParams.get('companyId');

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
			const mockRewards = generateMockRewards(6, companyId);
			return NextResponse.json({
				success: true,
				data: mockRewards,
			});
		}

		const { data: rewards, error } = await supabaseAdmin
			.from('rewards')
			.select('*')
			.eq('whop_company_id', companyId)
			.eq('is_active', true)
			.order('threshold', { ascending: true });

		if (error) {
			console.error('Failed to fetch rewards:', error);
			return NextResponse.json({
				success: false,
				error: {
					code: 'DATABASE_ERROR',
					message: 'Failed to fetch rewards',
				},
			}, { status: 500 });
		}

		return NextResponse.json({
			success: true,
			data: rewards || [],
		});

	} catch (error) {
		console.error('Error fetching rewards:', error);
		return NextResponse.json({
			success: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: 'An unexpected error occurred',
			},
		}, { status: 500 });
	}
}

// POST - Create a new reward
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Reward>>> {
	try {
		const body = await request.json();
		const { companyId, name, description, threshold, reward_type, reward_data, auto_apply } = body;

		if (!companyId || !name || !threshold || !reward_type) {
			return NextResponse.json({
				success: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: 'Missing required fields',
				},
			}, { status: 400 });
		}

		// If Supabase is not configured, return mock response
		if (!isSupabaseConfigured()) {
			return NextResponse.json({
				success: true,
				data: {
					id: 'mock_reward_id',
					whop_company_id: companyId,
					name,
					description: description || null,
					threshold,
					reward_type,
					reward_data: reward_data || null,
					auto_apply: auto_apply !== false,
					is_active: true,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				},
			});
		}

		const { data: reward, error } = await supabaseAdmin
			.from('rewards')
			.insert({
				whop_company_id: companyId,
				name,
				description: description || null,
				threshold,
				reward_type,
				reward_data: reward_data || null,
				auto_apply: auto_apply !== false,
				is_active: true,
			})
			.select('*')
			.single();

		if (error) {
			console.error('Failed to create reward:', error);
			return NextResponse.json({
				success: false,
				error: {
					code: 'DATABASE_ERROR',
					message: 'Failed to create reward',
				},
			}, { status: 500 });
		}

		return NextResponse.json({
			success: true,
			data: reward,
		});

	} catch (error) {
		console.error('Error creating reward:', error);
		return NextResponse.json({
			success: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: 'An unexpected error occurred',
			},
		}, { status: 500 });
	}
}


