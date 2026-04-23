import { AdminDashboardList } from "@/components/admin-dashboard-list";

export default async function AdminDashboardPage() {
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
