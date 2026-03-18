import { StylistAppointments } from "@/components/StylistAppointments";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function StylistDashboardPage() {
	const user = await currentUser();

	if (!user) {
		redirect("/stylist/sign-in");
	}

	// Verify they actually have the stylist role in publicMetadata
	const isStylist = user?.publicMetadata?.role === "stylist";
	if (!isStylist) {
		redirect("/dashboard");
	}

	// Ensure user.username exists since we are passing it to StylistAppointments
	const username = user.username;
	if (!username) {
		console.error("Stylist user has no username. Roles misconfigured.");
		redirect("/dashboard");
	}

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col">
			<main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
				<div className="mb-6 border-b pb-6">
					<div className="flex justify-between items-center mb-4">
						<h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
							<span className="bg-blue-100 text-blue-800 p-2 rounded-lg text-sm uppercase tracking-widest font-bold">Stylist Portal</span>
							Welcome, {user.firstName || username}
						</h1>
					</div>
					<p className="text-slate-500 mt-2">Manage your schedule and upcoming appointments.</p>
				</div>

				<div className="mt-6">
					<StylistAppointments username={username} />
				</div>
			</main>
		</div>
	);
}
