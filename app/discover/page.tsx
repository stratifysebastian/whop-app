import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sparkles, TrendingUp, Users, Zap, Target, Award, ArrowRight, CheckCircle2, Rocket } from "lucide-react";

export default function DiscoverPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 relative overflow-hidden">
			{/* Animated Background Elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
				<div className="absolute top-60 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
				<div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-500" />
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
				{/* Hero Section */}
				<div className="text-center mb-16 space-y-6">
					<Badge variant="accent" className="text-base px-6 py-2 mb-4 shadow-lg">
						<Sparkles className="w-4 h-4 mr-2" />
						Transform Your Community Growth
					</Badge>
					
					<h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 font-hegarty leading-tight">
						Discover{" "}
						<span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
							Referly
						</span>
					</h1>
					
					<p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-arimo leading-relaxed">
						The ultimate referral and affiliate tracking system for creators who want to{" "}
						<span className="font-bold text-primary">unlock viral growth</span> and{" "}
						<span className="font-bold text-secondary">reward loyal members</span>—all from your Whop dashboard.
					</p>
					
					<div className="flex flex-wrap gap-4 justify-center items-center pt-6">
						<Button size="xl" className="font-bold text-lg shadow-2xl">
							<Rocket className="w-5 h-5" />
							Get Started Free
						</Button>
						<Button size="xl" variant="outline" className="font-bold text-lg">
							View Demo
							<ArrowRight className="w-5 h-5" />
						</Button>
					</div>
				</div>

				{/* Stats Section */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
					<Card className="bg-gradient-to-br from-primary to-primary-bright border-0 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
						<CardContent className="p-8 text-center text-white">
							<TrendingUp className="w-12 h-12 mx-auto mb-4" />
							<div className="text-4xl mb-2 font-hegarty">$12K+</div>
							<div className="text-lg opacity-90 font-arimo">New MRR Generated</div>
						</CardContent>
					</Card>
					
					<Card className="bg-gradient-to-br from-secondary to-secondary-light border-0 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
						<CardContent className="p-8 text-center text-white">
							<Users className="w-12 h-12 mx-auto mb-4" />
							<div className="text-4xl mb-2 font-hegarty">6,000+</div>
							<div className="text-lg opacity-90 font-arimo">Referrals Tracked</div>
						</CardContent>
					</Card>
					
					<Card className="bg-gradient-to-br from-accent to-accent-light border-0 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
						<CardContent className="p-8 text-center text-white">
							<Award className="w-12 h-12 mx-auto mb-4" />
							<div className="text-4xl mb-2 font-hegarty">95%</div>
							<div className="text-lg opacity-90 font-arimo">Retention Rate</div>
						</CardContent>
					</Card>
				</div>

				{/* Features Grid */}
				<div className="mb-20">
					<div className="text-center mb-12">
						<h2 className="text-4xl md:text-5xl text-gray-900 mb-4 font-hegarty">
							Why Creators Love Referly
						</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto font-arimo">
							Everything you need to turn your community into a growth engine
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-8">
						<Card className="border-2 border-primary/20 hover:border-primary shadow-lg hover:shadow-2xl transition-all group">
							<CardHeader>
								<div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-bright rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
									<Target className="w-6 h-6 text-white" />
								</div>
								<CardTitle className="text-2xl font-normal font-hegarty">Zero Manual Tracking</CardTitle>
								<CardDescription className="text-base font-arimo">
									Automatic referral detection and attribution—no spreadsheets, no hassle. Set it up once and let it run.
								</CardDescription>
							</CardHeader>
						</Card>

						<Card className="border-2 border-secondary/20 hover:border-secondary shadow-lg hover:shadow-2xl transition-all group">
							<CardHeader>
								<div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-light rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
									<Zap className="w-6 h-6 text-white" />
								</div>
								<CardTitle className="text-2xl font-normal font-hegarty">Campaign-Based Rewards</CardTitle>
								<CardDescription className="text-base font-arimo">
									Run contests, unlock perks, and auto-reward top referrers. Gamify growth to supercharge engagement.
								</CardDescription>
							</CardHeader>
						</Card>

						<Card className="border-2 border-accent/20 hover:border-accent shadow-lg hover:shadow-2xl transition-all group">
							<CardHeader>
								<div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-light rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
									<Award className="w-6 h-6 text-white" />
								</div>
								<CardTitle className="text-2xl font-normal font-hegarty">Real-Time Leaderboards</CardTitle>
								<CardDescription className="text-base font-arimo">
									Show off top performers and create FOMO. Members compete to climb the ranks and earn rewards.
								</CardDescription>
							</CardHeader>
						</Card>

						<Card className="border-2 border-info/20 hover:border-info shadow-lg hover:shadow-2xl transition-all group">
							<CardHeader>
								<div className="w-12 h-12 bg-gradient-to-br from-info to-info-light rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
									<TrendingUp className="w-6 h-6 text-white" />
								</div>
								<CardTitle className="text-2xl font-normal font-hegarty">Analytics Dashboard</CardTitle>
								<CardDescription className="text-base font-arimo">
									Track revenue, conversion rates, and top referrers. Make data-driven decisions to optimize growth.
								</CardDescription>
							</CardHeader>
						</Card>
					</div>
				</div>

				{/* Social Proof Section */}
				<div className="mb-20 hidden">
					<div className="text-center mb-12">
						<Badge variant="info" className="text-base px-6 py-2 mb-4">
							<CheckCircle2 className="w-4 h-4 mr-2" />
							Proven Results
						</Badge>
						<h2 className="text-4xl md:text-5xl text-gray-900 mb-4 font-hegarty">
							Success Stories
						</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto font-arimo">
							Real creators, real results. See how Referly transforms community growth.
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-8">
						{/* Success Story 1 */}
						<Card className="border-0 shadow-2xl hover:shadow-3xl transition-all overflow-hidden group bg-gradient-to-br from-white to-orange-50">
							<CardHeader className="pb-4">
								<div className="flex items-start justify-between mb-4">
									<div>
										<CardTitle className="text-2xl font-hegarty text-gray-900 mb-2">
											GrowLabs
										</CardTitle>
										<Badge variant="outline" className="text-xs font-arimo">
											AI Tools Community
										</Badge>
									</div>
									<div className="flex gap-2">
										<Badge variant="default" className="shadow-lg">
											<TrendingUp className="w-3 h-3 mr-1" />
											4K+ Referrals
										</Badge>
									</div>
								</div>
								<Separator className="bg-gradient-to-r from-primary via-accent to-transparent" />
							</CardHeader>
							
							<CardContent className="space-y-4">
								<p className="text-gray-700 text-base leading-relaxed font-arimo">
									"Referly helped us reach{" "}
									<span className="font-bold text-primary text-lg">$7,200+/mo</span> in new MRR within just 2 months. The campaign-based rewards system created incredible momentum."
								</p>
								
								<div className="grid grid-cols-2 gap-4 pt-4">
									<div className="text-center p-4 bg-white rounded-lg shadow-sm">
										<div className="text-3xl font-bold text-primary font-hegarty">4,000+</div>
										<div className="text-sm text-gray-600 font-arimo">Referrals</div>
									</div>
									<div className="text-center p-4 bg-white rounded-lg shadow-sm">
										<div className="text-3xl font-bold text-secondary font-hegarty">$7.2K</div>
										<div className="text-sm text-gray-600 font-arimo">New MRR</div>
									</div>
								</div>
							</CardContent>
							
							<CardFooter className="pt-6">
								<Button 
									className="w-full font-bold text-base group-hover:scale-105 transition-transform shadow-xl" 
									size="lg"
									asChild
								>
									<a href="https://whop.com/growlabs/?a=referly" target="_blank" rel="noopener noreferrer">
										Visit GrowLabs
										<ArrowRight className="w-5 h-5" />
									</a>
								</Button>
							</CardFooter>
						</Card>

						{/* Success Story 2 */}
						<Card className="border-0 shadow-2xl hover:shadow-3xl transition-all overflow-hidden group bg-gradient-to-br from-white to-purple-50">
							<CardHeader className="pb-4">
								<div className="flex items-start justify-between mb-4">
									<div>
										<CardTitle className="text-2xl font-hegarty text-gray-900 mb-2">
											CreatorCore
										</CardTitle>
										<Badge variant="outline" className="text-xs font-arimo">
											Business Builder Group
										</Badge>
									</div>
									<div className="flex gap-2">
										<Badge variant="secondary" className="shadow-lg">
											<Award className="w-3 h-3 mr-1" />
											91% Retention
										</Badge>
									</div>
								</div>
								<Separator className="bg-gradient-to-r from-secondary via-accent to-transparent" />
							</CardHeader>
							
							<CardContent className="space-y-4">
								<p className="text-gray-700 text-base leading-relaxed font-arimo">
									"The referral leaderboard completely transformed member engagement. With{" "}
									<span className="font-bold text-secondary text-lg">91% retention</span> and{" "}
									<span className="font-bold text-accent text-lg">$3,800+</span> earned from referrals, Referly is our growth engine."
								</p>
								
								<div className="grid grid-cols-2 gap-4 pt-4">
									<div className="text-center p-4 bg-white rounded-lg shadow-sm">
										<div className="text-3xl font-bold text-secondary font-hegarty">91%</div>
										<div className="text-sm text-gray-600 font-arimo">Retention</div>
									</div>
									<div className="text-center p-4 bg-white rounded-lg shadow-sm">
										<div className="text-3xl font-bold text-accent font-hegarty">$3.8K</div>
										<div className="text-sm text-gray-600 font-arimo">Earned</div>
									</div>
								</div>
							</CardContent>
							
							<CardFooter className="pt-6">
								<Button 
									variant="secondary"
									className="w-full font-bold text-base group-hover:scale-105 transition-transform shadow-xl" 
									size="lg"
									asChild
								>
									<a href="https://whop.com/creatorcore/?a=referly" target="_blank" rel="noopener noreferrer">
										Visit CreatorCore
										<ArrowRight className="w-5 h-5" />
									</a>
								</Button>
							</CardFooter>
						</Card>
					</div>
				</div>

				{/* CTA Section */}
				<Card className="border-0 bg-gradient-to-br from-primary via-primary-bright to-accent shadow-2xl overflow-hidden relative">
					<div className="absolute inset-0 bg-black/5" />
					<CardContent className="p-12 md:p-16 text-center relative z-10">
						<Badge variant="accent" className="mb-6 text-base px-6 py-2">
							<Sparkles className="w-4 h-4 mr-2" />
							Start Growing Today
						</Badge>
						<h2 className="text-4xl md:text-5xl text-white mb-6 font-hegarty">
							Ready to Transform Your Growth?
						</h2>
						<p className="text-xl text-white/90 max-w-2xl mx-auto mb-8 font-arimo">
							Join hundreds of creators using Referly to build thriving communities through the power of referrals.
						</p>
						<div className="flex flex-wrap gap-4 justify-center">
							<Button 
								size="xl" 
								variant="outline"
								className="bg-white text-primary hover:bg-white/90 border-0 font-bold text-lg shadow-xl hover:scale-105 transition-all"
							>
								Install Referly
								<Rocket className="w-5 h-5" />
							</Button>
							<Button 
								size="xl" 
								variant="secondary"
								className="font-bold text-lg shadow-xl hover:scale-105 transition-all"
							>
								View Documentation
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Pro Tips */}
				<div className="mt-20 grid md:grid-cols-2 gap-6">
					<Card className="border-2 border-dashed border-primary/30 bg-orange-50/50">
						<CardHeader>
							<CardTitle className="text-lg font-normal font-hegarty flex items-center">
								<CheckCircle2 className="w-5 h-5 mr-2 text-primary" />
								Pro Tip: Showcase Success
							</CardTitle>
							<CardDescription className="font-arimo">
								Link to real Whop communities using Referly with revenue and member stats. Social proof builds trust and drives installs.
							</CardDescription>
						</CardHeader>
					</Card>
					
					<Card className="border-2 border-dashed border-secondary/30 bg-purple-50/50">
						<CardHeader>
							<CardTitle className="text-lg font-normal font-hegarty flex items-center">
								<CheckCircle2 className="w-5 h-5 mr-2 text-secondary" />
								Pro Tip: Use Referral Links
							</CardTitle>
							<CardDescription className="font-arimo">
								Add <code className="bg-white px-2 py-1 rounded text-primary font-mono">?a=referly</code> to your Whop links to earn affiliate commissions while promoting Referly.
							</CardDescription>
						</CardHeader>
					</Card>
				</div>
			</div>
		</div>
	);
}
