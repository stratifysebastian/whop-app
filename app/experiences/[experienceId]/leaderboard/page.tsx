"use client";

import { use } from 'react';
import { Leaderboard } from '@/components/leaderboard/leaderboard';

export default function LeaderboardPage({ params }: { params: Promise<{ experienceId: string }> }) {
	const { experienceId } = use(params);
	
	return <Leaderboard companyId={experienceId} limit={50} showTimeFilter={true} />;
}

