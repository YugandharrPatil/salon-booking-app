import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyServices, dummyStylists } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";
import { CalendarIcon, Clock, User } from "lucide-react";
import { redirect } from "next/navigation";

export default async function StylistDashboardPage() {
	const user = await currentUser();

	if (!user) {
		redirect("/stylist/sign-in");
	}

	// Verify they actually have the stylist role in publicMetadata
	const isStylist = user?.publicMetadata?.role === "stylist" || (user?.username ? dummyStylists.some((s) => s.username === user.username) : false);
	if (!isStylist) {
		redirect("/dashboard");
	}

	// Fetch appointments where the stylist_id matches the requested dummy username
	const { data: appointments, error } = await supabase.from("appointments").select("*").eq("stylist_id", user.username);

	if (error && error.code !== "PGRST116") {
		console.error("Failed to fetch stylist appointments:", error);
	}

	const formattedAppointments = (appointments || []).map((apt: any) => ({
		id: apt.id,
		customerName: apt.customer_name || "Unknown Customer",
		serviceId: apt.service_id,
		date: apt.date,
		time: apt.time,
		status: apt.status,
	}));

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col">
			<main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
				<div className="mb-8 border-b pb-6">
					<h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
						<span className="bg-blue-100 text-blue-800 p-2 rounded-lg text-sm uppercase tracking-widest font-bold">Stylist Portal</span>
						Welcome, {user.firstName || user.username}
					</h1>
					<p className="text-slate-500 mt-2">Here are your upcoming appointments.</p>
				</div>

				{formattedAppointments.length === 0 ? (
					<div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
						<h3 className="text-xl font-semibold text-slate-700 mb-2">No upcoming appointments</h3>
						<p className="text-slate-500">Your schedule is completely clear.</p>
					</div>
				) : (
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{formattedAppointments.map((apt) => {
							const service = dummyServices.find((s) => s.id === apt.serviceId);

							return (
								<Card key={apt.id} className="relative overflow-hidden border-t-4 border-t-blue-500">
									{apt.status === "pending" && <div className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-bl-lg">Pending</div>}
									<CardHeader className="pb-3">
										<CardTitle className="text-lg">{service?.name}</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3 pt-4 border-t border-slate-100">
										<div className="flex items-center gap-3 text-slate-600">
											<CalendarIcon className="w-4 h-4" />
											<span>{new Date(apt.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
										</div>
										<div className="flex items-center gap-3 text-slate-600">
											<Clock className="w-4 h-4" />
											<span>
												{apt.time} ({service?.duration_minutes} mins)
											</span>
										</div>
										<div className="flex items-center gap-3 text-slate-600">
											<User className="w-4 h-4" />
											<span className="text-sm font-medium">{apt.customerName}</span>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				)}
			</main>
		</div>
	);
}
