"use client";

import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
	Award, 
	Plus, 
	Edit2, 
	Trash2, 
	Gift,
	Tag,
	Zap,
	TrendingUp,
	Check,
	X
} from 'lucide-react';
import type { Reward } from '@/lib/types';

export default function RewardsManagementPage({ params }: { params: Promise<{ companyId: string }> }) {
	const { companyId } = use(params);
	const [rewards, setRewards] = useState<Reward[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		threshold: 5,
		reward_type: 'discount' as 'product_unlock' | 'discount' | 'custom',
		discount_percentage: 10,
		product_id: '',
		custom_instructions: '',
		auto_apply: true,
	});

	const fetchRewards = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`/api/rewards?companyId=${companyId}`);
			const data = await response.json();
			if (data.success) {
				setRewards(data.data);
			}
		} catch (error) {
			console.error('Failed to fetch rewards:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCreateReward = async (e: React.FormEvent) => {
		e.preventDefault();
		
		// Prepare reward data based on type
		let rewardData: any = {};
		if (formData.reward_type === 'discount') {
			rewardData = { discount_percentage: formData.discount_percentage };
		} else if (formData.reward_type === 'product_unlock') {
			rewardData = { product_id: formData.product_id };
		} else if (formData.reward_type === 'custom') {
			rewardData = { instructions: formData.custom_instructions };
		}

		try {
			const response = await fetch('/api/rewards', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					companyId,
					name: formData.name,
					description: formData.description,
					threshold: formData.threshold,
					reward_type: formData.reward_type,
					reward_data: rewardData,
					auto_apply: formData.auto_apply,
				}),
			});

			const data = await response.json();
			if (data.success) {
				setShowCreateForm(false);
				setFormData({
					name: '',
					description: '',
					threshold: 5,
					reward_type: 'discount',
					discount_percentage: 10,
					product_id: '',
					custom_instructions: '',
					auto_apply: true,
				});
				fetchRewards();
			}
		} catch (error) {
			console.error('Failed to create reward:', error);
		}
	};

	useEffect(() => {
		fetchRewards();
	}, [companyId]);

	const getRewardIcon = (type: string) => {
		switch (type) {
			case 'product_unlock': return <Gift className="w-5 h-5" />;
			case 'discount': return <Tag className="w-5 h-5" />;
			case 'custom': return <Zap className="w-5 h-5" />;
			default: return <Award className="w-5 h-5" />;
		}
	};

	const getRewardTypeBadge = (type: string) => {
		switch (type) {
			case 'product_unlock': return <Badge variant="info">Product Unlock</Badge>;
			case 'discount': return <Badge variant="accent">Discount</Badge>;
			case 'custom': return <Badge variant="secondary">Custom</Badge>;
			default: return <Badge>{type}</Badge>;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 via-secondary to-purple-50">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-[42px] text-gray-900 mb-2 font-hegarty">
							Reward Milestones
						</h1>
						<p className="text-lg text-gray-600 font-arimo">
							Configure automatic rewards for your top referrers
						</p>
					</div>

					<Button onClick={() => setShowCreateForm(true)} size="lg">
						<Plus className="w-5 h-5 mr-2" />
						Create Reward
					</Button>
				</div>

				{/* Stats Overview */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<Card className="border-2 border-primary/20 shadow-lg">
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-2">
								<Award className="w-8 h-8 text-gray-900" />
							</div>
							<div className="text-3xl font-bold text-gray-900 mb-1 font-hegarty">
								{rewards.filter(r => r.is_active).length}
							</div>
							<div className="text-sm text-gray-900 font-arimo">Active Rewards</div>
						</CardContent>
					</Card>

					<Card className="border-2 border-secondary/20 shadow-lg">
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-2">
								<TrendingUp className="w-8 h-8 text-secondary" />
							</div>
							<div className="text-3xl font-bold text-gray-900 mb-1 font-hegarty">
								{rewards.filter(r => r.auto_apply).length}
							</div>
							<div className="text-sm text-gray-600 font-arimo">Auto-Applied</div>
						</CardContent>
					</Card>

					<Card className="border-2 border-accent/20 shadow-lg">
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-2">
								<Gift className="w-8 h-8 text-accent" />
							</div>
							<div className="text-3xl font-bold text-gray-900 mb-1 font-hegarty">
								{rewards.length > 0 ? Math.min(...rewards.map(r => r.threshold)) : 0}
							</div>
							<div className="text-sm text-gray-600 font-arimo">Lowest Threshold</div>
						</CardContent>
					</Card>
				</div>

				{/* Create Reward Form */}
				{showCreateForm && (
					<Card className="mb-8 border-2 border-primary shadow-xl">
						<CardHeader className="border-b bg-gradient-to-r from-primary/5 to-accent/5">
							<CardTitle className="text-2xl font-hegarty">Create New Reward</CardTitle>
							<CardDescription className="font-arimo">Set up a milestone reward for your referrers</CardDescription>
						</CardHeader>
						<CardContent className="p-6">
							<form onSubmit={handleCreateReward} className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Name */}
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2 font-arimo">
											Reward Name *
										</label>
										<input
											type="text"
											required
											value={formData.name}
											onChange={(e) => setFormData({ ...formData, name: e.target.value })}
											className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary font-arimo"
											placeholder="e.g., 5 Referral Bonus"
										/>
									</div>

									{/* Threshold */}
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2 font-arimo">
											Referral Threshold *
										</label>
										<input
											type="number"
											required
											min="1"
											value={formData.threshold}
											onChange={(e) => setFormData({ ...formData, threshold: parseInt(e.target.value) })}
											className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary font-arimo"
											placeholder="5"
										/>
									</div>
								</div>

								{/* Description */}
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2 font-arimo">
										Description
									</label>
									<textarea
										value={formData.description}
										onChange={(e) => setFormData({ ...formData, description: e.target.value })}
										rows={3}
										className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary font-arimo"
										placeholder="Describe what users will receive..."
									/>
								</div>

								{/* Reward Type */}
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2 font-arimo">
										Reward Type *
									</label>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<button
											type="button"
											onClick={() => setFormData({ ...formData, reward_type: 'discount' })}
											className={`p-4 border-2 rounded-lg transition-all ${
												formData.reward_type === 'discount' 
													? 'border-primary bg-primary/5' 
													: 'border-gray-200 hover:border-primary/50'
											}`}
										>
											<Tag className="w-6 h-6 text-accent mb-2 mx-auto" />
											<div className="font-semibold font-arimo">Discount Code</div>
										</button>

										<button
											type="button"
											onClick={() => setFormData({ ...formData, reward_type: 'product_unlock' })}
											className={`p-4 border-2 rounded-lg transition-all ${
												formData.reward_type === 'product_unlock' 
													? 'border-primary bg-primary/5' 
													: 'border-gray-200 hover:border-primary/50'
											}`}
										>
											<Gift className="w-6 h-6 text-info mb-2 mx-auto" />
											<div className="font-semibold font-arimo">Product Unlock</div>
										</button>

										<button
											type="button"
											onClick={() => setFormData({ ...formData, reward_type: 'custom' })}
											className={`p-4 border-2 rounded-lg transition-all ${
												formData.reward_type === 'custom' 
													? 'border-primary bg-primary/5' 
													: 'border-gray-200 hover:border-primary/50'
											}`}
										>
											<Zap className="w-6 h-6 text-secondary mb-2 mx-auto" />
											<div className="font-semibold font-arimo">Custom Reward</div>
										</button>
									</div>
								</div>

								{/* Type-specific fields */}
								{formData.reward_type === 'discount' && (
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2 font-arimo">
											Discount Percentage
										</label>
										<input
											type="number"
											min="1"
											max="100"
											value={formData.discount_percentage}
											onChange={(e) => setFormData({ ...formData, discount_percentage: parseInt(e.target.value) })}
											className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary font-arimo"
										/>
									</div>
								)}

								{formData.reward_type === 'product_unlock' && (
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2 font-arimo">
											Whop Product ID
										</label>
										<input
											type="text"
											value={formData.product_id}
											onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
											className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary font-arimo"
											placeholder="prod_xxxxx"
										/>
									</div>
								)}

								{formData.reward_type === 'custom' && (
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2 font-arimo">
											Fulfillment Instructions
										</label>
										<textarea
											value={formData.custom_instructions}
											onChange={(e) => setFormData({ ...formData, custom_instructions: e.target.value })}
											rows={3}
											className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary font-arimo"
											placeholder="Instructions for manually fulfilling this reward..."
										/>
									</div>
								)}

								{/* Auto-apply toggle */}
								<div className="flex items-center gap-3">
									<input
										type="checkbox"
										id="auto_apply"
										checked={formData.auto_apply}
										onChange={(e) => setFormData({ ...formData, auto_apply: e.target.checked })}
										className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-primary"
									/>
									<label htmlFor="auto_apply" className="text-sm font-semibold text-gray-700 font-arimo">
										Automatically grant this reward when threshold is reached
									</label>
								</div>

								{/* Action buttons */}
								<div className="flex items-center gap-3 pt-4">
									<Button type="submit" size="lg">
										<Check className="w-5 h-5 mr-2" />
										Create Reward
									</Button>
									<Button 
										type="button" 
										variant="outline" 
										onClick={() => setShowCreateForm(false)}
										size="lg"
									>
										<X className="w-5 h-5 mr-2" />
										Cancel
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				)}

				{/* Rewards List */}
				<Card className="border-0 shadow-xl">
					<CardHeader>
						<CardTitle className="text-2xl font-hegarty">Active Milestones</CardTitle>
						<CardDescription className="font-arimo">
							Rewards automatically granted when users reach thresholds
						</CardDescription>
					</CardHeader>
					<CardContent className="p-6">
						{isLoading ? (
							<div className="text-center py-12">
								<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
								<p className="text-gray-600 font-arimo">Loading rewards...</p>
							</div>
						) : rewards.length === 0 ? (
							<div className="text-center py-12">
								<Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
								<p className="text-gray-600 font-arimo text-lg mb-2">No rewards configured yet</p>
								<p className="text-gray-500 font-arimo text-sm mb-6">
									Create your first milestone reward to incentivize referrals
								</p>
								<Button onClick={() => setShowCreateForm(true)}>
									<Plus className="w-5 h-5 mr-2" />
									Create First Reward
								</Button>
							</div>
						) : (
							<div className="space-y-4">
								{rewards.sort((a, b) => a.threshold - b.threshold).map((reward) => (
									<div 
										key={reward.id}
										className="flex items-center justify-between p-6 border-2 border-gray-100 rounded-lg hover:border-primary/30 hover:shadow-md transition-all"
									>
										<div className="flex items-center gap-4 flex-1">
											<div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg">
												{getRewardIcon(reward.reward_type)}
											</div>
											
											<div className="flex-1">
												<div className="flex items-center gap-3 mb-1">
													<h3 className="text-lg text-gray-900 font-hegarty">
														{reward.name}
													</h3>
													{getRewardTypeBadge(reward.reward_type)}
													{reward.auto_apply && (
														<Badge variant="secondary">
															<Zap className="w-3 h-3 mr-1" />
															Auto
														</Badge>
													)}
												</div>
												<p className="text-sm text-gray-600 font-arimo mb-2">
													{reward.description || 'No description provided'}
												</p>
												<div className="flex items-center gap-2">
													<Badge variant="default">
														{reward.threshold} referrals required
													</Badge>
												</div>
											</div>
										</div>

										<div className="flex items-center gap-2">
											<Button variant="outline" size="sm">
												<Edit2 className="w-4 h-4" />
											</Button>
											<Button variant="destructive" size="sm">
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

