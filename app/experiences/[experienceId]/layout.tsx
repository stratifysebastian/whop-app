import { UserNav } from '@/components/navigation/user-nav';

export default async function ExperienceLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ experienceId: string }>;
}) {
	const { experienceId } = await params;
	
	return (
		<>
			<UserNav experienceId={experienceId} />
			{children}
		</>
	);
}

