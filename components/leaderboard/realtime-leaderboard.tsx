// Real-time Leaderboard Component with Animations

"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, Crown, Users, TrendingUp, RefreshCw } from 'lucide-react';
import type { LeaderboardEntry } from '@/lib/types';

interface RealtimeLeaderboardProps {
	companyId: string;
	campaignId?: string;
	timeframe?: '7d' | '30d' | 'all';
	limit?: number;
	autoRefresh?: boolean;
	refreshInterval?: number;
	showRankChanges?: boolean;
}

export function RealtimeLeaderboard({
	companyId,
	campaignId,
	timeframe = '30d',
	limit = 10,
	autoRefresh = true,
	refreshInterval = 30000, // 30 seconds
	showRankChanges = true,
}: RealtimeLeaderboardProps) {
	const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
	const [rankChanges, setRankChanges] = useState<Record<string, number>>({});

	const fetchLeaderboard = async () => {
		try {
			const url = campaignId 
				? `/api/leaderboard/campaign/${campaignId}?companyId=${companyId}&timeframe=${timeframe}&limit=${limit}`
				: `/api/leaderboard?companyId=${companyId}&timeframe=${timeframe}&limit=${limit}`;
			
			const response = await fetch(url);
			const data = await response.json();
			
			if (data.success) {
				// Calculate rank changes
				if (showRankChanges && leaderboard.length > 0) {
					const changes: Record<string, number> = {};
					data.data.forEach((entry: LeaderboardEntry) => {
						const oldEntry = leaderboard.find(l => l.user_id === entry.user_id);
						if (oldEntry && oldEntry.rank !== entry.rank) {
							changes[entry.user_id] = oldEntry.rank - entry.rank;
						}
					});
					setRankChanges(changes);
				}
				
				setLeaderboard(data.data);
				setLastUpdated(new Date());
			}
		} catch (error) {
			console.error('Failed to fetch leaderboard:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchLeaderboard();
	}, [companyId, campaignId, timeframe, limit]);

	useEffect(() => {
		if (!autoRefresh) return;

		const interval = setInterval(fetchLeaderboard, refreshInterval);
		return () => clearInterval(interval);
	}, [autoRefresh, refreshInterval]);

	const getRankIcon = (rank: number) => {
		switch (rank) {
			case 1:
				return <Crown className="w-6 h-6 text-yellow-500" />;
			case 2:
				return <Medal className="w-6 h-6 text-gray-400" />;
			case 3:
				return <Award className="w-6 h-6 text-amber-600" />;
			default:
				return <Trophy className="w-5 h-5 text-gray-500" />;
		}
	};

	const getRankBadgeColor = (rank: number) => {
		switch (rank) {
			case 1:
				return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
			case 2:
				return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
			case 3:
				return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
			default:
				return 'bg-gray-100 text-gray-700';
		}
	};

	const formatRankChange = (userId: string) => {
		const change = rankChanges[userId];
		if (!change) return null;
		
		if (change > 0) {
			return (
				<Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
					<TrendingUp className="w-3 h-3 mr-1" />
					+{change}
				</Badge>
			);
		} else if (change < 0) {
			return (
				<Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
					<TrendingUp className="w-3 h-3 mr-1 rotate-180" />
					{change}
				</Badge>
			);
		}
		return null;
	};

	if (isLoading) {
		return (
			<Card className="border-0 shadow-xl">
				<CardHeader>
					<CardTitle className="text-xl font-normal font-hegarty flex items-center gap-2">
						<Trophy className="w-6 h-6 text-primary" />
						Leaderboard
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{[...Array(5)].map((_, i) => (
							<div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg animate-pulse">
								<div className="w-8 h-8 bg-gray-200 rounded-full"></div>
								<div className="flex-1">
									<div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
									<div className="h-3 bg-gray-200 rounded w-1/4"></div>
								</div>
								<div className="w-16 h-6 bg-gray-200 rounded"></div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="border-0 shadow-xl">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="text-xl font-normal font-hegarty flex items-center gap-2">
						<Trophy className="w-6 h-6 text-primary" />
						{campaignId ? 'Campaign Leaderboard' : 'Global Leaderboard'}
					</CardTitle>
					<div className="flex items-center gap-2">
						{lastUpdated && (
							<span className="text-xs text-gray-500 font-arimo">
								Updated {lastUpdated.toLocaleTimeString()}
							</span>
						)}
						<Button
							onClick={fetchLeaderboard}
							variant="ghost"
							size="sm"
							className="text-gray-500 hover:text-gray-700"
						>
							<RefreshCw className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{leaderboard.length === 0 ? (
					<div className="text-center py-8">
						<Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
						<p className="text-gray-500 font-arimo">No referrals yet</p>
						<p className="text-sm text-gray-400 font-arimo">Be the first to start referring!</p>
					</div>
				) : (
					<div className="space-y-3">
						{leaderboard.map((entry, index) => (
							<div
								key={entry.user_id}
								className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ${
									index < 3 
										? 'bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/20' 
										: 'bg-gray-50 hover:bg-gray-100'
								}`}
							>
								{/* Rank */}
								<div className="flex items-center gap-2">
									{getRankIcon(entry.rank)}
									<Badge className={`px-3 py-1 font-bold ${getRankBadgeColor(entry.rank)}`}>
										#{entry.rank}
									</Badge>
								</div>

								{/* Avatar */}
								<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
									{entry.avatar_url ? (
										<img 
											src={entry.avatar_url} 
											alt={entry.username}
											className="w-10 h-10 rounded-full object-cover"
										/>
									) : (
										entry.username.charAt(0).toUpperCase()
									)}
								</div>

								{/* User Info */}
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<h3 className="font-semibold text-gray-900 font-hegarty truncate">
											{entry.username}
										</h3>
										{formatRankChange(entry.user_id)}
									</div>
									<div className="flex items-center gap-4 text-sm text-gray-600 font-arimo">
										<span>{entry.referrals} referrals</span>
										<span>{entry.conversions} conversions</span>
										<span className="font-semibold text-primary">{entry.points} pts</span>
									</div>
								</div>

								{/* Stats */}
								<div className="text-right">
									<div className="text-lg font-bold text-gray-900 font-hegarty">
										{entry.conversions}
									</div>
									<div className="text-xs text-gray-500 font-arimo">
										conversions
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
