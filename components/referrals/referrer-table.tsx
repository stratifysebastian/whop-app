"use client";

import { useState } from 'react';
import type { ReferrerListItem, PaginationInfo } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
	ChevronUp, 
	ChevronDown, 
	ChevronsUpDown,
	Search,
	Download,
	ChevronLeft,
	ChevronRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ReferrerTableProps {
	referrers: ReferrerListItem[];
	pagination: PaginationInfo;
	onPageChange: (page: number) => void;
	onSort: (field: string, order: 'asc' | 'desc') => void;
	onSearch: (query: string) => void;
	onExport: () => void;
	isLoading?: boolean;
}

export function ReferrerTable({
	referrers,
	pagination,
	onPageChange,
	onSort,
	onSearch,
	onExport,
	isLoading = false
}: ReferrerTableProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [sortField, setSortField] = useState('referrals');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

	const handleSort = (field: string) => {
		const newOrder = sortField === field && sortOrder === 'desc' ? 'asc' : 'desc';
		setSortField(field);
		setSortOrder(newOrder);
		onSort(field, newOrder);
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		onSearch(searchQuery);
	};

	const SortIcon = ({ field }: { field: string }) => {
		if (sortField !== field) return <ChevronsUpDown className="w-4 h-4 opacity-30" />;
		return sortOrder === 'desc' 
			? <ChevronDown className="w-4 h-4" /> 
			: <ChevronUp className="w-4 h-4" />;
	};

	return (
		<Card className="border-0 shadow-xl">
			<CardHeader className="pb-4">
				<div className="flex items-center justify-between flex-wrap gap-4">
					<CardTitle className="text-2xl font-hegarty">Top Referrers</CardTitle>
					
					<div className="flex items-center gap-3">
						{/* Search */}
						<form onSubmit={handleSearch} className="relative">
							<input
								type="text"
								placeholder="Search referrers..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-64 px-4 py-2 pl-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary font-arimo"
							/>
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
						</form>

						{/* Export Button */}
						<Button onClick={onExport} variant="outline" size="default">
							<Download className="w-4 h-4 mr-2" />
							Export CSV
						</Button>
					</div>
				</div>
			</CardHeader>

			<CardContent className="p-0">
				{isLoading ? (
					<div className="p-12 text-center">
						<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
						<p className="text-gray-600 font-arimo">Loading referrers...</p>
					</div>
				) : referrers.length === 0 ? (
					<div className="p-12 text-center">
						<p className="text-gray-600 font-arimo text-lg">No referrers found</p>
						<p className="text-gray-500 font-arimo text-sm mt-2">
							Start sharing your referral links to see data here!
						</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50 border-y border-gray-200">
								<tr>
									<th className="text-left px-6 py-4 font-semibold text-gray-700 font-arimo">
										<button
											onClick={() => handleSort('username')}
											className="flex items-center gap-2 hover:text-primary transition-colors"
										>
											Referrer
											<SortIcon field="username" />
										</button>
									</th>
									<th className="text-left px-6 py-4 font-semibold text-gray-700 font-arimo">
										<button
											onClick={() => handleSort('referrals')}
											className="flex items-center gap-2 hover:text-primary transition-colors"
										>
											Referrals
											<SortIcon field="referrals" />
										</button>
									</th>
									<th className="text-left px-6 py-4 font-semibold text-gray-700 font-arimo">
										<button
											onClick={() => handleSort('conversions')}
											className="flex items-center gap-2 hover:text-primary transition-colors"
										>
											Conversions
											<SortIcon field="conversions" />
										</button>
									</th>
									<th className="text-left px-6 py-4 font-semibold text-gray-700 font-arimo">
										<button
											onClick={() => handleSort('conversion_rate')}
											className="flex items-center gap-2 hover:text-primary transition-colors"
										>
											Rate
											<SortIcon field="conversion_rate" />
										</button>
									</th>
									<th className="text-left px-6 py-4 font-semibold text-gray-700 font-arimo">
										<button
											onClick={() => handleSort('revenue_attributed')}
											className="flex items-center gap-2 hover:text-primary transition-colors"
										>
											Revenue
											<SortIcon field="revenue_attributed" />
										</button>
									</th>
									<th className="text-left px-6 py-4 font-semibold text-gray-700 font-arimo">
										<button
											onClick={() => handleSort('rewards_earned')}
											className="flex items-center gap-2 hover:text-primary transition-colors"
										>
											Rewards
											<SortIcon field="rewards_earned" />
										</button>
									</th>
									<th className="text-left px-6 py-4 font-semibold text-gray-700 font-arimo">
										Joined
									</th>
								</tr>
							</thead>
							<tbody>
								{referrers.map((referrer, index) => (
									<tr 
										key={referrer.user_id} 
										className="border-b border-gray-100 hover:bg-orange-50/50 transition-colors"
									>
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold font-hegarty shadow-md">
													{referrer.username.charAt(0).toUpperCase()}
												</div>
												<div>
													<div className="font-semibold text-gray-900 font-arimo">
														{referrer.username}
													</div>
													{referrer.email && (
														<div className="text-sm text-gray-500 font-arimo">
															{referrer.email}
														</div>
													)}
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<Badge variant="default" className="font-semibold shadow-sm">
												{referrer.referrals}
											</Badge>
										</td>
										<td className="px-6 py-4">
											<Badge variant="secondary" className="font-semibold shadow-sm">
												{referrer.conversions}
											</Badge>
										</td>
										<td className="px-6 py-4">
											<span className="font-semibold text-gray-900 font-arimo">
												{referrer.conversion_rate}%
											</span>
										</td>
										<td className="px-6 py-4">
											<span className="font-semibold text-info font-arimo">
												${referrer.revenue_attributed.toFixed(2)}
											</span>
										</td>
										<td className="px-6 py-4">
											<Badge variant="accent" className="font-semibold shadow-sm">
												{referrer.rewards_earned}
											</Badge>
										</td>
										<td className="px-6 py-4">
											<span className="text-sm text-gray-600 font-arimo">
												{formatDistanceToNow(new Date(referrer.joined_at), { addSuffix: true })}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{/* Pagination */}
				{!isLoading && referrers.length > 0 && (
					<div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
						<div className="text-sm text-gray-600 font-arimo">
							Showing <span className="font-semibold">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
							<span className="font-semibold">
								{Math.min(pagination.page * pagination.limit, pagination.total)}
							</span> of{' '}
							<span className="font-semibold">{pagination.total}</span> referrers
						</div>

						<div className="flex items-center gap-2">
							<Button
								onClick={() => onPageChange(pagination.page - 1)}
								disabled={pagination.page === 1}
								variant="outline"
								size="sm"
							>
								<ChevronLeft className="w-4 h-4 mr-1" />
								Previous
							</Button>
							
							<div className="flex items-center gap-1">
								{Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
									const pageNum = i + 1;
									return (
										<Button
											key={pageNum}
											onClick={() => onPageChange(pageNum)}
											variant={pagination.page === pageNum ? 'default' : 'outline'}
											size="sm"
											className="w-10"
										>
											{pageNum}
										</Button>
									);
								})}
								{pagination.total_pages > 5 && (
									<span className="px-2 text-gray-500">...</span>
								)}
							</div>

							<Button
								onClick={() => onPageChange(pagination.page + 1)}
								disabled={pagination.page === pagination.total_pages}
								variant="outline"
								size="sm"
							>
								Next
								<ChevronRight className="w-4 h-4 ml-1" />
							</Button>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}


