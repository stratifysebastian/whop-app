// Validate Referral Code API Route

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/lib/types';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_CURRENT_USER } from '@/lib/mock-data';

interface ValidateResponse {
	valid: boolean;
	referrer?: {
		username: string;
		avatar_url: string | null;
	};
}

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<ValidateResponse>>> {
	try {
		const { searchParams } = new URL(request.url);
		const code = searchParams.get('code');

		if (!code) {
			return NextResponse.json({
				success: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: 'Referral code is required',
				},
			}, { status: 400 });
		}

		// If Supabase is not configured, return mock data
		if (!isSupabaseConfigured()) {
			return NextResponse.json({
				success: true,
				data: {
					valid: true,
					referrer: {
						username: MOCK_CURRENT_USER.username || 'Demo User',
						avatar_url: MOCK_CURRENT_USER.avatar_url,
					},
				},
			});
		}

		// Find the referral code
		const { data: referralCode, error } = await supabaseAdmin
			.from('referral_codes')
			.select(`
				id,
				is_active,
				user_id,
				users!inner (
					username,
					avatar_url
				)
			`)
			.eq('code', code.toUpperCase())
			.single();

		if (error || !referralCode) {
			return NextResponse.json({
				success: true,
				data: {
					valid: false,
				},
			});
		}

		if (!referralCode.is_active) {
			return NextResponse.json({
				success: true,
				data: {
					valid: false,
				},
			});
		}

		return NextResponse.json({
			success: true,
			data: {
				valid: true,
				referrer: {
					username: (referralCode.users as any).username || 'Anonymous',
					avatar_url: (referralCode.users as any).avatar_url,
				},
			},
		});

	} catch (error) {
		console.error('Error validating referral code:', error);
		return NextResponse.json({
			success: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: 'An unexpected error occurred',
			},
		}, { status: 500 });
	}
}

