// Middleware for Referly - Handles referral link tracking

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const { searchParams, pathname } = new URL(request.url);
	const refCode = searchParams.get('ref');

	// If there's a referral code in the URL
	if (refCode) {
		// Create response
		const response = NextResponse.next();

		// Store referral code in cookie for 30 days
		response.cookies.set('referly_ref_code', refCode, {
			maxAge: 60 * 60 * 24 * 30, // 30 days
			path: '/',
			sameSite: 'lax',
		});

		// Store timestamp of when the referral link was clicked
		response.cookies.set('referly_ref_timestamp', Date.now().toString(), {
			maxAge: 60 * 60 * 24 * 30,
			path: '/',
			sameSite: 'lax',
		});

		// Track the click asynchronously (fire and forget)
		// The actual API call will be made client-side
		console.log(`Referral code detected: ${refCode}`);

		return response;
	}

	return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api/referrals (already handled by API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api/referrals|_next/static|_next/image|favicon.ico).*)',
	],
};

