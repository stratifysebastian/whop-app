"use client";

import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
	Shield, 
	AlertTriangle, 
	Check, 
	X,
	Eye,
	RefreshCw,
	Activity
} from 'lucide-react';

interface FlaggedReferral {
	id: string;
	referrer_username: string;
	referred_username: string;
	check_type: string;
	flagged_at: string;
	details: any;
	status: 'pending' | 'approved' | 'rejected';
}

export default function SecurityDashboardPage({ params }: { params: Promise<{ companyId: string }> }) {
	const { companyId } = use(params);
	const [flaggedReferrals, setFlaggedReferrals] = useState<FlaggedReferral[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedReferral, setSelectedReferral] = useState<FlaggedReferral | null>(null);

	const fetchFlaggedReferrals = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`/api/fraud/flagged?companyId=${companyId}`);
			const data = await response.json();
			if (data.success) {
				setFlaggedReferrals(data.data);
			}
		} catch (error) {
			console.error('Failed to fetch flagged referrals:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchFlaggedReferrals();
	}, [companyId]);

	const getCheckTypeBadge = (type: string) => {
		switch (type) {
			case 'ip_duplicate':
				return <Badge variant="accent">IP Duplicate</Badge>;
			case 'email_duplicate':
				return <Badge variant="destructive">Self-Referral</Badge>;
			case 'device_duplicate':
				return <Badge variant="secondary">Device Duplicate</Badge>;
			case 'velocity_limit':
				return <Badge variant="info">Velocity Exceeded</Badge>;
			default:
				return <Badge>{type}</Badge>;
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'approved':
				return <Badge variant="secondary"><Check className="w-3 h-3 mr-1" />Approved</Badge>;
			case 'rejected':
				return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Rejected</Badge>;
			default:
				return <Badge variant="default"><AlertTriangle className="w-3 h-3 mr-1" />Pending Review</Badge>;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 via-red to-purple-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-[42px] text-gray-900 mb-2 font-hegarty">
							Security Dashboard
						</h1>
						<p className="text-lg text-gray-600 font-arimo">
							Review and manage flagged referrals
						</p>
					</div>

					<Button onClick={fetchFlaggedReferrals} variant="outline">
						<RefreshCw className="w-5 h-5 mr-2" />
						Refresh
					</Button>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<Card className="border-2 border-primary/20 shadow-lg">
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-2">
								<AlertTriangle className="w-8 h-8 text-gray-900" />
								<Badge variant="default">Total</Badge>
							</div>
							<div className="text-3xl font-bold text-gray-900 mb-1 font-hegarty">
								{flaggedReferrals.length}
							</div>
							<div className="text-sm text-gray-600 font-arimo">Flagged Referrals</div>
						</CardContent>
					</Card>

					<Card className="border-2 border-secondary/20 shadow-lg">
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-2">
								<Activity className="w-8 h-8 text-secondary" />
								<Badge variant="secondary">Pending</Badge>
							</div>
							<div className="text-3xl font-bold text-gray-900 mb-1 font-hegarty">
								{flaggedReferrals.filter(r => r.status === 'pending').length}
							</div>
							<div className="text-sm text-gray-600 font-arimo">Awaiting Review</div>
						</CardContent>
					</Card>

					<Card className="border-2 border-accent/20 shadow-lg">
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-2">
								<Shield className="w-8 h-8 text-accent" />
								<Badge variant="accent">Protected</Badge>
							</div>
							<div className="text-3xl font-bold text-gray-900 mb-1 font-hegarty">
								{flaggedReferrals.filter(r => r.status === 'rejected').length}
							</div>
							<div className="text-sm text-gray-600 font-arimo">Blocked</div>
						</CardContent>
					</Card>
				</div>

				{/* Flagged Referrals List */}
				<Card className="border-0 shadow-xl">
					<CardHeader className="border-b bg-gradient-to-r from-primary/5 to-accent/5">
						<CardTitle className="text-2xl font-hegarty font-normal flex items-center gap-3">
							<AlertTriangle className="w-6 h-6 text-gray-10" />
							Flagged Referrals
						</CardTitle>
						<CardDescription className="font-arimo">
							Review suspicious referrals and take action
						</CardDescription>
					</CardHeader>
					<CardContent className="p-6">
						{isLoading ? (
							<div className="text-center py-12">
								<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
								<p className="text-gray-600 font-arimo">Loading flagged referrals...</p>
							</div>
						) : flaggedReferrals.length === 0 ? (
							<div className="text-center py-12">
								<Shield className="w-16 h-16 text-green-500 mx-auto mb-4" />
								<p className="text-gray-900 font-arimo text-lg font-semibold mb-2">All Clear!</p>
								<p className="text-gray-10 font-arimo text-sm">
									No suspicious activity detected. Your referral program is running smoothly.
								</p>
							</div>
						) : (
							<div className="space-y-4">
								{flaggedReferrals.map((referral) => (
									<div 
										key={referral.id}
										className="flex items-center justify-between p-6 border-2 border-gray-100 rounded-lg hover:border-primary/30 hover:shadow-md transition-all"
									>
										<div className="flex items-center gap-4 flex-1">
											<div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg">
												<AlertTriangle className="w-6 h-6" />
											</div>
											
											<div className="flex-1">
												<div className="flex items-center gap-3 mb-2">
													<h3 className="text-lg font-bold text-gray-10 font-hegarty">
														{referral.referrer_username} → {referral.referred_username}
													</h3>
													{getCheckTypeBadge(referral.check_type)}
													{getStatusBadge(referral.status)}
												</div>
												<p className="text-sm text-gray-600 font-arimo mb-1">
													{referral.details?.description || 'No details available'}
												</p>
												<p className="text-xs text-gray-500 font-arimo">
													Flagged {new Date(referral.flagged_at).toLocaleString()}
												</p>
											</div>
										</div>

										<div className="flex items-center gap-2">
											{referral.status === 'pending' && (
												<>
													<Button 
														variant="secondary" 
														size="sm"
														onClick={() => setSelectedReferral(referral)}
													>
														<Eye className="w-4 h-4 mr-2" />
														Review
													</Button>
													<Button variant="accent" size="sm">
														<Check className="w-4 h-4" />
													</Button>
													<Button variant="destructive" size="sm">
														<X className="w-4 h-4" />
													</Button>
												</>
											)}
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Info Card */}
				<Card className="mt-8 border-2 border-info/20 shadow-lg bg-gradient-to-r from-info/5 to-secondary/5">
					<CardContent className="p-6">
						<div className="flex items-start gap-4">
							<Shield className="w-8 h-8 text-info flex-shrink-0 mt-1" />
							<div>
								<h3 className="text-xl font-bold text-gray-900 font-normal mb-2 font-hegarty">
									Fraud Detection Active
								</h3>
								<p className="text-gray-600 font-arimo mb-4">
									Our system automatically monitors for suspicious activity including:
								</p>
								<ul className="space-y-2 text-gray-600 font-arimo">
									<li className="flex items-center gap-2">
										<Check className="w-4 h-4 text-info" />
										IP address duplicate detection
									</li>
									<li className="flex items-center gap-2">
										<Check className="w-4 h-4 text-info" />
										Self-referral prevention
									</li>
									<li className="flex items-center gap-2">
										<Check className="w-4 h-4 text-info" />
										Velocity limit monitoring
									</li>
									<li className="flex items-center gap-2">
										<Check className="w-4 h-4 text-info" />
										Device fingerprint tracking
									</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

