"use client";

import { StylistCalendar } from "@/components/stylist-calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { TABLES } from "@/lib/tables";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, Clock, LayoutList, Loader2, RefreshCw, User } from "lucide-react";
import Link from "next/link";

import { Tables } from "@/types/database.types";

type Service = Tables<"salon_services">;
type Appointment = Tables<"salon_appointments">;

export function StylistAppointments({ username }: { username: string }) {
	// Fetch services lookup map
	const { data: servicesMap } = useQuery({
		queryKey: ["services-map"],
		queryFn: async () => {
			const { data } = await supabase.from(TABLES.SERVICES).select("*");
			const map: Record<string, Service> = {};
			(data || []).forEach((s: Service) => {
				map[s.id] = s;
			});
			return map;
		},
	});

	const {
		data: appointments,
		isLoading,
		error,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ["appointments", username],
		queryFn: async () => {
			const { data, error } = await supabase.from(TABLES.APPOINTMENTS).select("*").ilike("stylist_id", username);
			if (error && error.code !== "PGRST116") throw error;

			return (data || [])
				.map((apt: Appointment) => ({
					id: apt.id,
					customerName: apt.customer_name || "Unknown Customer",
					serviceId: apt.service_id,
					date: apt.date,
					time: apt.time,
					status: apt.status,
				}))
				.sort((a, b) => {
					if (a.status === "pending" && b.status === "completed") return -1;
					if (a.status === "completed" && b.status === "pending") return 1;
					return 0;
				});
		},
	});

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-20 text-slate-500">
				<Loader2 className="w-8 h-8 animate-spin" />
				<span className="ml-3">Loading your schedule...</span>
			</div>
		);
	}

	if (error) {
		return <div className="text-center py-10 bg-red-50 text-red-600 rounded-xl border border-red-200">Failed to load appointments. Please check your connection and try again.</div>;
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4 mt-6">
				<h2 className="text-xl font-semibold text-slate-800">Your Appointments</h2>
				<Button onClick={() => refetch()} variant="outline" size="sm" disabled={isRefetching} className="gap-2 shadow-sm hover:shadow-md transition-all">
					<RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
					Refresh
				</Button>
			</div>

			<Tabs defaultValue="cards" className="w-full">
				<TabsList className="mb-6 grid w-full max-w-100 grid-cols-2">
					<TabsTrigger value="cards" className="flex items-center gap-2">
						<LayoutList className="w-4 h-4" /> Cards View
					</TabsTrigger>
					<TabsTrigger value="calendar" className="flex items-center gap-2">
						<CalendarIcon className="w-4 h-4" /> Calendar View
					</TabsTrigger>
				</TabsList>

				<TabsContent value="cards" className="space-y-6">
					{!appointments || appointments.length === 0 ? (
						<div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
							<h3 className="text-xl font-semibold text-slate-700 mb-2">No upcoming appointments</h3>
							<p className="text-slate-500">Your schedule is completely clear.</p>
						</div>
					) : (
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							{appointments.map((apt) => {
								const service = servicesMap?.[apt.serviceId];

								return (
									<Link key={apt.id} href={`/stylist/dashboard/appointments/${apt.id}`} className="block">
										<Card className={`relative overflow-hidden border-t-4 shadow-sm hover:shadow-md transition-shadow h-full ${apt.status === "completed" ? "border-t-slate-300 opacity-75" : "border-t-blue-500"}`}>
											{apt.status === "pending" && <div className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-bl-lg z-10">Pending</div>}
											{apt.status === "completed" && <div className="absolute top-0 right-0 bg-slate-200 text-slate-700 text-xs font-semibold px-2 py-1 rounded-bl-lg z-10">Completed</div>}
											<CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
												<CardTitle className="text-lg text-slate-800">{service?.name || "Unknown Service"}</CardTitle>
											</CardHeader>
											<CardContent className="space-y-3 pt-4 bg-white">
												<div className="flex items-center gap-3 text-slate-600">
													<div className="p-2 bg-blue-50 text-blue-600 rounded-full">
														<CalendarIcon className="w-4 h-4" />
													</div>
													<span className="font-medium text-slate-700">{new Date(apt.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
												</div>
												<div className="flex items-center gap-3 text-slate-600">
													<div className="p-2 bg-blue-50 text-blue-600 rounded-full">
														<Clock className="w-4 h-4" />
													</div>
													<span className="font-medium text-slate-700">
														{apt.time} ({service?.duration_minutes || "?"} mins)
													</span>
												</div>
												<div className="flex items-center gap-3 text-slate-600">
													<div className="p-2 bg-blue-50 text-blue-600 rounded-full">
														<User className="w-4 h-4" />
													</div>
													<div className="flex flex-col">
														<span className="text-xs text-slate-400 font-medium tracking-wide uppercase">Client</span>
														<span className="text-sm font-semibold text-slate-900">{apt.customerName}</span>
													</div>
												</div>
											</CardContent>
										</Card>
									</Link>
								);
							})}
						</div>
					)}
				</TabsContent>

				<TabsContent value="calendar" className="mt-4">
					<StylistCalendar username={username} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
