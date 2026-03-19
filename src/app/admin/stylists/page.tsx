import { AdminStylistsList } from "@/components/admin-stylists-list";

export default async function AdminStylistsPage() {
	return (
		<main className="container mx-auto px-4 py-8">
			<AdminStylistsList />
		</main>
	);
}
