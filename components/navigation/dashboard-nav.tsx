"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
	Users, 
	Award, 
	Trophy,
	Shield, 
	ChevronRight, 
	ArrowBigLeftDash,
	ArrowUpLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardNavProps {
	companyId: string;
}

export function DashboardNav({ companyId }: DashboardNavProps) {
	const pathname = usePathname();

	const navItems = [
		{
			href: `/dashboard/${companyId}/referrals`,
			label: 'Referrals',
			icon: Users,
		},
		{
			href: `/dashboard/${companyId}/rewards`,
			label: 'Rewards',
			icon: Award,
		},
		{
			href: `/dashboard/${companyId}/campaigns`,
			label: 'Campaigns',
			icon: Trophy,
		},
		{
			href: `/dashboard/${companyId}/security`,
			label: 'Security',
			icon: Shield,
		},
	];

	return (
		<nav className="bg-white border-b-2 border-gray-100 shadow-sm sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link href={`/dashboard/${companyId}/referrals`} className="flex items-center gap-3 group">
						<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
							<ArrowUpLeft className="w-6 h-6 text-white" />
						</div>
						<div>
							<div className="text-[28px] text-primary font-hegarty">
								Referly
							</div>
						</div>
					</Link>

					{/* Navigation */}
					<div className="flex items-center gap-2">
						{navItems.map((item) => {
							const Icon = item.icon;
							const isActive = pathname === item.href || 
								(item.href !== `/dashboard/${companyId}` && pathname?.startsWith(item.href));

							return (
								<Link
									key={item.href}
									href={item.href}
									className={cn(
										"flex items-center gap-2 px-4 py-2 rounded-lg font-semibold font-arimo transition-all",
										isActive
											? "bg-primary text-white shadow-md"
											: "text-gray-10 hover:text-gray-10 hover:bg-primary/5"
									)}
								>
									<Icon className="w-5 h-5" />
									<span className="hidden md:inline">{item.label}</span>
								</Link>
							);
						})}
					</div>

					{/* User Experience Link */}
					<Link
						href={`/experiences/${companyId}/referrals`}
						className="flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg font-semibold font-arimo hover:bg-primary hover:text-white transition-all"
					>
						<span className="hidden md:inline">View as User</span>
						<ChevronRight className="w-5 h-5" />
					</Link>
				</div>
			</div>
		</nav>
	);
}

