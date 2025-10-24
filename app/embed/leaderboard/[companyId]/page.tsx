// Embeddable Leaderboard Widget

import { Suspense } from 'react';
import { RealtimeLeaderboard } from '@/components/leaderboard/realtime-leaderboard';

interface EmbedLeaderboardPageProps {
	params: Promise<{ companyId: string }>;
	searchParams: Promise<{ 
		campaignId?: string;
		timeframe?: '7d' | '30d' | 'all';
		limit?: string;
		theme?: 'light' | 'dark';
		refresh?: 'true' | 'false';
	}>;
}

export default async function EmbedLeaderboardPage({ 
	params, 
	searchParams 
}: EmbedLeaderboardPageProps) {
	const { companyId } = await params;
	const {
		campaignId,
		timeframe = '30d',
		limit = '10',
		theme = 'light',
		refresh = 'true'
	} = await searchParams;

	const limitNum = parseInt(limit) || 10;
	const autoRefresh = refresh === 'true';

	return (
		<div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
			<div className="p-4">
				<Suspense fallback={
					<div className="animate-pulse">
						<div className="h-8 bg-gray-200 rounded mb-4"></div>
						<div className="space-y-3">
							{[...Array(5)].map((_, i) => (
								<div key={i} className="flex items-center gap-4 p-3 bg-gray-100 rounded">
									<div className="w-8 h-8 bg-gray-200 rounded-full"></div>
									<div className="flex-1">
										<div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
										<div className="h-3 bg-gray-200 rounded w-1/4"></div>
									</div>
									<div className="w-12 h-6 bg-gray-200 rounded"></div>
								</div>
							))}
						</div>
					</div>
				}>
					<RealtimeLeaderboard
						companyId={companyId}
						campaignId={campaignId}
						timeframe={timeframe as '7d' | '30d' | 'all'}
						limit={limitNum}
						autoRefresh={autoRefresh}
						refreshInterval={30000}
						showRankChanges={true}
					/>
				</Suspense>
			</div>
		</div>
	);
}