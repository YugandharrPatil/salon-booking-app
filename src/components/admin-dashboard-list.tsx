"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { TABLES } from "@/lib/tables";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, Clock, Loader2, RefreshCw, Scissors, User } from "lucide-react";

interface Appointment {
	id: string;
	serviceId: string;
	stylistId: string;
	customerName: string;
	date: string;
	time: string;
	status: string;
}

interface Service {
	id: string;
	name: string;
	duration_minutes: number;
}

interface Stylist {
	id: string;
	name: string;
	image_url: string | null;
}

export function AdminDashboardList() {
	// Fetch services and stylists lookup maps
	const { data: servicesMap } = useQuery({
		queryKey: ["services-map"],
		queryFn: async () => {
			const { data } = await supabase.from(TABLES.SERVICES).select("id, name, duration_minutes, price");
			const map: Record<string, Service> = {};
			(data || []).forEach((s: any) => {
				map[s.id] = s;
			});
			return map;
		},
	});

	const { data: stylistsMap } = useQuery({
		queryKey: ["stylists-map"],
		queryFn: async () => {
			const { data } = await supabase.from(TABLES.STYLISTS).select("id, name, image_url");
			const map: Record<string, Stylist> = {};
			(data || []).forEach((s: any) => {
				map[s.id] = s;
			});
			return map;
		},
	});

	const {
		data: allAppointments,
		isLoading,
		error,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ["admin-all-appointments"],
		queryFn: async () => {
			// Super admin: No .eq filter, pulls everything
			const { data, error } = await supabase.from(TABLES.APPOINTMENTS).select("*").order("date", { ascending: true });
			if (error && error.code !== "PGRST116") throw error;

			return (data || []).map((apt: any) => ({
				id: apt.id,
				serviceId: apt.service_id,
				stylistId: apt.stylist_id,
				customerName: apt.customer_name || "Unknown Customer",
				date: apt.date,
				time: apt.time,
				status: apt.status,
			}));
		},
	});

	if (isLoading) {
		return (
			<div className="flex flex-col justify-center items-center py-32 text-slate-500 bg-white rounded-xl border border-slate-200 shadow-sm">
				<Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
				<span className="text-lg font-medium text-slate-700">Loading global schedule...</span>
			</div>
		);
	}

	if (error) {
		return <div className="text-center py-10 bg-red-50 text-red-600 rounded-xl border border-red-200 shadow-sm font-medium">Failed to load platform appointments. Please check your connection and try again.</div>;
	}

	if (!allAppointments || allAppointments.length === 0) {
		return (
			<div className="text-center py-24 bg-white rounded-xl border border-slate-200 shadow-sm">
				<Scissors className="w-16 h-16 text-slate-200 mx-auto mb-4" />
				<h3 className="text-2xl font-bold text-slate-700 mb-2">No Appointments System-Wide</h3>
				<p className="text-slate-500 max-w-sm mx-auto">There are currently no scheduled appointments across all stylists in the database.</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
				<div className="text-sm text-slate-500 font-medium">
					Showing <span className="font-bold text-slate-900">{allAppointments.length}</span> total appointments
				</div>
				<Button variant="outline" size="sm" onClick={() => refetch()} disabled={isRefetching} className="bg-white hover:bg-slate-50">
					<RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin text-blue-600" : "text-slate-500"}`} />
					{isRefetching ? "Refreshing..." : "Refresh Data"}
				</Button>
			</div>

			<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
				{allAppointments.map((apt: Appointment) => {
					const service = servicesMap?.[apt.serviceId];
					const stylist = stylistsMap?.[apt.stylistId];

					return (
						<Card key={apt.id} className={`relative overflow-hidden border-t-4 shadow-sm hover:shadow-lg transition-all duration-300 ${apt.status === "completed" ? "border-t-slate-300 opacity-75" : "border-t-blue-600"}`}>
							{apt.status === "pending" && <div className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-bl-lg shadow-sm z-10">Pending</div>}
							{apt.status === "completed" && <div className="absolute top-0 right-0 bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-bl-lg shadow-sm z-10">Completed</div>}
							<CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
								<CardTitle className="text-xl text-slate-900">{service?.name || "Unknown Service"}</CardTitle>
								<CardDescription className="flex items-center gap-3 mt-3">
									{stylist?.image_url ? (
										<img src={stylist.image_url} alt={stylist.name} className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" />
									) : (
										<div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white shadow-sm">
											<Scissors className="w-3.5 h-3.5 text-slate-400" />
										</div>
									)}
									<span className="font-medium text-slate-700">{stylist?.name || "Unknown Stylist"}</span>
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4 pt-5 bg-white">
								<div className="flex items-center gap-4 text-slate-600">
									<div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
										<CalendarIcon className="w-5 h-5" />
									</div>
									<div>
										<p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Date</p>
										<span className="font-medium text-slate-800">{new Date(apt.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
									</div>
								</div>
								<div className="flex items-center gap-4 text-slate-600">
									<div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
										<Clock className="w-5 h-5" />
									</div>
									<div>
										<p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Time</p>
										<span className="font-medium text-slate-800">
											{apt.time} <span className="text-slate-400 font-normal">({service?.duration_minutes || "?"}m)</span>
										</span>
									</div>
								</div>
								<div className="flex items-center gap-4 text-slate-600 pt-3 border-t border-slate-100">
									<div className="p-2.5 bg-slate-100 text-slate-500 rounded-xl">
										<User className="w-5 h-5" />
									</div>
									<div>
										<p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Assigned Client</p>
										<span className="font-bold text-slate-900">{apt.customerName}</span>
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
