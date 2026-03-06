import { AppointmentList } from "@/components/AppointmentList";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function DashboardPage() {
	const session = await auth();

	if (!session?.userId) {
		return (
			<div className="min-h-screen bg-slate-50 flex flex-col">
				<div className="container mx-auto px-4 py-12 text-center">
					<h2 className="text-2xl font-bold mb-4">You need to sign in to view this page</h2>
					<Button asChild>
						<Link href="/sign-in">Sign In</Link>
					</Button>
				</div>
			</div>
		);
	}

	// Fetch appointments from Supabase
	const { data: appointments, error } = await supabase.from("appointments").select("*").eq("user_id", session.userId);

	if (error && error.code !== "PGRST116") {
		const errorMessage = error.message || JSON.stringify(error);
		if (errorMessage !== "{}") {
			console.error("Failed to fetch appointments:", errorMessage);
		}
	}

	// We deserialize the snake_case columns automatically when passing to the UI
	const formattedAppointments = (appointments || []).map((apt: any) => ({
		id: apt.id,
		serviceId: apt.service_id,
		stylistId: apt.stylist_id,
		date: apt.date,
		time: apt.time,
		status: apt.status,
	}));

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col">
			<main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold tracking-tight text-slate-900">Your Appointments</h1>
					<Button asChild>
						<Link href="/services">Book New Appointment</Link>
					</Button>
				</div>

				<AppointmentList initialAppointments={formattedAppointments} />
			</main>
		</div>
	);
}
