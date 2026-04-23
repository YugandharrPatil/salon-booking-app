"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Clock, Scissors, X } from "lucide-react";
import Link from "next/link";

import ReviewDialog from "@/components/review-dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteAppointment } from "@/lib/actions/user";
import { supabase } from "@/lib/supabase";
import { TABLES } from "@/lib/tables";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";

import { Tables } from "@/types/database.types";

type Appointment = Tables<"salon_appointments">;
type Service = Tables<"salon_services">;
type Stylist = Tables<"salon_stylists">;

export function AppointmentList() {
	const { user } = useUser();
	const queryClient = useQueryClient();

	const [reviewAppointmentId, setReviewAppointmentId] = useState<string | null>(null);
	const [reviewStylistId, setReviewStylistId] = useState<string | null>(null);
	const [reviewStylistName, setReviewStylistName] = useState<string>("");

	// Fetch services and stylists lookup maps
	const { data: servicesMap } = useQuery({
		queryKey: ["services-map"],
		queryFn: async () => {
			const { data } = await supabase.from(TABLES.SERVICES).select("*");
			const map: Record<string, Service> = {};
			(data || []).forEach((s) => {
				map[s.id] = s;
			});
			return map;
		},
	});

	const { data: stylistsMap } = useQuery({
		queryKey: ["stylists-map"],
		queryFn: async () => {
			const { data } = await supabase.from(TABLES.STYLISTS).select("*");
			const map: Record<string, Stylist> = {};
			(data || []).forEach((s) => {
				map[s.id] = s;
			});
			return map;
		},
	});

	const {
		data: appointments,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["client-appointments", user?.id],
		enabled: !!user?.id,
		queryFn: async () => {
			const { data, error } = await supabase
				.from(TABLES.APPOINTMENTS)
				.select("*")
				.eq("user_id", user?.id || "");
			if (error && error.code !== "PGRST116") throw error;

			return ((data || []) as Appointment[]).sort((a, b) => {
				if (a.status === "pending" && b.status === "completed") return -1;
				if (a.status === "completed" && b.status === "pending") return 1;
				return 0;
			});
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			await deleteAppointment(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["client-appointments"] });
		},
		onError: (error) => {
			console.error("Failed to cancel appointment:", error);
		},
	});

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-20 text-slate-500">
				<Loader2 className="w-8 h-8 animate-spin" />
				<span className="ml-3">Loading your appointments...</span>
			</div>
		);
	}

	if (error) {
		return <div className="text-center py-10 bg-red-50 text-red-600 rounded-xl border border-red-200">Failed to load appointments. Please check your connection and try again.</div>;
	}

	if (!appointments || appointments.length === 0) {
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
			{appointments.map((apt: Appointment) => {
				const service = servicesMap?.[apt.service_id];
				const stylist = stylistsMap?.[apt.stylist_id];

				return (
					<Card key={apt.id} className={`relative overflow-hidden border-t-4 shadow-sm hover:shadow-md transition-shadow ${apt.status === "completed" ? "border-t-slate-300 opacity-75" : "border-t-emerald-500"}`}>
						{apt.status === "pending" && <div className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-bl-lg">Pending</div>}
						{apt.status === "completed" && <div className="absolute top-0 right-0 bg-slate-200 text-slate-700 text-xs font-semibold px-2 py-1 rounded-bl-lg">Completed</div>}
						<CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
							<CardTitle className="text-xl text-slate-800">{service?.name || "Unknown Service"}</CardTitle>
							<CardDescription className="flex items-center gap-2 mt-1">
								{stylist?.image_url ? (
									<img src={stylist.image_url} alt={stylist.name} className="w-6 h-6 rounded-full object-cover" />
								) : (
									<div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
										<Scissors className="w-3 h-3 text-slate-400" />
									</div>
								)}
								<span>with {stylist?.name || "Unknown Stylist"}</span>
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3 pt-4 bg-white">
							<div className="flex items-center gap-3 text-slate-600">
								<div className="p-2 bg-emerald-50 text-emerald-600 rounded-full">
									<CalendarIcon className="w-4 h-4" />
								</div>
								<span className="font-medium text-slate-700">{new Date(apt.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
							</div>
							<div className="flex items-center gap-3 text-slate-600">
								<div className="p-2 bg-emerald-50 text-emerald-600 rounded-full">
									<Clock className="w-4 h-4" />
								</div>
								<span className="font-medium text-slate-700">
									{apt.time} ({service?.duration_minutes || "?"} mins)
								</span>
							</div>
						</CardContent>
						{apt.status === "pending" && (
							<CardFooter className="pt-4 bg-slate-50/50 border-t border-slate-50 flex gap-2">
								<Button
									variant="outline"
									size="sm"
									className="flex-1 font-medium bg-white hover:bg-emerald-50 hover:text-emerald-700 border-emerald-200"
									disabled={deleteMutation.isPending}
									onClick={() => {
										setReviewAppointmentId(apt.id);
										setReviewStylistId(apt.stylist_id);
										setReviewStylistName(stylist?.name || "Stylist");
									}}
								>
									<CheckCircle className="w-3 h-3 mr-2 text-emerald-600" />
									Complete
								</Button>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button variant="outline" size="sm" className="flex-1 font-medium bg-white hover:bg-red-50 hover:text-red-500 border-red-200" disabled={deleteMutation.isPending}>
											{deleteMutation.isPending && deleteMutation.variables === apt.id ? (
												<Loader2 className="w-3 h-3 mr-2 animate-spin" />
											) : (
												<>
													<X className="w-3 h-3 mr-2 text-red-500" />
													Cancel
												</>
											)}
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone. This will permanently cancel your <strong>{service?.name || "appointment"}</strong> with <strong>{stylist?.name || "stylist"}</strong> on{" "}
												{new Date(apt.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at {apt.time}.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Keep Appointment</AlertDialogCancel>
											<AlertDialogAction onClick={() => deleteMutation.mutate(apt.id)} className="bg-red-600 text-white hover:bg-red-700">
												Yes, cancel it
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</CardFooter>
						)}
					</Card>
				);
			})}

			{/* Review Modal */}
			{reviewStylistId && reviewAppointmentId && (
				<ReviewDialog
					appointmentId={reviewAppointmentId}
					stylistId={reviewStylistId}
					stylistName={reviewStylistName}
					isOpen={!!reviewStylistId}
					onClose={() => {
						setReviewStylistId(null);
						setReviewStylistName("");
						setReviewAppointmentId(null);
					}}
				/>
			)}
		</div>
	);
}
