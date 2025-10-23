// Track Referral Conversion API Route

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, Referral } from '@/lib/types';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

interface TrackConversionRequest {
	code: string;
	referred_user_id: string;
	campaign_id?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Partial<Referral>>>> {
	try {
		const body: TrackConversionRequest = await request.json();
		const { code, referred_user_id, campaign_id } = body;

		if (!code || !referred_user_id) {
			return NextResponse.json({
				success: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: 'Referral code and referred user ID are required',
				},
			}, { status: 400 });
		}

		// If Supabase is not configured, return mock data
		if (!isSupabaseConfigured()) {
			console.log('Mock: Tracking conversion for code:', code);
			return NextResponse.json({
				success: true,
				data: {
					id: 'mock_referral_id',
					referrer_id: 'mock_referrer_id',
					referred_id: 'mock_referred_id',
					status: 'converted',
				} as Partial<Referral>,
			});
		}

		// Get client IP address
		const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
		           request.headers.get('x-real-ip') || 
		           '0.0.0.0';
		
		const userAgent = request.headers.get('user-agent') || '';

		// Find the referral code
		const { data: referralCode, error: codeError } = await supabaseAdmin
			.from('referral_codes')
			.select('id, user_id, is_active')
			.eq('code', code.toUpperCase())
			.eq('is_active', true)
			.single();

		if (codeError || !referralCode) {
			return NextResponse.json({
				success: false,
				error: {
					code: 'INVALID_CODE',
					message: 'Invalid or inactive referral code',
				},
			}, { status: 404 });
		}

		// Check if referred user exists
		const { data: referredUser, error: referredError } = await supabaseAdmin
			.from('users')
			.select('id')
			.eq('whop_user_id', referred_user_id)
			.single();

		if (referredError || !referredUser) {
			// Create the referred user if they don't exist
			const { data: newUser, error: createError } = await supabaseAdmin
				.from('users')
				.insert({
					whop_user_id: referred_user_id,
					whop_company_id: request.headers.get('x-whop-company-id') || '',
				})
				.select('id')
				.single();

			if (createError) {
				console.error('Failed to create referred user:', createError);
				return NextResponse.json({
					success: false,
					error: {
						code: 'DATABASE_ERROR',
						message: 'Failed to create user',
					},
				}, { status: 500 });
			}
		}

		// Check if this conversion already exists (prevent duplicates)
		const { data: existingReferral } = await supabaseAdmin
			.from('referrals')
			.select('id')
			.eq('referral_code_id', referralCode.id)
			.eq('referred_id', referredUser?.id || '')
			.single();

		if (existingReferral) {
			return NextResponse.json({
				success: false,
				error: {
					code: 'DUPLICATE_REFERRAL',
					message: 'This referral has already been tracked',
				},
			}, { status: 409 });
		}

		// Get referrer user ID
		const { data: referrerUser } = await supabaseAdmin
			.from('users')
			.select('id')
			.eq('id', referralCode.user_id)
			.single();

		if (!referrerUser) {
			return NextResponse.json({
				success: false,
				error: {
					code: 'REFERRER_NOT_FOUND',
					message: 'Referrer user not found',
				},
			}, { status: 404 });
		}

		// Create the referral conversion
		const { data: newReferral, error: referralError } = await supabaseAdmin
			.from('referrals')
			.insert({
				referrer_id: referrerUser.id,
				referred_id: referredUser?.id || '',
				referral_code_id: referralCode.id,
				campaign_id: campaign_id || null,
				status: 'converted',
				converted_at: new Date().toISOString(),
				revenue_attributed: 0, // Will be updated later when payment is processed
				ip_address: ip,
				user_agent: userAgent,
				device_fingerprint: null,
				is_verified: false, // Will be verified after payment
				fraud_score: 0,
			})
			.select('*')
			.single();

		if (referralError) {
			console.error('Failed to create referral:', referralError);
			return NextResponse.json({
				success: false,
				error: {
					code: 'DATABASE_ERROR',
					message: 'Failed to create referral',
				},
			}, { status: 500 });
		}

		// Update conversion count on referral code
		await supabaseAdmin
			.from('referral_codes')
			.update({ conversions: ((referralCode as any).conversions || 0) + 1 })
			.eq('id', referralCode.id);

		// Mark any associated clicks as converted
		await supabaseAdmin
			.from('referral_clicks')
			.update({ converted: true })
			.eq('referral_code_id', referralCode.id)
			.eq('ip_address', ip)
			.eq('converted', false);

		// Update campaign total if this is a campaign referral
		if (campaign_id) {
			const { data: campaign } = await supabaseAdmin
				.from('campaigns')
				.select('total_referrals')
				.eq('id', campaign_id)
				.single();

			if (campaign) {
				await supabaseAdmin
					.from('campaigns')
					.update({ total_referrals: campaign.total_referrals + 1 })
					.eq('id', campaign_id);
			}
		}

		return NextResponse.json({
			success: true,
			data: {
				id: newReferral.id,
				referrer_id: newReferral.referrer_id,
				referred_id: newReferral.referred_id,
				status: newReferral.status,
			},
		});

	} catch (error) {
		console.error('Error tracking conversion:', error);
		return NextResponse.json({
			success: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: 'An unexpected error occurred',
			},
		}, { status: 500 });
	}
}

