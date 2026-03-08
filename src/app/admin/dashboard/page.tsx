import { AdminDashboardList } from "@/components/AdminDashboardList";
import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
	const user = await currentUser();

	if (!user) {
		return (
			<div className="min-h-screen bg-slate-50 flex flex-col">
				<div className="container mx-auto px-4 py-12 text-center">
					<h2 className="text-2xl font-bold mb-4">You need to sign in to access the Admin Portal</h2>
					<Button asChild>
						<Link href="/admin/sign-in">Admin Sign In</Link>
					</Button>
				</div>
			</div>
		);
	}

	const isAdmin = user.publicMetadata?.role === "admin" || user.username === "johncarmack";

	if (!isAdmin) {
		redirect("/dashboard");
	}

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col">
			<main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
				<div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
					<div>
						<h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Admin Control Center</h1>
						<p className="text-slate-500 mt-1">Viewing all scheduled appointments across the platform.</p>
					</div>
					<div className="text-sm font-medium px-4 py-2 bg-blue-100 text-blue-800 rounded-full border border-blue-200 shadow-sm">Super Admin</div>
				</div>

				{/* The Client Component that fetches all appointments */}
				<AdminDashboardList />
			</main>
		</div>
	);
}
