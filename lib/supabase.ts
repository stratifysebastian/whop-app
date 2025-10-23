// Supabase Client Configuration for Referly

import { createClient } from '@supabase/supabase-js';

// Supabase URL and Anon Key
// These will be provided after creating a Supabase project
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Server-side Supabase key (has more permissions)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

// Create Supabase client for client-side usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		persistSession: false, // We're using Whop for auth
		autoRefreshToken: false,
	},
});

// Create Supabase client for server-side usage (with service key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
	auth: {
		persistSession: false,
		autoRefreshToken: false,
	},
});

// Type-safe database helpers
export type Database = {
	public: {
		Tables: {
			users: {
				Row: {
					id: string;
					whop_user_id: string;
					whop_company_id: string;
					username: string | null;
					email: string | null;
					avatar_url: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
				Update: Partial<Database['public']['Tables']['users']['Insert']>;
			};
			referral_codes: {
				Row: {
					id: string;
					user_id: string;
					code: string;
					clicks: number;
					conversions: number;
					is_active: boolean;
					created_at: string;
					updated_at: string;
				};
				Insert: Omit<Database['public']['Tables']['referral_codes']['Row'], 'id' | 'created_at' | 'updated_at'>;
				Update: Partial<Database['public']['Tables']['referral_codes']['Insert']>;
			};
			referrals: {
				Row: {
					id: string;
					referrer_id: string | null;
					referred_id: string;
					referral_code_id: string | null;
					campaign_id: string | null;
					status: string;
					converted_at: string | null;
					revenue_attributed: number;
					ip_address: string | null;
					user_agent: string | null;
					device_fingerprint: string | null;
					is_verified: boolean;
					fraud_score: number;
					created_at: string;
					updated_at: string;
				};
				Insert: Omit<Database['public']['Tables']['referrals']['Row'], 'id' | 'created_at' | 'updated_at'>;
				Update: Partial<Database['public']['Tables']['referrals']['Insert']>;
			};
			campaigns: {
				Row: {
					id: string;
					whop_company_id: string;
					name: string;
					description: string | null;
					start_date: string;
					end_date: string;
					status: string;
					rules: any;
					prizes: any;
					total_referrals: number;
					created_at: string;
					updated_at: string;
				};
				Insert: Omit<Database['public']['Tables']['campaigns']['Row'], 'id' | 'created_at' | 'updated_at'>;
				Update: Partial<Database['public']['Tables']['campaigns']['Insert']>;
			};
			rewards: {
				Row: {
					id: string;
					whop_company_id: string;
					name: string;
					description: string | null;
					threshold: number;
					reward_type: string;
					reward_data: any;
					auto_apply: boolean;
					is_active: boolean;
					created_at: string;
					updated_at: string;
				};
				Insert: Omit<Database['public']['Tables']['rewards']['Row'], 'id' | 'created_at' | 'updated_at'>;
				Update: Partial<Database['public']['Tables']['rewards']['Insert']>;
			};
			reward_redemptions: {
				Row: {
					id: string;
					user_id: string;
					reward_id: string;
					status: string;
					granted_at: string | null;
					claimed_at: string | null;
					error_message: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: Omit<Database['public']['Tables']['reward_redemptions']['Row'], 'id' | 'created_at' | 'updated_at'>;
				Update: Partial<Database['public']['Tables']['reward_redemptions']['Insert']>;
			};
			fraud_checks: {
				Row: {
					id: string;
					referral_id: string;
					check_type: string;
					flagged: boolean;
					details: any;
					created_at: string;
				};
				Insert: Omit<Database['public']['Tables']['fraud_checks']['Row'], 'id' | 'created_at'>;
				Update: Partial<Database['public']['Tables']['fraud_checks']['Insert']>;
			};
			referral_clicks: {
				Row: {
					id: string;
					referral_code_id: string;
					ip_address: string | null;
					user_agent: string | null;
					device_fingerprint: string | null;
					referrer_url: string | null;
					converted: boolean;
					created_at: string;
				};
				Insert: Omit<Database['public']['Tables']['referral_clicks']['Row'], 'id' | 'created_at'>;
				Update: Partial<Database['public']['Tables']['referral_clicks']['Insert']>;
			};
		};
	};
};

// Helper function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
	return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '');
}

// Helper function for error handling
export function handleSupabaseError(error: any): { success: false; error: { code: string; message: string } } {
	console.error('Supabase error:', error);
	return {
		success: false,
		error: {
			code: error.code || 'SUPABASE_ERROR',
			message: error.message || 'An error occurred with the database',
		},
	};
}

