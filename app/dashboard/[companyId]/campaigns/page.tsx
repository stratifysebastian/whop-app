// Campaign Management Dashboard

"use client";

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CardSkeleton } from '@/components/ui/skeleton';
import { EmptyState, NoCampaignsEmptyState } from '@/components/ui/empty-state';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { 
	Plus, 
	Calendar, 
	Trophy, 
	Users, 
	Target, 
	Settings,
	Play,
	Pause,
	Archive,
	Edit,
	Trash2,
	Copy,
	ExternalLink
} from 'lucide-react';
import type { Campaign } from '@/lib/types';

interface CampaignFormData {
	name: string;
	description: string;
	start_date: string;
	end_date: string;
	point_multiplier: number;
	prize_pool: string;
	is_active: boolean;
}

export default function CampaignsPage({ params }: { params: Promise<{ companyId: string }> }) {
	const { companyId } = use(params);
	const [campaigns, setCampaigns] = useState<Campaign[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
	const [formData, setFormData] = useState<CampaignFormData>({
		name: '',
		description: '',
		start_date: '',
		end_date: '',
		point_multiplier: 1,
		prize_pool: '',
		is_active: true,
	});

	useEffect(() => {
		fetchCampaigns();
	}, [companyId]);

	const fetchCampaigns = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(`/api/campaigns?companyId=${companyId}`);
			const data = await response.json();
			
			if (data.success) {
				setCampaigns(data.data);
			} else {
				// Handle database configuration errors
				if (data.error?.code === 'DATABASE_NOT_CONFIGURED') {
					console.error('Database not configured:', data.error.message);
					// Show empty state
					setCampaigns([]);
				} else {
					console.error('Failed to fetch campaigns:', data.error);
					setCampaigns([]);
				}
			}
		} catch (error) {
			console.error('Failed to fetch campaigns:', error);
			setCampaigns([]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			// Convert datetime-local format to ISO string for API
			const formatDateForAPI = (dateString: string) => {
				if (!dateString) return '';
				// Convert YYYY-MM-DDTHH:MM to ISO string
				return new Date(dateString).toISOString();
			};

			const campaignData = {
				companyId,
				name: formData.name,
				description: formData.description,
				start_date: formatDateForAPI(formData.start_date),
				end_date: formatDateForAPI(formData.end_date),
				point_multiplier: formData.point_multiplier,
				prize_pool: formData.prize_pool,
			};

			let response;
			if (editingCampaign) {
				// Update existing campaign
				response = await fetch(`/api/campaigns/${editingCampaign.id}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(campaignData),
				});
			} else {
				// Create new campaign
				response = await fetch('/api/campaigns', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(campaignData),
				});
			}

			const data = await response.json();
			
			if (data.success) {
				setShowCreateForm(false);
				setEditingCampaign(null);
				resetForm();
				fetchCampaigns(); // Refresh the campaigns list
			} else {
				console.error(`Failed to ${editingCampaign ? 'update' : 'create'} campaign:`, data.error);
				// You could add a toast notification here
			}
		} catch (error) {
			console.error('Failed to save campaign:', error);
		}
	};

	const resetForm = () => {
		setFormData({
			name: '',
			description: '',
			start_date: '',
			end_date: '',
			point_multiplier: 1,
			prize_pool: '',
			is_active: true,
		});
	};

	const handleEditCampaign = (campaign: Campaign) => {
		setEditingCampaign(campaign);
		
		// Convert dates to datetime-local format (YYYY-MM-DDTHH:MM)
		const formatDateForInput = (dateString: string) => {
			const date = new Date(dateString);
			// Get the timezone offset and adjust
			const offset = date.getTimezoneOffset();
			const adjustedDate = new Date(date.getTime() - (offset * 60000));
			return adjustedDate.toISOString().slice(0, 16);
		};
		
		setFormData({
			name: campaign.name,
			description: campaign.description || '',
			start_date: formatDateForInput(campaign.start_date),
			end_date: formatDateForInput(campaign.end_date),
			point_multiplier: campaign.point_multiplier,
			prize_pool: campaign.prize_pool || '',
			is_active: campaign.is_active,
		});
		setShowCreateForm(true);
	};

	const handleDeleteCampaign = async (campaignId: string) => {
		if (!confirm('Are you sure you want to delete this campaign?')) {
			return;
		}

		try {
			const response = await fetch(`/api/campaigns/${campaignId}`, {
				method: 'DELETE',
			});

			const data = await response.json();
			
			if (data.success) {
				fetchCampaigns(); // Refresh the campaigns list
			} else {
				console.error('Failed to delete campaign:', data.error);
			}
		} catch (error) {
			console.error('Failed to delete campaign:', error);
		}
	};

	const handleToggleCampaignStatus = async (campaign: Campaign) => {
		try {
			const response = await fetch(`/api/campaigns/${campaign.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...campaign,
					is_active: !campaign.is_active,
				}),
			});

			const data = await response.json();
			
			if (data.success) {
				fetchCampaigns(); // Refresh the campaigns list
			} else {
				console.error('Failed to update campaign:', data.error);
			}
		} catch (error) {
			console.error('Failed to update campaign:', error);
		}
	};

	const handleCopyCampaign = async (campaign: Campaign) => {
		try {
			const newCampaignData = {
				companyId,
				name: `${campaign.name} (Copy)`,
				description: campaign.description,
				start_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
				end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T23:59:59Z', // 30 days from now
				point_multiplier: campaign.point_multiplier,
				prize_pool: campaign.prize_pool,
			};

			const response = await fetch('/api/campaigns', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newCampaignData),
			});

			const data = await response.json();
			
			if (data.success) {
				fetchCampaigns(); // Refresh the campaigns list
				// You could add a toast notification here
				console.log('Campaign copied successfully');
			} else {
				console.error('Failed to copy campaign:', data.error);
			}
		} catch (error) {
			console.error('Failed to copy campaign:', error);
		}
	};

	const handleViewLeaderboard = (campaign: Campaign) => {
		// Navigate to campaign-specific leaderboard
		window.open(`/embed/leaderboard/${companyId}?campaignId=${campaign.id}`, '_blank');
	};

	const handleCampaignSettings = (campaign: Campaign) => {
		// For now, just edit the campaign
		handleEditCampaign(campaign);
	};

	const getCampaignStatus = (campaign: Campaign) => {
		const now = new Date();
		const start = new Date(campaign.start_date);
		const end = new Date(campaign.end_date);

		if (now < start) return { status: 'upcoming', color: 'bg-blue-100 text-blue-700' };
		if (now > end) return { status: 'ended', color: 'bg-gray-100 text-gray-700' };
		if (campaign.is_active) return { status: 'active', color: 'bg-green-100 text-green-700' };
		return { status: 'paused', color: 'bg-yellow-100 text-yellow-700' };
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="mb-8">
						<div className="flex items-center justify-between mb-6">
							<div>
								<div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
								<div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
							</div>
							<div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
						</div>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{Array.from({ length: 6 }).map((_, i) => (
							<CardSkeleton key={i} />
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<ErrorBoundary>
			<div className="min-h-screen bg-gradient-to-br from-orange-50 via-gold to-purple-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-[42px] text-gray-900 mb-2 font-hegarty">
							Campaigns
						</h1>
						<p className="text-lg text-gray-600 font-arimo">
							Create and manage referral campaigns to boost engagement
						</p>
					</div>
					<Button
						onClick={() => setShowCreateForm(true)}
						className="bg-primary hover:bg-primary-dark text-white shadow-lg"
					>
						<Plus className="w-5 h-5 mr-2" />
						Create Campaign
					</Button>
				</div>

				{/* Create/Edit Form */}
				{(showCreateForm || editingCampaign) && (
					<Card className="mb-8 border-2 border-primary/20">
						<CardHeader>
							<CardTitle className="text-xl font-hegarty font-normal">
								{editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
							</CardTitle>
							<CardDescription>
								Set up a new referral campaign with custom rewards and timeframes
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<Label htmlFor="name" className="text-sm font-semibold text-gray-700 font-arimo">
											Campaign Name
										</Label>
										<Input
											id="name"
											value={formData.name}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
											placeholder="e.g., Summer Referral Blitz"
											className="mt-1"
											required
										/>
									</div>
									<div>
										<Label htmlFor="point_multiplier" className="text-sm font-semibold text-gray-700 font-arimo">
											Point Multiplier
										</Label>
										<Input
											id="point_multiplier"
											type="number"
											step="0.1"
											min="1"
											value={formData.point_multiplier}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, point_multiplier: parseFloat(e.target.value) })}
											className="mt-1"
											required
										/>
									</div>
								</div>

								<div>
									<Label htmlFor="description" className="text-sm font-semibold text-gray-700 font-arimo">
										Description
									</Label>
									<Textarea
										id="description"
										value={formData.description}
										onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
										placeholder="Describe the campaign goals and rewards..."
										className="mt-1"
										rows={3}
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<Label htmlFor="start_date" className="text-sm font-semibold text-gray-700 font-arimo">
											Start Date
										</Label>
										<Input
											id="start_date"
											type="datetime-local"
											value={formData.start_date}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, start_date: e.target.value })}
											className="mt-1"
											required
										/>
									</div>
									<div>
										<Label htmlFor="end_date" className="text-sm font-semibold text-gray-700 font-arimo">
											End Date
										</Label>
										<Input
											id="end_date"
											type="datetime-local"
											value={formData.end_date}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, end_date: e.target.value })}
											className="mt-1"
											required
										/>
									</div>
								</div>

								<div>
									<Label htmlFor="prize_pool" className="text-sm font-semibold text-gray-700 font-arimo">
										Prize Pool / Rewards
									</Label>
									<Input
										id="prize_pool"
										value={formData.prize_pool}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, prize_pool: e.target.value })}
										placeholder="e.g., $500 in rewards, Premium membership for top 3"
										className="mt-1"
									/>
								</div>

								<div className="flex items-center gap-4">
									<Button type="submit" className="bg-primary hover:bg-primary-dark">
										{editingCampaign ? 'Update Campaign' : 'Create Campaign'}
									</Button>
									<Button
										type="button"
										variant="outline"
										onClick={() => {
											setShowCreateForm(false);
											setEditingCampaign(null);
											resetForm();
										}}
									>
										Cancel
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				)}

				{/* Campaigns Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{campaigns.map((campaign) => {
						const status = getCampaignStatus(campaign);
						return (
							<Card key={campaign.id} className="border-0 shadow-xl hover:shadow-2xl transition-all">
								<CardHeader>
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<CardTitle className="text-lg font-hegarty font-normal mb-2">
												{campaign.name}
											</CardTitle>
											<Badge className={status.color}>
												{status.status.charAt(0).toUpperCase() + status.status.slice(1)}
											</Badge>
										</div>
										<div className="flex items-center gap-1">
											<Button 
												variant="ghost" 
												size="sm"
												onClick={() => handleEditCampaign(campaign)}
											>
												<Edit className="w-4 h-4" />
											</Button>
											<Button 
												variant="ghost" 
												size="sm"
												onClick={() => handleCopyCampaign(campaign)}
												title="Copy Campaign"
											>
												<Copy className="w-4 h-4" />
											</Button>
											<Button 
												variant="ghost" 
												size="sm" 
												className="text-red-500 hover:text-red-700"
												onClick={() => handleDeleteCampaign(campaign.id)}
											>
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-gray-600 font-arimo mb-4">
										{campaign.description}
									</p>
									
									<div className="space-y-3">
										<div className="flex items-center gap-2 text-sm">
											<Calendar className="w-4 h-4 text-gray-500" />
											<span className="text-gray-600 font-arimo">
												{formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
											</span>
										</div>
										
										<div className="flex items-center gap-2 text-sm">
											<Target className="w-4 h-4 text-gray-500" />
											<span className="text-gray-600 font-arimo">
												{campaign.point_multiplier}x points
											</span>
										</div>
										
										<div className="flex items-center gap-2 text-sm">
											<Trophy className="w-4 h-4 text-gray-500" />
											<span className="text-gray-600 font-arimo">
												{campaign.prize_pool}
											</span>
										</div>
									</div>

									<Separator className="my-4" />

									<div className="flex items-center justify-between">
										<Button
											variant="outline"
											size="sm"
											className="flex items-center gap-2"
											onClick={() => handleViewLeaderboard(campaign)}
											title="View Campaign Leaderboard"
										>
											<ExternalLink className="w-4 h-4" />
											View Leaderboard
										</Button>
										
										<div className="flex items-center gap-1">
											<Button 
												variant="ghost" 
												size="sm"
												onClick={() => handleToggleCampaignStatus(campaign)}
											>
												{status.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
											</Button>
											<Button 
												variant="ghost" 
												size="sm"
												onClick={() => handleCampaignSettings(campaign)}
												title="Campaign Settings"
											>
												<Settings className="w-4 h-4" />
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>

				{/* Empty State */}
				{campaigns.length === 0 && !showCreateForm && (
					<NoCampaignsEmptyState 
						onCreateClick={() => setShowCreateForm(true)}
					/>
				)}
				</div>
			</div>
		</ErrorBoundary>
	);
}
