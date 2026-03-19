import { AdminServicesList } from "@/components/admin-services-list";

export default async function AdminServicesPage() {
	return (
		<main className="container mx-auto px-4 py-8">
			<AdminServicesList />
		</main>
	);
}
