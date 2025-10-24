// Individual Campaign API - Get, Update, Delete

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, Campaign } from '@/lib/types';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// GET - Get a specific campaign
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ campaignId: string }> }
): Promise<NextResponse<ApiResponse<Campaign>>> {
	try {
		const { campaignId } = await params;
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

		const { data: campaign, error } = await supabaseAdmin
			.from('campaigns')
			.select('*')
			.eq('id', campaignId)
			.eq('whop_company_id', companyId)
			.single();

		if (error) {
			console.error('Failed to fetch campaign:', error);
			return NextResponse.json({
				success: false,
				error: {
					code: 'DATABASE_ERROR',
					message: 'Campaign not found',
				},
			}, { status: 404 });
		}

		return NextResponse.json({
			success: true,
			data: campaign,
		});

	} catch (error) {
		console.error('Error fetching campaign:', error);
		return NextResponse.json({
			success: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: 'An unexpected error occurred',
			},
		}, { status: 500 });
	}
}

// PUT - Update a campaign
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ campaignId: string }> }
): Promise<NextResponse<ApiResponse<Campaign>>> {
	try {
		const { campaignId } = await params;
		const body = await request.json();
		const { 
			name, 
			description, 
			start_date, 
			end_date, 
			point_multiplier, 
			prize_pool,
			is_active 
		} = body;

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
			.update({
				name,
				description: description || null,
				start_date,
				end_date,
				status,
				point_multiplier: point_multiplier || 1,
				prize_pool: prize_pool || null,
				is_active: is_active !== undefined ? is_active : status === 'active',
				updated_at: new Date().toISOString(),
			})
			.eq('id', campaignId)
			.select()
			.single();

		if (error) {
			console.error('Failed to update campaign:', error);
			return NextResponse.json({
				success: false,
				error: {
					code: 'DATABASE_ERROR',
					message: 'Failed to update campaign',
				},
			}, { status: 500 });
		}

		return NextResponse.json({
			success: true,
			data: campaign,
		});

	} catch (error) {
		console.error('Error updating campaign:', error);
		return NextResponse.json({
			success: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: 'An unexpected error occurred',
			},
		}, { status: 500 });
	}
}

// DELETE - Delete a campaign
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ campaignId: string }> }
): Promise<NextResponse<ApiResponse<{ success: boolean }>>> {
	try {
		const { campaignId } = await params;

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

		const { error } = await supabaseAdmin
			.from('campaigns')
			.delete()
			.eq('id', campaignId);

		if (error) {
			console.error('Failed to delete campaign:', error);
			return NextResponse.json({
				success: false,
				error: {
					code: 'DATABASE_ERROR',
					message: 'Failed to delete campaign',
				},
			}, { status: 500 });
		}

		return NextResponse.json({
			success: true,
			data: { success: true },
		});

	} catch (error) {
		console.error('Error deleting campaign:', error);
		return NextResponse.json({
			success: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: 'An unexpected error occurred',
			},
		}, { status: 500 });
	}
}
