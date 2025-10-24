"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, TrendingUp, Crown } from 'lucide-react';
import type { LeaderboardEntry, TimeFrame } from '@/lib/types';

interface LeaderboardProps {
	companyId: string;
	limit?: number;
	showTimeFilter?: boolean;
	embedded?: boolean;
}

export function Leaderboard({ 
	companyId, 
	limit = 50,
	showTimeFilter = true,
	embedded = false 
}: LeaderboardProps) {
	const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [timeframe, setTimeframe] = useState<TimeFrame>('30d');

	const fetchLeaderboard = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(
				`/api/leaderboard?companyId=${companyId}&timeframe=${timeframe}&limit=${limit}`
			);
			const data = await response.json();
			if (data.success) {
				setEntries(data.data);
			}
		} catch (error) {
			console.error('Failed to fetch leaderboard:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchLeaderboard();
		// Auto-refresh every 30 seconds
		const interval = setInterval(fetchLeaderboard, 30000);
		return () => clearInterval(interval);
	}, [companyId, timeframe, limit]);

	const getRankIcon = (rank: number) => {
		switch (rank) {
			case 1:
				return <Crown className="w-6 h-6 text-yellow-500" />;
			case 2:
				return <Medal className="w-6 h-6 text-gray-400" />;
			case 3:
				return <Medal className="w-6 h-6 text-orange-600" />;
			default:
				return <span className="text-lg font-bold text-gray-500 font-hegarty">#{rank}</span>;
		}
	};

	const getRankBgColor = (rank: number) => {
		switch (rank) {
			case 1:
				return 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-300';
			case 2:
				return 'bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300';
			case 3:
				return 'bg-gradient-to-r from-orange-100 to-orange-50 border-orange-300';
			default:
				return 'bg-white border-gray-200';
		}
	};

	const containerClass = embedded 
		? "w-full"
		: "min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50";

	return (
		<div className={containerClass}>
			<div className={embedded ? "w-full" : "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"}>
				{!embedded && (
					<>
						{/* Header */}
						<div className="text-center mb-12">
							<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent shadow-xl mb-6">
								<Trophy className="w-10 h-10 text-white" />
							</div>
							<h1 className="text-[42px] text-gray-900 mb-4 font-hegarty">
								Referral Leaderboard
							</h1>
							<p className="text-lg text-gray-600 font-arimo max-w-2xl mx-auto">
								See who's leading the pack! Top referrers earn exclusive rewards.
							</p>
						</div>

						{/* Time Filter */}
						{showTimeFilter && (
							<div className="flex justify-center mb-8">
								<div className="inline-flex items-center gap-2 bg-white rounded-lg border-2 border-gray-200 p-1 shadow-sm">
									{(['7d', '30d', 'all'] as TimeFrame[]).map((tf) => (
										<button
											key={tf}
											onClick={() => setTimeframe(tf)}
											className={`px-4 py-2 rounded-lg font-semibold font-arimo transition-all ${
												timeframe === tf
													? 'bg-primary text-white shadow-md'
													: 'text-gray-600 hover:text-primary'
											}`}
										>
											{tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : 'All Time'}
										</button>
									))}
								</div>
							</div>
						)}
					</>
				)}

				{/* Leaderboard Card */}
				<Card className={embedded ? "border-0 shadow-none" : "border-0 shadow-xl"}>
					{!embedded && (
						<CardHeader className="border-b bg-gradient-to-r from-primary/5 to-accent/5">
							<CardTitle className="text-2xl font-hegarty flex items-center gap-3">
								<Trophy className="w-6 h-6 text-primary" />
								Top {limit} Referrers
							</CardTitle>
						</CardHeader>
					)}
					<CardContent className={embedded ? "p-0" : "p-6"}>
						{isLoading ? (
							<div className="text-center py-12">
								<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
								<p className="text-gray-600 font-arimo">Loading leaderboard...</p>
							</div>
						) : entries.length === 0 ? (
							<div className="text-center py-12">
								<Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
								<p className="text-gray-600 font-arimo text-lg">No referrers yet</p>
								<p className="text-gray-500 font-arimo text-sm mt-2">
									Be the first to start referring!
								</p>
							</div>
						) : (
							<div className="space-y-3">
								{entries.map((entry, index) => (
									<div 
										key={entry.user_id}
										className={`flex items-center gap-4 p-4 border-2 rounded-lg transition-all hover:shadow-md ${getRankBgColor(entry.rank)}`}
									>
										{/* Rank */}
										<div className="flex-shrink-0 w-12 text-center">
											{getRankIcon(entry.rank)}
										</div>

										{/* Avatar */}
										<div className="flex-shrink-0">
											{entry.avatar_url ? (
												<img
													src={entry.avatar_url}
													alt={entry.username}
													className="w-12 h-12 rounded-full border-2 border-white shadow-md"
												/>
											) : (
												<div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold font-hegarty shadow-md text-lg">
													{entry.username.charAt(0).toUpperCase()}
												</div>
											)}
										</div>

										{/* Username */}
										<div className="flex-1 min-w-0">
											<div className="font-bold text-gray-900 font-hegarty text-lg truncate">
												{entry.username}
											</div>
											<div className="text-sm text-gray-600 font-arimo">
												{entry.referrals} referral{entry.referrals !== 1 ? 's' : ''}
											</div>
										</div>

										{/* Stats */}
										<div className="flex items-center gap-4 flex-shrink-0">
											<div className="text-right">
												<div className="flex items-center gap-2">
													<TrendingUp className="w-4 h-4 text-secondary" />
													<span className="text-2xl font-bold text-gray-900 font-hegarty">
														{entry.conversions}
													</span>
												</div>
												<div className="text-xs text-gray-500 font-arimo">
													conversions
												</div>
											</div>

											{entry.rank <= 3 && (
												<Badge 
													variant={
														entry.rank === 1 ? 'default' : 
														entry.rank === 2 ? 'secondary' : 
														'accent'
													}
													className="font-bold shadow-md"
												>
													<Award className="w-3 h-3 mr-1" />
													{entry.rank === 1 ? 'Champion' : entry.rank === 2 ? 'Elite' : 'Rising Star'}
												</Badge>
											)}
										</div>
									</div>
								))}
							</div>
						)}

						{!embedded && entries.length > 0 && (
							<div className="mt-6 text-center text-sm text-gray-500 font-arimo">
								Updated every 30 seconds • Last updated: {new Date().toLocaleTimeString()}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

