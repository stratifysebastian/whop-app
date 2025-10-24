"use client";

import { use } from 'react';
import { Leaderboard } from '@/components/leaderboard/leaderboard';

export default function EmbedLeaderboardPage({ params }: { params: Promise<{ companyId: string }> }) {
	const { companyId } = use(params);
	
	return (
		<div className="p-4 bg-white">
			<Leaderboard 
				companyId={companyId} 
				limit={25} 
				showTimeFilter={false} 
				embedded={true}
			/>
		</div>
	);
}

