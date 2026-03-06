"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyServices, dummyStylists } from "@/lib/data";
import { CalendarIcon, Clock, Scissors, X } from "lucide-react";
import Link from "next/link";

import { deleteAppointment } from "@/app/actions";
import { useState } from "react";

interface Appointment {
	id: string;
	serviceId: string;
	stylistId: string;
	date: string;
	time: string;
	status: string;
}

export function AppointmentList({ initialAppointments }: { initialAppointments: Appointment[] }) {
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const handleCancelEvent = async (id: string) => {
		try {
			setDeletingId(id);
			await deleteAppointment(id);
			// Server action uses revalidatePath, which will auto-refresh this component
		} catch (error) {
			console.error(error);
			setDeletingId(null);
		}
	};

	const appointments = initialAppointments || [];

	if (appointments.length === 0) {
		return (
			<div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
				<Scissors className="w-12 h-12 text-slate-300 mx-auto mb-4" />
				<h3 className="text-xl font-semibold text-slate-700 mb-2">No upcoming appointments</h3>
				<p className="text-slate-500 mb-6">You don&apos;t have any reservations scheduled yet.</p>
				<Button asChild>
					<Link href="/services">Browse Services</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
			{appointments.map((apt) => {
				const service = dummyServices.find((s) => s.id === apt.serviceId);
				const stylist = dummyStylists.find((s) => s.id === apt.stylistId);

				return (
					<Card key={apt.id} className="relative overflow-hidden border-t-4 border-t-emerald-500">
						{apt.status === "pending" && <div className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-bl-lg">Pending</div>}
						<CardHeader className="pb-3">
							<CardTitle className="text-xl">{service?.name}</CardTitle>
							<CardDescription className="flex items-center gap-2 mt-1">
								<img src={stylist?.image_url} alt={stylist?.name} className="w-6 h-6 rounded-full object-cover" />
								<span>with {stylist?.name}</span>
							</CardDescription>
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
						</CardContent>
						<CardFooter className="pt-2">
							<Button variant="destructive" size="sm" className="w-full text-xs" onClick={() => handleCancelEvent(apt.id)} disabled={deletingId === apt.id}>
								<X className="w-3 h-3 mr-1" /> {deletingId === apt.id ? "Canceling..." : "Cancel Appointment"}
							</Button>
						</CardFooter>
					</Card>
				);
			})}
		</div>
	);
}
