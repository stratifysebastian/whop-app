// Generate Referral Code API Route

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, ReferralCodeWithUrl } from '@/lib/types';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { generateMockReferralCode, MOCK_CURRENT_USER } from '@/lib/mock-data';

// Helper function to generate unique code
function generateUniqueCode(): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let code = '';
	for (let i = 0; i < 6; i++) {
		code += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return code;
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<ReferralCodeWithUrl>>> {
	try {
		// Get user authentication from headers (Whop token)
		const whopUserId = request.headers.get('x-whop-user-id');
		
		if (!whopUserId) {
			return NextResponse.json({
				success: false,
				error: {
					code: 'UNAUTHORIZED',
					message: 'User authentication required',
				},
			}, { status: 401 });
		}

		// If Supabase is not configured, return mock data
		if (!isSupabaseConfigured()) {
			console.warn('Supabase not configured, returning mock data');
			const mockCode = generateMockReferralCode(MOCK_CURRENT_USER.id);
			return NextResponse.json({
				success: true,
				data: mockCode,
			});
		}

		// Check if user exists in database
		const { data: existingUser } = await supabaseAdmin
			.from('users')
			.select('id')
			.eq('whop_user_id', whopUserId)
			.single();

		let userId = existingUser?.id;

		// If user doesn't exist, create them
		if (!userId) {
			const { data: newUser, error: userError } = await supabaseAdmin
				.from('users')
				.insert({
					whop_user_id: whopUserId,
					whop_company_id: request.headers.get('x-whop-company-id') || '',
				})
				.select('id')
				.single();

			if (userError) {
				console.error('Failed to create user:', userError);
				return NextResponse.json({
					success: false,
					error: {
						code: 'DATABASE_ERROR',
						message: 'Failed to create user',
					},
				}, { status: 500 });
			}

			userId = newUser.id;
		}

		// Check if user already has a referral code
		const { data: existingCode } = await supabaseAdmin
			.from('referral_codes')
			.select('*')
			.eq('user_id', userId)
			.eq('is_active', true)
			.single();

		if (existingCode) {
			const baseUrl = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
			return NextResponse.json({
				success: true,
				data: {
					...existingCode,
					url: `${baseUrl}?ref=${existingCode.code}`,
				},
			});
		}

		// Generate a new unique code
		let code = generateUniqueCode();
		let attempts = 0;
		const maxAttempts = 10;

		// Ensure code is unique
		while (attempts < maxAttempts) {
			const { data: codeExists } = await supabaseAdmin
				.from('referral_codes')
				.select('id')
				.eq('code', code)
				.single();

			if (!codeExists) break;
			
			code = generateUniqueCode();
			attempts++;
		}

		if (attempts >= maxAttempts) {
			return NextResponse.json({
				success: false,
				error: {
					code: 'CODE_GENERATION_FAILED',
					message: 'Failed to generate unique code',
				},
			}, { status: 500 });
		}

		// Create the referral code
		const { data: newCode, error: codeError } = await supabaseAdmin
			.from('referral_codes')
			.insert({
				user_id: userId,
				code,
				clicks: 0,
				conversions: 0,
				is_active: true,
			})
			.select('*')
			.single();

		if (codeError) {
			console.error('Failed to create referral code:', codeError);
			return NextResponse.json({
				success: false,
				error: {
					code: 'DATABASE_ERROR',
					message: 'Failed to create referral code',
				},
			}, { status: 500 });
		}

		const baseUrl = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
		const responseData: ReferralCodeWithUrl = {
			...newCode,
			url: `${baseUrl}?ref=${newCode.code}`,
		};

		return NextResponse.json({
			success: true,
			data: responseData,
		});

	} catch (error) {
		console.error('Error generating referral code:', error);
		return NextResponse.json({
			success: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: 'An unexpected error occurred',
			},
		}, { status: 500 });
	}
}

// Get user's existing referral code
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<ReferralCodeWithUrl>>> {
	try {
		const whopUserId = request.headers.get('x-whop-user-id');
		
		if (!whopUserId) {
			return NextResponse.json({
				success: false,
				error: {
					code: 'UNAUTHORIZED',
					message: 'User authentication required',
				},
			}, { status: 401 });
		}

		// If Supabase is not configured, return mock data
		if (!isSupabaseConfigured()) {
			const mockCode = generateMockReferralCode(MOCK_CURRENT_USER.id);
			return NextResponse.json({
				success: true,
				data: mockCode,
			});
		}

		// Get user ID
		const { data: user } = await supabaseAdmin
			.from('users')
			.select('id')
			.eq('whop_user_id', whopUserId)
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

		// Get referral code
		const { data: code, error } = await supabaseAdmin
			.from('referral_codes')
			.select('*')
			.eq('user_id', user.id)
			.eq('is_active', true)
			.single();

		if (error || !code) {
			return NextResponse.json({
				success: false,
				error: {
					code: 'CODE_NOT_FOUND',
					message: 'No referral code found. Please generate one first.',
				},
			}, { status: 404 });
		}

		const baseUrl = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
		const responseData: ReferralCodeWithUrl = {
			...code,
			url: `${baseUrl}?ref=${code.code}`,
		};

		return NextResponse.json({
			success: true,
			data: responseData,
		});

	} catch (error) {
		console.error('Error fetching referral code:', error);
		return NextResponse.json({
			success: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: 'An unexpected error occurred',
			},
		}, { status: 500 });
	}
}

