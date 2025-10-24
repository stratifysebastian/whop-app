import { DashboardNav } from '@/components/navigation/dashboard-nav';

export default async function DashboardLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ companyId: string }>;
}) {
	const { companyId } = await params;
	
	return (
		<>
			<DashboardNav companyId={companyId} />
			{children}
		</>
	);
}

