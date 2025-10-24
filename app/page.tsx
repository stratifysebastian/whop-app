import Link from 'next/link';
import { Trophy, Users, Award, Shield, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Page() {
	// Demo IDs for navigation
	const demoCompanyId = 'demo-company';
	const demoExperienceId = 'demo-experience';

	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
			{/* Hero Section */}
			<div className="py-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-5xl mx-auto text-center">
					<div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-2xl mb-8">
						<Trophy className="w-12 h-12 text-white" />
					</div>
					<h1 className="text-6xl md:text-8xl font-bold text-gray-10 mb-6 font-hegarty">
						Referly
					</h1>
					<p className="text-2xl md:text-4xl text-gray-700 font-arimo mb-8">
						Reward your audience for referrals!
					</p>
					<p className="text-lg text-gray-600 font-arimo max-w-2xl mx-auto mb-12">
						The complete referral & affiliate management system for Whop creators. 
						Track referrals, reward top performers, and grow your community.
					</p>

					{/* Quick Access Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
						<Card className="border-2 border-primary/20 hover:border-primary hover:shadow-xl transition-all group">
							<CardContent className="p-8">
								<div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
									<Users className="w-8 h-8 text-white" />
								</div>
								<h3 className="text-2xl font-bold text-gray-10 mb-3 font-hegarty">
									For Creators
								</h3>
								<p className="text-gray-600 font-arimo mb-6">
									Manage your referral program, track performance, and reward your top referrers
								</p>
								<Button asChild size="lg" className="w-full">
									<Link href={`/dashboard/${demoCompanyId}/referrals`}>
										Open Dashboard
									</Link>
								</Button>
							</CardContent>
						</Card>

						<Card className="border-2 border-secondary/20 hover:border-secondary hover:shadow-xl transition-all group">
							<CardContent className="p-8">
								<div className="w-16 h-16 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
									<Award className="w-8 h-8 text-white" />
								</div>
								<h3 className="text-2xl font-bold text-gray-10 mb-3 font-hegarty">
									For Users
								</h3>
								<p className="text-gray-600 font-arimo mb-6">
									Get your referral link, track your progress, and earn amazing rewards
								</p>
								<Button asChild size="lg" variant="secondary" className="w-full">
									<Link href={`/experiences/${demoExperienceId}/referrals`}>
										My Referrals
									</Link>
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
				<div className="max-w-6xl mx-auto">
					<h2 className="text-4xl font-bold text-center text-gray-10 mb-12 font-hegarty">
						Everything You Need
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="text-center">
							<div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
								<TrendingUp className="w-8 h-8 text-white" />
							</div>
							<h3 className="text-xl font-bold text-gray-10 mb-2 font-hegarty">
								Real-Time Analytics
							</h3>
							<p className="text-gray-600 font-arimo">
								Track clicks, conversions, and revenue in beautiful dashboards
							</p>
						</div>

						<div className="text-center">
							<div className="w-16 h-16 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mx-auto mb-4">
								<Award className="w-8 h-8 text-white" />
							</div>
							<h3 className="text-xl font-bold text-gray-10 mb-2 font-hegarty">
								Automated Rewards
							</h3>
							<p className="text-gray-600 font-arimo">
								Set milestone rewards that are automatically granted
							</p>
						</div>

						<div className="text-center">
							<div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mx-auto mb-4">
								<Shield className="w-8 h-8 text-white" />
							</div>
							<h3 className="text-xl font-bold text-gray-10 mb-2 font-hegarty">
								Fraud Protection
							</h3>
							<p className="text-gray-600 font-arimo">
								Built-in fraud detection to protect your program
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* CTA Section */}
			<div className="py-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-3xl mx-auto text-center">
					<div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md mb-6">
						<Sparkles className="w-5 h-5 text-gray-10" />
						<span className="text-sm font-semibold text-gray-700 font-arimo">
							Built for Whop Creators
						</span>
					</div>
					<h2 className="text-4xl md:text-5xl font-bold text-gray-10 mb-6 font-hegarty">
						Ready to grow your community?
					</h2>
					<p className="text-xl text-gray-600 font-arimo mb-8">
						Start rewarding your most valuable members today
					</p>
					<div className="flex items-center justify-center gap-4">
						<Button asChild size="xl">
							<Link href={`/dashboard/${demoCompanyId}/referrals`}>
								Get Started
							</Link>
						</Button>
						<Button asChild size="xl" variant="outline">
							<Link href="/discover">
								Learn More
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
