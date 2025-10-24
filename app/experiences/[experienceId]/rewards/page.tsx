"use client";

import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
	Award, 
	Gift,
	Tag,
	Zap,
	Check,
	Lock,
	TrendingUp,
	Sparkles
} from 'lucide-react';
import type { Reward, RewardEligibility, ReferralStats } from '@/lib/types';

export default function UserRewardsPage({ params }: { params: Promise<{ experienceId: string }> }) {
	const { experienceId } = use(params);
	const [rewards, setRewards] = useState<Reward[]>([]);
	const [eligibility, setEligibility] = useState<RewardEligibility | null>(null);
	const [stats, setStats] = useState<ReferralStats | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [claimingRewardId, setClaimingRewardId] = useState<string | null>(null);

	// Mock user ID and company ID (replace with real auth)
	const userId = 'user_mock_123';
	const companyId = experienceId;

	const fetchData = async () => {
		setIsLoading(true);
		try {
			// Fetch all rewards
			const rewardsRes = await fetch(`/api/rewards?companyId=${companyId}`);
			const rewardsData = await rewardsRes.json();
			if (rewardsData.success) {
				setRewards(rewardsData.data);
			}

			// Fetch user stats
			const statsRes = await fetch(`/api/referrals/stats?userId=${userId}&experienceId=${experienceId}`);
			const statsData = await statsRes.json();
			if (statsData.success) {
				setStats(statsData.data);
			}

			// Check eligibility
			const eligibilityRes = await fetch('/api/rewards/check', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ user_id: userId, company_id: companyId }),
			});
			const eligibilityData = await eligibilityRes.json();
			if (eligibilityData.success) {
				setEligibility(eligibilityData.data);
			}
		} catch (error) {
			console.error('Failed to fetch rewards data:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClaimReward = async (rewardId: string) => {
		setClaimingRewardId(rewardId);
		try {
			const response = await fetch('/api/rewards/grant', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					user_id: userId,
					reward_id: rewardId,
					company_id: companyId,
				}),
			});

			const data = await response.json();
			if (data.success) {
				// Refresh eligibility
				fetchData();
			}
		} catch (error) {
			console.error('Failed to claim reward:', error);
		} finally {
			setClaimingRewardId(null);
		}
	};

	useEffect(() => {
		fetchData();
	}, [experienceId]);

	const getRewardIcon = (type: string) => {
		switch (type) {
			case 'product_unlock': return <Gift className="w-6 h-6" />;
			case 'discount': return <Tag className="w-6 h-6" />;
			case 'custom': return <Zap className="w-6 h-6" />;
			default: return <Award className="w-6 h-6" />;
		}
	};

	const isRewardEligible = (rewardId: string) => {
		return eligibility?.eligible_rewards.some(r => r.reward_id === rewardId);
	};

	const getRewardStatus = (reward: Reward) => {
		const conversions = stats?.total_conversions || 0;
		const isEligible = isRewardEligible(reward.id);
		
		if (isEligible) {
			return { status: 'eligible', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
		} else if (conversions >= reward.threshold) {
			return { status: 'claimed', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
		} else {
			return { status: 'locked', color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' };
		}
	};

	const calculateProgress = (threshold: number) => {
		const conversions = stats?.total_conversions || 0;
		return Math.min((conversions / threshold) * 100, 100);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 via-gold to-purple-50">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Header */}
				<div className="text-center mb-12">
					<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent shadow-xl mb-6">
						<Award className="w-10 h-10 text-white" />
					</div>
					<h1 className="text-[42px] text-gray-900 mb-4 font-hegarty">
						Your Rewards
					</h1>
					<p className="text-lg text-gray-600 font-arimo max-w-2xl mx-auto">
						Earn amazing rewards by referring friends! The more you refer, the more you earn.
					</p>
				</div>

				{/* Progress Card */}
				<Card className="border-2 border-primary/20 shadow-xl mb-8 overflow-hidden">
					<div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 p-6 border-b">
						<div className="flex items-center justify-between mb-4">
							<div>
								<h3 className="text-2xl text-gray-900 font-hegarty mb-1">
									{stats?.total_conversions || 0} Successful Referrals
								</h3>
								<p className="text-sm text-gray-600 font-arimo">
									Keep going to unlock more rewards!
								</p>
							</div>
							<div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg">
								<TrendingUp className="w-8 h-8" />
							</div>
						</div>

						{/* Next Milestone */}
						{eligibility?.next_milestone && (
							<div className="bg-white rounded-lg p-4 shadow-md">
								<div className="flex items-center justify-between mb-2">
									<span className="text-sm font-semibold text-gray-700 font-arimo">
										Next Milestone: {eligibility.next_milestone.name}
									</span>
									<Badge variant="secondary">
										{eligibility.next_milestone.referrals_needed} more needed
									</Badge>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
									<div 
										className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 rounded-full"
										style={{ 
											width: `${calculateProgress(
												(stats?.total_conversions || 0) + eligibility.next_milestone.referrals_needed
											)}%` 
										}}
									/>
								</div>
							</div>
						)}
					</div>
				</Card>

				{/* Rewards List */}
				{isLoading ? (
					<div className="text-center py-12">
						<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
						<p className="text-gray-600 font-arimo">Loading rewards...</p>
					</div>
				) : rewards.length === 0 ? (
					<Card className="border-2 border-gray-200 shadow-lg">
						<CardContent className="p-12 text-center">
							<Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
							<p className="text-gray-600 font-arimo text-lg">No rewards available yet</p>
							<p className="text-gray-500 font-arimo text-sm mt-2">
								Check back soon for exciting rewards!
							</p>
						</CardContent>
					</Card>
				) : (
					<div className="space-y-6">
						{rewards.sort((a, b) => a.threshold - b.threshold).map((reward) => {
							const status = getRewardStatus(reward);
							const isEligible = status.status === 'eligible';
							const isClaimed = status.status === 'claimed';
							const isLocked = status.status === 'locked';
							const progress = calculateProgress(reward.threshold);

							return (
								<Card 
									key={reward.id}
									className={`border-2 ${status.borderColor} ${status.bgColor} hover:shadow-xl transition-all overflow-hidden`}
								>
									<CardContent className="p-6">
										<div className="flex items-start gap-6">
											{/* Icon */}
											<div className={`w-16 h-16 rounded-2xl ${
												isLocked ? 'bg-red-7' : 'bg-gradient from-primary to-secondary'
											} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
												{isLocked ? <Lock className="w-8 h-8" /> : getRewardIcon(reward.reward_type)}
											</div>

											{/* Content */}
											<div className="flex-1 min-w-0">
												<div className="flex items-start justify-between mb-3">
													<div>
														<div className="flex items-center gap-3 mb-2">
															<h3 className="text-2xl text-gray-900 font-hegarty">
																{reward.name}
															</h3>
															{isEligible && (
																<Badge variant="accent" className="animate-pulse">
																	<Sparkles className="w-3 h-3 mr-1" />
																	Ready to Claim!
																</Badge>
															)}
															{isClaimed && (
																<Badge variant="secondary">
																	<Check className="w-3 h-3 mr-1" />
																	Claimed
																</Badge>
															)}
														</div>
														<p className="text-gray-600 font-arimo mb-3">
															{reward.description || 'An awesome reward awaits you!'}
														</p>
													</div>
												</div>

												{/* Progress Bar */}
												<div className="mb-4">
													<div className="flex items-center justify-between mb-2">
														<span className="text-sm font-semibold text-gray-700 font-arimo">
															{reward.threshold} referrals required
														</span>
														<span className="text-sm font-bold text-gray-900 font-arimo">
															{Math.round(progress)}%
														</span>
													</div>
													<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
														<div 
															className={`h-full transition-all duration-500 rounded-full ${
																isLocked 
																	? 'bg-gray-400' 
																	: 'bg-gradient-to-r from-primary to-accent'
															}`}
															style={{ width: `${progress}%` }}
														/>
													</div>
												</div>

												{/* Action Button */}
												{isEligible && !isClaimed && (
													<Button 
														onClick={() => handleClaimReward(reward.id)}
														disabled={claimingRewardId === reward.id}
														size="lg"
														className="w-full md:w-auto"
													>
														{claimingRewardId === reward.id ? (
															<>
																<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
																Claiming...
															</>
														) : (
															<>
																<Gift className="w-5 h-5 mr-2" />
																Claim Reward
															</>
														)}
													</Button>
												)}

												{isLocked && (
													<p className="text-sm text-gray-500 font-arimo">
														{reward.threshold - (stats?.total_conversions || 0)} more referrals to unlock
													</p>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				)}

				{/* CTA Card */}
				<Card className="mt-8 border-2 border-primary shadow-xl bg-gradient-to-r from-primary/5 to-accent/5">
					<CardContent className="p-8 text-center">
						<h3 className="text-2xl text-gray-900 mb-3 font-hegarty">
							Want to earn more rewards?
						</h3>
						<p className="text-gray-600 font-arimo mb-6">
							Share your referral link with friends and start unlocking awesome rewards!
						</p>
						<Button size="lg" asChild>
							<a href={`/experiences/${experienceId}/referrals`} className="flex items-center justify-center">
								<Award className="w-5 h-5 mr-2" />
								Go to My Referral Page
							</a>
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

