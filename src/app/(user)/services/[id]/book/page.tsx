"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createAppointment } from "@/lib/actions/user";
import { supabase } from "@/lib/supabase";
import { TABLES } from "@/lib/tables";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, CalendarIcon, Clock, Loader2, Scissors } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function BookingPage() {
	const params = useParams();
	const router = useRouter();
	const serviceId = params?.id as string;

	const {
		handleSubmit,
		formState: { isSubmitting },
	} = useForm();

	const [selectedStylist, setSelectedStylist] = useState<string | null>(null);
	const [date, setDate] = useState<Date | undefined>(undefined);
	const [selectedTime, setSelectedTime] = useState<string | null>(null);

	const { data: service, isLoading: isLoadingService } = useQuery({
		queryKey: ["service", serviceId],
		queryFn: async () => {
			const { data, error } = await supabase.from(TABLES.SERVICES).select("*").eq("id", serviceId).single();
			if (error) throw error;
			return data;
		},
		enabled: !!serviceId,
	});

	const { data: availableStylists = [], isLoading: isLoadingStylists } = useQuery({
		queryKey: ["stylistsForService", serviceId],
		queryFn: async () => {
			const { data, error } = await supabase.from(TABLES.STYLISTS).select("*").contains("service_ids", [serviceId]);
			if (error) throw error;
			return data;
		},
		enabled: !!serviceId,
	});

	if (isLoadingService || isLoadingStylists) {
		return (
			<div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
				<Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
				<p className="text-slate-600">Loading service details...</p>
			</div>
		);
	}

	if (!service) {
		return (
			<div className="min-h-screen bg-slate-50 flex flex-col">
				<div className="container mx-auto p-4 py-8">
					<p>Service not found.</p>
				</div>
			</div>
		);
	}

	// Generate some dummy timeslots
	const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:30 PM", "04:30 PM"];

	const onSubmit = async () => {
		// Basic validation
		if (!selectedStylist || !date || !selectedTime) return;

		try {
			await createAppointment({
				serviceId: service.id,
				stylistId: selectedStylist,
				date: format(date, "yyyy-MM-dd"),
				time: selectedTime,
			});

			router.push("/dashboard");
			router.refresh();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col">
			<main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
				<Button variant="link" className="mb-6 -ml-4" onClick={() => router.push("/services")} disabled={isSubmitting}>
					<ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
				</Button>

				<form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-[1fr_350px] gap-8">
					<div className="space-y-8">
						<section>
							<h2 className="text-2xl font-bold mb-4">1. Select a Stylist</h2>
							{availableStylists.length === 0 ? (
								<div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
									<p className="text-slate-500">No stylists are currently assigned to perform this service.</p>
								</div>
							) : (
								<div className="grid sm:grid-cols-2 gap-4">
									{availableStylists.map((stylist) => (
										<div
											key={stylist.id}
											onClick={() => setSelectedStylist(stylist.id)}
											className={cn("p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4", selectedStylist === stylist.id ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-200 bg-white")}
										>
											{stylist.image_url ? (
												<img src={stylist.image_url} alt={stylist.name} className="w-12 h-12 rounded-full object-cover" />
											) : (
												<div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
													<Scissors className="w-5 h-5 text-slate-400" />
												</div>
											)}
											<div className="flex-1 min-w-0">
												<h4 className="font-semibold truncate">{stylist.name}</h4>
												<p className="text-sm text-slate-500 truncate">{stylist.description}</p>
											</div>
										</div>
									))}
								</div>
							)}
						</section>

						<section className={cn("transition-opacity", !selectedStylist && "opacity-50 pointer-events-none")}>
							<h2 className="text-2xl font-bold mb-4">2. Choose Date & Time</h2>
							<div className="grid sm:grid-cols-2 gap-8">
								<div>
									<label className="block text-sm font-medium mb-2">Select Date</label>
									<Card className="p-3 inline-block">
										<Calendar mode="single" selected={date} onSelect={setDate} disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} className="rounded-md" />
									</Card>
								</div>

								<div className={cn("transition-opacity", !date && "opacity-50 pointer-events-none")}>
									<label className="block text-sm font-medium mb-2">Available Times</label>
									<div className="grid grid-cols-2 gap-2">
										{timeSlots.map((time) => (
											<Button key={time} type="button" variant={selectedTime === time ? "default" : "outline"} className={cn("w-full", selectedTime === time && "bg-blue-600 hover:bg-blue-700")} onClick={() => setSelectedTime(time)}>
												<Clock className="w-4 h-4 mr-2" />
												{time}
											</Button>
										))}
									</div>
								</div>
							</div>
						</section>
					</div>

					{/* Booking Summary Sidebar */}
					<div>
						<Card className="sticky top-24">
							<CardHeader className="bg-slate-900 text-white rounded-t-xl">
								<CardTitle className="text-lg">Booking Summary</CardTitle>
							</CardHeader>
							<CardContent className="p-6 space-y-4">
								<div className="flex justify-between items-start border-b pb-4">
									<div>
										<h4 className="font-semibold">{service.name}</h4>
										<p className="text-sm text-muted-foreground">{service.duration_minutes} mins</p>
									</div>
									<p className="font-semibold">${service.price.toFixed(2)}</p>
								</div>

								<div className="space-y-3 pt-2">
									<div className="flex items-start gap-3 text-sm">
										<Scissors className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
										<div className="flex flex-col">
											<span className="font-medium text-slate-900">{selectedStylist ? availableStylists.find((s) => s.id === selectedStylist)?.name : "Stylist pending"}</span>
											<span className="text-slate-500 text-xs mt-0.5">{selectedStylist ? availableStylists.find((s) => s.id === selectedStylist)?.description : "Please select a stylist"}</span>
										</div>
									</div>
									<div className="flex items-center gap-3 text-sm">
										<CalendarIcon className="w-5 h-5 text-slate-400" />
										<span>{date ? format(date, "MMM dd, yyyy") : "Date pending"}</span>
									</div>
									<div className="flex items-center gap-3 text-sm">
										<Clock className="w-5 h-5 text-slate-400" />
										<span>{selectedTime ? selectedTime : "Time pending"}</span>
									</div>
								</div>
							</CardContent>
							<CardFooter className="bg-slate-50 rounded-b-xl border-t p-6">
								<Button type="submit" className="w-full h-12 text-base" disabled={!selectedStylist || !date || !selectedTime || isSubmitting}>
									{isSubmitting ? "Confirming..." : "Confirm Appointment"}
								</Button>
							</CardFooter>
						</Card>
					</div>
				</form>
			</main>
		</div>
	);
}
