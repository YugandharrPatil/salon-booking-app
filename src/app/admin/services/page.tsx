import { AdminServicesList } from "@/components/AdminServicesList";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminServicesPage() {
	const user = await currentUser();

	if (!user) {
		redirect("/admin/sign-in");
	}

	const isAdmin = user.publicMetadata?.role === "admin" || user.username === "johncarmack";

	if (!isAdmin) {
		redirect("/");
	}

	return (
		<main className="container mx-auto px-4 py-8">
			<AdminServicesList />
		</main>
	);
}
