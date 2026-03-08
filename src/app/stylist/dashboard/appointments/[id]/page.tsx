import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyServices, dummyStylists } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";
import { AlertCircle, CalendarIcon, ChevronLeft, Clock, Scissors, User } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AppointmentDetailsPage({ params }: { params: { id: string } }) {
	const user = await currentUser();

	if (!user || !user.username) {
		redirect("/stylist/sign-in");
	}

	const isStylist = user?.publicMetadata?.role === "stylist" || dummyStylists.some((s) => s.username === user.username);
	if (!isStylist) {
		redirect("/dashboard");
	}

	const { id } = await params;

	// Fetch appointment details
	const { data: appointment, error } = await supabase.from("appointments").select("*").eq("id", id).single();

	if (error || !appointment) {
		return (
			<div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
				<AlertCircle className="w-12 h-12 text-red-500" />
				<h2 className="text-2xl font-bold text-slate-900">Appointment Not Found</h2>
				<p className="text-slate-500">The requested appointment could not be found or you don't have access to it.</p>
				<Link href="/stylist/dashboard" className="text-blue-600 hover:underline">
					Return to Dashboard
				</Link>
			</div>
		);
	}

	// Double check that the stylist actually owns this appointment
	if (appointment.stylist_id !== user.username) {
		redirect("/stylist/dashboard");
	}

	const service = dummyServices.find((s) => s.id === appointment.service_id);

	return (
		<div className="max-w-3xl mx-auto space-y-6">
			<Link href="/stylist/dashboard" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
				<ChevronLeft className="w-4 h-4 mr-1" />
				Back to Schedule
			</Link>

			<Card className="border-t-4 border-t-blue-500 shadow-sm overflow-hidden">
				<CardHeader className="bg-slate-50 border-b border-slate-100 pb-6">
					<div className="flex justify-between items-start">
						<div>
							<CardTitle className="text-2xl font-bold text-slate-800">{service?.name || "Unknown Service"}</CardTitle>
							<CardDescription className="text-base mt-1">Appointment Details</CardDescription>
						</div>
						<div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${appointment.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}>{appointment.status}</div>
					</div>
				</CardHeader>
				<CardContent className="p-6 md:p-8">
					<div className="grid md:grid-cols-2 gap-8">
						<div className="space-y-6">
							<div>
								<h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Time & Date</h3>
								<div className="flex items-center gap-3 text-slate-700 mb-3">
									<div className="p-2 bg-blue-50 text-blue-600 rounded-full">
										<CalendarIcon className="w-5 h-5" />
									</div>
									<span className="font-medium text-lg">{new Date(appointment.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
								</div>
								<div className="flex items-center gap-3 text-slate-700 border-b border-slate-100 pb-6">
									<div className="p-2 bg-blue-50 text-blue-600 rounded-full">
										<Clock className="w-5 h-5" />
									</div>
									<span className="font-medium text-lg">{appointment.time}</span>
								</div>
							</div>

							<div>
								<h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Client Information</h3>
								<div className="flex items-center gap-3 text-slate-700">
									<div className="p-2 bg-slate-100 object-cover text-slate-600 rounded-full">
										<User className="w-5 h-5" />
									</div>
									<span className="font-medium text-lg">{appointment.customer_name || "Unknown Customer"}</span>
								</div>
							</div>
						</div>

						<div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4 h-fit">
							<h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Service Breakdown</h3>
							<div className="flex items-center gap-3">
								<Scissors className="w-5 h-5 text-slate-400" />
								<span className="font-medium text-slate-700">{service?.name}</span>
							</div>
							<div className="flex items-center justify-between border-t border-slate-200 pt-4 mt-4">
								<span className="text-slate-500">Duration</span>
								<span className="font-medium text-slate-900">{service?.duration_minutes} minutes</span>
							</div>
							<div className="flex items-center justify-between border-t border-slate-200 pt-4">
								<span className="text-slate-500">Price</span>
								<span className="font-medium text-lg text-slate-900">${service?.price}</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
