"use client";

import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
	Link as LinkIcon, 
	Copy, 
	Check, 
	Share2, 
	Twitter, 
	MessageCircle,
	TrendingUp,
	Users,
	Award,
	ExternalLink,
	RefreshCw
} from 'lucide-react';
import type { ReferralCodeWithUrl, ReferralStats } from '@/lib/types';
import { createOrGetReferralCode, getLocalReferralStats } from '@/lib/referral-code-generator';

export default function ReferralsPage({ params }: { params: Promise<{ experienceId: string }> }) {
	const { experienceId } = use(params);
	const [referralCode, setReferralCode] = useState<ReferralCodeWithUrl | null>(null);
	const [stats, setStats] = useState<ReferralStats | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [copied, setCopied] = useState(false);
	const [codeCopied, setCodeCopied] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				
				// Try to fetch from API first
				const codeResponse = await fetch('/api/referrals/generate', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'x-whop-user-id': 'demo-user-123', // TODO: Get from Whop auth
						'x-whop-company-id': experienceId,
					},
				});
				
				if (codeResponse.ok) {
					const codeData = await codeResponse.json();
					if (codeData.success) {
						setReferralCode(codeData.data);
					} else {
						// Use local code generator if API fails
						const localCode = createOrGetReferralCode('demo-user-123', experienceId);
						setReferralCode(localCode);
					}
				} else {
					// Use local code generator if API fails
					const localCode = createOrGetReferralCode('demo-user-123', experienceId);
					setReferralCode(localCode);
				}
				
				// Try to fetch stats from API
				const statsResponse = await fetch('/api/referrals/stats', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'x-whop-user-id': 'demo-user-123', // TODO: Get from Whop auth
					},
				});
				
				if (statsResponse.ok) {
					const statsData = await statsResponse.json();
					if (statsData.success) {
						setStats(statsData.data);
					} else {
						// Use local stats if API fails
						const localStats = getLocalReferralStats('demo-user-123');
						setStats(localStats);
					}
				} else {
					// Use local stats if API fails
					const localStats = getLocalReferralStats('demo-user-123');
					setStats(localStats);
				}
			} catch (error) {
				console.error('Failed to fetch data:', error);
				// Use local code generator as fallback
				const localCode = createOrGetReferralCode('demo-user-123', experienceId);
				const localStats = getLocalReferralStats('demo-user-123');
				setReferralCode(localCode);
				setStats(localStats);
			} finally {
				setIsLoading(false);
			}
		};
		
		fetchData();
	}, [experienceId]);

	const copyToClipboard = (text: string, setStateFn: (val: boolean) => void) => {
		navigator.clipboard.writeText(text);
		setStateFn(true);
		setTimeout(() => setStateFn(false), 2000);
	};

	const generateNewCode = () => {
		const newCode = createOrGetReferralCode('demo-user-123', experienceId);
		setReferralCode(newCode);
	};

	const shareOnTwitter = () => {
		if (!referralCode) return;
		const text = encodeURIComponent('Check out this amazing community! Join using my referral link:');
		const url = encodeURIComponent(referralCode.url);
		window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 flex items-center justify-center">
				<div className="text-center">
					<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-gray-600 font-arimo">Loading your referral dashboard...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-9 to-purple-50">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Header */}
				<div className="mb-12">
					<h1 className="text-[42px] font-normal text-gray-900 mb-4 font-hegarty">
						Your Referral Dashboard
					</h1>
					<p className="text-lg text-gray-600 font-arimo">
						Share your unique link and earn rewards for every person who joins!
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
					<Card className="border-2 border-primary/20 hover:border-primary shadow-lg hover:shadow-xl transition-all">
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-2">
								<Users className="w-8 h-8 text-gray-900" />
								<Badge variant="default" className="shadow-md">Total</Badge>
							</div>
							<div className="text-3xl font-normal text-gray-900 mb-1 font-hegarty">
								{stats?.total_referrals || 0}
							</div>
							<div className="text-sm text-gray-600 font-arimo">Referrals Sent</div>
						</CardContent>
					</Card>

					<Card className="border-2 border-secondary/20 hover:border-secondary shadow-lg hover:shadow-xl transition-all">
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-2">
								<TrendingUp className="w-8 h-8 text-secondary" />
								<Badge variant="secondary" className="shadow-md">Converted</Badge>
							</div>
							<div className="text-3xl font-normal text-gray-900 mb-1 font-hegarty">
								{stats?.total_conversions || 0}
							</div>
							<div className="text-sm text-gray-600 font-arimo">Successful Referrals</div>
						</CardContent>
					</Card>

					<Card className="border-2 border-accent/20 hover:border-accent shadow-lg hover:shadow-xl transition-all">
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-2">
								<Award className="w-8 h-8 text-accent" />
								<Badge variant="accent" className="shadow-md">Rate</Badge>
							</div>
							<div className="text-3xl font-normal text-gray-900 mb-1 font-hegarty">
								{stats?.conversion_rate.toFixed(1)}%
							</div>
							<div className="text-sm text-gray-600 font-arimo">Conversion Rate</div>
						</CardContent>
					</Card>

					<Card className="border-2 border-info/20 hover:border-info shadow-lg hover:shadow-xl transition-all">
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-2">
								<Award className="w-8 h-8 text-info" />
								<Badge variant="info" className="shadow-md">Rewards</Badge>
							</div>
							<div className="text-3xl font-normal text-gray-900 mb-1 font-hegarty">
								{stats?.rewards_earned || 0}
							</div>
							<div className="text-sm text-gray-600 font-arimo">Rewards Earned</div>
						</CardContent>
					</Card>
				</div>

				{/* Referral Link Card */}
				<Card className="border-0 shadow-2xl mb-12 overflow-hidden bg-gradient-to-br from-black to-orange-50">
					<CardHeader className="pb-4">
						<div className="flex items-center gap-3 mb-2">
							<div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-bright rounded-xl flex items-center justify-center shadow-lg">
								<LinkIcon className="w-6 h-6 text-white" />
							</div>
							<div>
								<CardTitle className="text-2xl font-normal font-hegarty">Your Referral Link</CardTitle>
								<CardDescription className="font-arimo">Share this link to earn rewards</CardDescription>
							</div>
						</div>
						<Separator className="bg-gradient-to-r from-primary via-accent to-transparent" />
					</CardHeader>
					
					<CardContent className="space-y-6">
						{/* Referral Code */}
						<div>
							<label className="text-sm font-semibold text-gray-700 mb-2 block font-arimo">
								Referral Code
							</label>
							<div className="flex gap-2">
								<div className="flex-1 bg-white border-2 border-gray-200 rounded-lg px-4 py-3 font-mono text-lg font-normal text-gray-10">
									{referralCode?.code}
								</div>
								<Button
									onClick={() => copyToClipboard(referralCode?.code || '', setCodeCopied)}
									variant="default"
									size="lg"
									className="px-6"
								>
									{codeCopied ? (
										<>
											<Check className="w-5 h-5 mr-2" />
											Copied!
										</>
									) : (
										<>
											<Copy className="w-5 h-5 mr-2" />
											Copy
										</>
									)}
								</Button>
								<Button
									onClick={generateNewCode}
									variant="outline"
									size="lg"
									className="px-6"
								>
									<RefreshCw className="w-5 h-5 mr-2" />
									New Code
								</Button>
							</div>
						</div>

						{/* Referral URL */}
						<div>
							<label className="text-sm font-semibold text-gray-700 mb-2 block font-arimo">
								Referral URL
							</label>
							<div className="flex gap-2">
								<div className="flex-1 bg-white border-2 border-gray-200 text-gray-10 rounded-lg px-4 py-3 text-sm truncate font-arimo">
									{referralCode?.url}
								</div>
								<Button
									onClick={() => copyToClipboard(referralCode?.url || '', setCopied)}
									size="lg"
									className="px-6"
									variant="secondary"
								>
									{copied ? (
										<>
											<Check className="w-5 h-5 mr-2" />
											Copied!
										</>
									) : (
										<>
											<Copy className="w-5 h-5 mr-2" />
											Copy Link
										</>
									)}
								</Button>
							</div>
						</div>

						<Separator />

						{/* Share Buttons */}
						<div>
							<label className="text-sm font-semibold text-gray-700 mb-3 block font-arimo">
								<Share2 className="w-4 h-4 inline mr-2" />
								Share on Social Media
							</label>
							<div className="flex flex-wrap gap-3">
								<Button
									onClick={shareOnTwitter}
									variant="secondary"
									size="lg"
									className="flex-1 min-w-[200px]"
								>
									<Twitter className="w-5 h-5 mr-2" />
									Share on Twitter
								</Button>
								<Button
									variant="secondary"
									size="lg"
									className="flex-1 min-w-[200px]"
								>
									<MessageCircle className="w-5 h-5 mr-2" />
									Share on Discord
								</Button>
								<Button
									variant="default"
									size="lg"
									className="flex-1 min-w-[200px]"
								>
									<ExternalLink className="w-5 h-5 mr-2" />
									More Options
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* How It Works */}
				<Card className="border-2 border-dashed border-primary/30 bg-black">
					<CardHeader>
						<CardTitle className="text-2xl font-normal font-hegarty flex items-center">
							<Award className="w-6 h-6 mr-2 text-gray-10" />
							How Referrals Work
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ol className="space-y-4 font-arimo">
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-normal mr-3">
									1
								</span>
								<div>
									<div className="font-semibold text-gray-10 mb-1">Share Your Link</div>
									<div className="text-gray-600">Copy your unique referral link and share it with friends</div>
								</div>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-normal mr-3">
									2
								</span>
								<div>
									<div className="font-semibold text-gray-10 mb-1">Friends Join</div>
									<div className="text-gray-600">When they sign up using your link, it's tracked automatically</div>
								</div>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-normal mr-3">
									3
								</span>
								<div>
									<div className="font-semibold text-gray-10 mb-1">Earn Rewards</div>
									<div className="text-gray-600">Hit milestones to unlock exclusive perks and bonuses</div>
								</div>
							</li>
						</ol>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

