"use client";

import { use, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReferrerTable } from '@/components/referrals/referrer-table';
import { 
	TrendingUp, 
	Users, 
	Award, 
	DollarSign,
	Calendar,
	Download,
	RefreshCw
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { DashboardOverview, ReferrerListItem, PaginationInfo, TimeFrame } from '@/lib/types';

export default function ReferralsDashboardPage({ params }: { params: Promise<{ companyId: string }> }) {
	const { companyId } = use(params);
	const [overview, setOverview] = useState<DashboardOverview | null>(null);
	const [referrers, setReferrers] = useState<ReferrerListItem[]>([]);
	const [pagination, setPagination] = useState<PaginationInfo>({
		page: 1,
		limit: 25,
		total: 0,
		total_pages: 0,
	});
	const [timeframe, setTimeframe] = useState<TimeFrame>('30d');
	const [isLoading, setIsLoading] = useState(true);
	const [sortField, setSortField] = useState('referrals');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const [searchQuery, setSearchQuery] = useState('');

	// Fetch dashboard overview
	const fetchOverview = async () => {
		try {
			const response = await fetch(`/api/dashboard/overview?companyId=${companyId}&timeframe=${timeframe}`);
			const data = await response.json();
			if (data.success) {
				setOverview(data.data);
			}
		} catch (error) {
			console.error('Failed to fetch overview:', error);
		}
	};

	// Fetch referrers list
	const fetchReferrers = async () => {
		setIsLoading(true);
		try {
			const params = new URLSearchParams({
				companyId,
				page: pagination.page.toString(),
				limit: pagination.limit.toString(),
				sort: sortField,
				order: sortOrder,
				search: searchQuery,
			});

			const response = await fetch(`/api/dashboard/referrers?${params}`);
			const data = await response.json();
			if (data.success) {
				setReferrers(data.data.data);
				setPagination(data.data.pagination);
			}
		} catch (error) {
			console.error('Failed to fetch referrers:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchChartData = async () => {
		try {
			const response = await fetch(`/api/dashboard/chart-data?companyId=${companyId}&timeframe=${timeframe}`);
			const data = await response.json();
			
			if (data.success) {
				setChartData(data.data);
			}
		} catch (error) {
			console.error('Failed to fetch chart data:', error);
		}
	};

	// Handle export
	const handleExport = async () => {
		try {
			const response = await fetch(`/api/dashboard/export?companyId=${companyId}&format=csv`);
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `referly-referrers-${Date.now()}.csv`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Failed to export:', error);
		}
	};

	useEffect(() => {
		fetchOverview();
		fetchChartData();
	}, [companyId, timeframe]);

	useEffect(() => {
		fetchReferrers();
	}, [companyId, pagination.page, sortField, sortOrder, searchQuery]);

	// Chart data state
	const [chartData, setChartData] = useState([
		{ date: 'Mon', referrals: 0, conversions: 0 },
		{ date: 'Tue', referrals: 0, conversions: 0 },
		{ date: 'Wed', referrals: 0, conversions: 0 },
		{ date: 'Thu', referrals: 0, conversions: 0 },
		{ date: 'Fri', referrals: 0, conversions: 0 },
		{ date: 'Sat', referrals: 0, conversions: 0 },
		{ date: 'Sun', referrals: 0, conversions: 0 },
	]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange to-purple-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-[42px] text-gray-900 mb-2 font-hegarty">
							Referral Dashboard
						</h1>
						<p className="text-lg text-gray-600 font-arimo">
							Track your community's referral performance
						</p>
					</div>

					<div className="flex items-center gap-3">
						{/* Timeframe Selector */}
						<div className="flex items-center gap-2 bg-black rounded-lg border-2 border-gray-200 p-1 shadow-sm">
							{(['7d', '30d', 'all'] as TimeFrame[]).map((tf) => (
								<Button
									key={tf}
									onClick={() => setTimeframe(tf)}
									variant={timeframe === tf ? 'default' : 'ghost'}
									size="sm"
									className="font-arimo text-gray-900 hover:bg-primary/50 hover:text-white"
								>
									<Calendar className="w-4 h-4 mr-2" />
									{tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : 'All Time'}
								</Button>
							))}
						</div>

						{/* Refresh Button */}
						<Button
							onClick={() => {
								fetchOverview();
								fetchReferrers();
								fetchChartData();
							}}
							variant="outline"
							className="text-gray-900 hover:bg-secondary hover:text-white"
							size="default"
						>
							<RefreshCw className="w-4 h-4 mr-2" />
							Refresh
						</Button>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
					<Card className="border-2 border-primary/20 hover:border-primary shadow-lg hover:shadow-xl transition-all">
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-2">
								<Users className="w-8 h-8 text-gray-900" />
								<Badge variant="default" className="shadow-md">Total</Badge>
							</div>
							<div className="text-3xl font-bold text-gray-900 mb-1 font-hegarty">
								{overview?.total_referrals || 0}
							</div>
							<div className="text-sm text-gray-600 font-arimo">Total Referrals</div>
						</CardContent>
					</Card>

					<Card className="border-2 border-secondary/20 hover:border-secondary shadow-lg hover:shadow-xl transition-all">
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-2">
								<TrendingUp className="w-8 h-8 text-secondary" />
								<Badge variant="secondary" className="shadow-md">Converted</Badge>
							</div>
							<div className="text-3xl font-bold text-gray-900 mb-1 font-hegarty">
								{overview?.total_conversions || 0}
							</div>
							<div className="text-sm text-gray-600 font-arimo">Conversions</div>
						</CardContent>
					</Card>

					<Card className="border-2 border-accent/20 hover:border-accent shadow-lg hover:shadow-xl transition-all">
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-2">
								<Award className="w-8 h-8 text-accent" />
								<Badge variant="accent" className="shadow-md">Rate</Badge>
							</div>
							<div className="text-3xl font-bold text-gray-900 mb-1 font-hegarty">
								{overview?.conversion_rate?.toFixed(1) || '0.0'}%
							</div>
							<div className="text-sm text-gray-600 font-arimo">Conversion Rate</div>
						</CardContent>
					</Card>

					<Card className="border-2 border-info/20 hover:border-info shadow-lg hover:shadow-xl transition-all">
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-2">
								<DollarSign className="w-8 h-8 text-info" />
								<Badge variant="info" className="shadow-md">Revenue</Badge>
							</div>
							<div className="text-3xl font-bold text-gray-900 mb-1 font-hegarty">
								${overview?.revenue_attributed.toFixed(0) || 0}
							</div>
							<div className="text-sm text-gray-600 font-arimo">Revenue Attributed</div>
						</CardContent>
					</Card>
				</div>

				{/* Charts Section */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
					{/* Line Chart - Referrals Over Time */}
					<Card className="border-0 shadow-xl">
						<CardHeader>
							<CardTitle className="text-xl font-normal font-hegarty">Referrals Over Time</CardTitle>
							<CardDescription className="font-arimo">Daily referral and conversion trends</CardDescription>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer width="100%" height={300}>
								<LineChart data={chartData}>
									<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
									<XAxis dataKey="date" stroke="#666" style={{ fontSize: '12px', fontFamily: 'var(--font-arimo)' }} />
									<YAxis stroke="#666" style={{ fontSize: '12px', fontFamily: 'var(--font-arimo)' }} />
									<Tooltip 
										contentStyle={{ 
											backgroundColor: '#fff', 
											border: '2px solid #FF6B35',
											borderRadius: '8px',
											fontFamily: 'var(--font-arimo)'
										}} 
									/>
									<Legend wrapperStyle={{ fontFamily: 'var(--font-arimo)' }} />
									<Line type="monotone" dataKey="referrals" stroke="#FF6B35" strokeWidth={3} name="Referrals" />
									<Line type="monotone" dataKey="conversions" stroke="#7B2CBF" strokeWidth={3} name="Conversions" />
								</LineChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>

					{/* Bar Chart - Top Referrers */}
					<Card className="border-0 shadow-xl">
						<CardHeader>
							<CardTitle className="text-xl font-normal font-hegarty">Top Performers</CardTitle>
							<CardDescription className="font-arimo">Top 5 referrers this period</CardDescription>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={overview?.top_referrers || []}>
									<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
									<XAxis dataKey="username" stroke="#666" style={{ fontSize: '12px', fontFamily: 'var(--font-arimo)' }} />
									<YAxis stroke="#666" style={{ fontSize: '12px', fontFamily: 'var(--font-arimo)' }} />
									<Tooltip 
										contentStyle={{ 
											backgroundColor: '#fff', 
											border: '2px solid #FF6B35',
											borderRadius: '8px',
											fontFamily: 'var(--font-arimo)'
										}} 
									/>
									<Bar dataKey="referrals" fill="#FF6B35" name="Referrals" radius={[8, 8, 0, 0]} />
									<Bar dataKey="conversions" fill="#7B2CBF" name="Conversions" radius={[8, 8, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				</div>

				{/* Referrers Table */}
				<ReferrerTable
					referrers={referrers}
					pagination={pagination}
					onPageChange={(page) => setPagination({ ...pagination, page })}
					onSort={(field, order) => {
						setSortField(field);
						setSortOrder(order);
					}}
					onSearch={(query) => setSearchQuery(query)}
					onExport={handleExport}
					isLoading={isLoading}
				/>
			</div>
		</div>
	);
}

