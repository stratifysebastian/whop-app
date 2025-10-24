// Campaigns API - List and Create

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, Campaign } from '@/lib/types';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// GET - List all campaigns for a company
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<Campaign[]>>> {
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

		const { data: campaigns, error } = await supabaseAdmin
			.from('campaigns')
			.select('*')
			.eq('whop_company_id', companyId)
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Failed to fetch campaigns:', error);
			return NextResponse.json({
				success: false,
				error: {
					code: 'DATABASE_ERROR',
					message: 'Failed to fetch campaigns',
				},
			}, { status: 500 });
		}

		return NextResponse.json({
			success: true,
			data: campaigns || [],
		});

	} catch (error) {
		console.error('Error fetching campaigns:', error);
		return NextResponse.json({
			success: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: 'An unexpected error occurred',
			},
		}, { status: 500 });
	}
}

// POST - Create a new campaign
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Campaign>>> {
	try {
		const body = await request.json();
		const { 
			companyId, 
			name, 
			description, 
			start_date, 
			end_date, 
			point_multiplier, 
			prize_pool 
		} = body;

		if (!companyId || !name || !start_date || !end_date) {
			return NextResponse.json({
				success: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: 'Missing required fields',
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

		// Determine campaign status based on dates
		const now = new Date();
		const startDate = new Date(start_date);
		const endDate = new Date(end_date);
		
		let status: 'draft' | 'active' | 'ended' | 'archived' = 'draft';
		if (now >= startDate && now <= endDate) {
			status = 'active';
		} else if (now > endDate) {
			status = 'ended';
		}

		const { data: campaign, error } = await supabaseAdmin
			.from('campaigns')
			.insert({
				whop_company_id: companyId,
				name,
				description: description || null,
				start_date,
				end_date,
				status,
				point_multiplier: point_multiplier || 1,
				prize_pool: prize_pool || null,
				is_active: status === 'active',
				rules: null,
				prizes: null,
				total_referrals: 0,
			})
			.select()
			.single();

		if (error) {
			console.error('Failed to create campaign:', error);
			return NextResponse.json({
				success: false,
				error: {
					code: 'DATABASE_ERROR',
					message: 'Failed to create campaign',
				},
			}, { status: 500 });
		}

		return NextResponse.json({
			success: true,
			data: campaign,
		});

	} catch (error) {
		console.error('Error creating campaign:', error);
		return NextResponse.json({
			success: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: 'An unexpected error occurred',
			},
		}, { status: 500 });
	}
}
