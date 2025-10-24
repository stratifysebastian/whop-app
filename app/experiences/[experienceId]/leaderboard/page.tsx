"use client";

import { use, useState } from 'react';
import { RealtimeLeaderboard } from '@/components/leaderboard/realtime-leaderboard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Users, Award, Clock } from 'lucide-react';

export default function LeaderboardPage({ params }: { params: Promise<{ experienceId: string }> }) {
	const { experienceId } = use(params);
	const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'all'>('30d');
	
	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-2xl mb-6">
						<Trophy className="w-8 h-8 text-white" />
					</div>
					<h1 className="text-4xl md:text-5xl text-gray-10 mb-4 font-hegarty">
						Leaderboard
					</h1>
					<p className="text-lg text-gray-600 font-arimo max-w-2xl mx-auto">
						See how you stack up against other community members. 
						The more referrals you make, the higher you climb!
					</p>
				</div>

				{/* Time Filter */}
				<div className="flex justify-center mb-8">
					<div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-md">
						{[
							{ key: '7d', label: '7 Days' },
							{ key: '30d', label: '30 Days' },
							{ key: 'all', label: 'All Time' },
						].map(({ key, label }) => (
							<Button
								key={key}
								onClick={() => setTimeframe(key as '7d' | '30d' | 'all')}
								variant={timeframe === key ? 'default' : 'ghost'}
								size="sm"
								className="px-4"
							>
								{timeframe === key && <Clock className="w-4 h-4 mr-2" />}
								{label}
							</Button>
						))}
					</div>
				</div>

				{/* Leaderboard */}
				<RealtimeLeaderboard
					companyId={experienceId}
					timeframe={timeframe}
					limit={25}
					autoRefresh={true}
					refreshInterval={30000}
					showRankChanges={true}
				/>

				{/* Info Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
					<Card className="border-2 border-primary/20 hover:border-primary transition-colors">
						<CardHeader className="pb-3">
							<CardTitle className="text-lg font-hegarty flex items-center gap-2">
								<Users className="w-5 h-5 text-primary" />
								How Rankings Work
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-gray-600 font-arimo">
								Rankings are based on successful conversions. Each conversion earns you 10 points.
							</p>
						</CardContent>
					</Card>

					<Card className="border-2 border-secondary/20 hover:border-secondary transition-colors">
						<CardHeader className="pb-3">
							<CardTitle className="text-lg font-hegarty flex items-center gap-2">
								<Award className="w-5 h-5 text-secondary" />
								Top 3 Rewards
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-gray-600 font-arimo">
								Top performers get special recognition and exclusive rewards from the community.
							</p>
						</CardContent>
					</Card>

					<Card className="border-2 border-accent/20 hover:border-accent transition-colors">
						<CardHeader className="pb-3">
							<CardTitle className="text-lg font-hegarty flex items-center gap-2">
								<Trophy className="w-5 h-5 text-accent" />
								Real-time Updates
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-gray-600 font-arimo">
								Leaderboard updates automatically every 30 seconds to show the latest rankings.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

