// Track Referral Click API Route

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/lib/types';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

interface TrackClickRequest {
	code: string;
	metadata?: {
		referrer_url?: string;
		device_fingerprint?: string;
	};
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<{ message: string }>>> {
	try {
		const body: TrackClickRequest = await request.json();
		const { code, metadata } = body;

		if (!code) {
			return NextResponse.json({
				success: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: 'Referral code is required',
				},
			}, { status: 400 });
		}

		// If Supabase is not configured, return success without storing
		if (!isSupabaseConfigured()) {
			console.log('Mock: Tracking click for code:', code);
			return NextResponse.json({
				success: true,
				data: {
					message: 'Click tracked (mock mode)',
				},
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

		// Track the click
		const { error: clickError } = await supabaseAdmin
			.from('referral_clicks')
			.insert({
				referral_code_id: referralCode.id,
				ip_address: ip,
				user_agent: userAgent,
				device_fingerprint: metadata?.device_fingerprint || null,
				referrer_url: metadata?.referrer_url || null,
				converted: false,
			});

		if (clickError) {
			console.error('Failed to track click:', clickError);
			// Don't fail the request if tracking fails
		}

		// Increment click count on referral code
		const { error: updateError } = await supabaseAdmin
			.from('referral_codes')
			.update({ clicks: (referralCode as any).clicks + 1 })
			.eq('id', referralCode.id);

		if (updateError) {
			console.error('Failed to update click count:', updateError);
		}

		return NextResponse.json({
			success: true,
			data: {
				message: 'Click tracked successfully',
			},
		});

	} catch (error) {
		console.error('Error tracking click:', error);
		return NextResponse.json({
			success: false,
			error: {
				code: 'INTERNAL_ERROR',
				message: 'An unexpected error occurred',
			},
		}, { status: 500 });
	}
}

