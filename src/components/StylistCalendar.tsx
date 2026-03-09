"use client";

import { supabase } from "@/lib/supabase";
import { TABLES } from "@/lib/tables";
import { useQuery } from "@tanstack/react-query";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { enUS } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Setup the localizer for react-big-calendar
const locales = {
	"en-US": enUS,
};

const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales,
});

interface Service {
	id: string;
	name: string;
	duration_minutes: number;
}

export function StylistCalendar({ username }: { username: string }) {
	const router = useRouter();
	const [view, setView] = useState<any>("week");
	const [date, setDate] = useState(new Date());

	// Fetch services lookup map
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

	const {
		data: appointments,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["appointments", username],
		queryFn: async () => {
			const { data, error } = await supabase.from(TABLES.APPOINTMENTS).select("*").eq("stylist_id", username);
			if (error && error.code !== "PGRST116") throw error;

			return (data || []).map((apt: any) => {
				// Parse date and time into a single Date object for Calendar
				const [hours, minutes] = apt.time.split(":");
				const start = new Date(apt.date);
				start.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);

				const end = new Date(start);
				const service = servicesMap?.[apt.service_id];
				const duration = service?.duration_minutes || 45;
				end.setMinutes(start.getMinutes() + duration);

				return {
					id: apt.id,
					title: service?.name || "Service Appointment",
					start,
					end,
					resource: apt.status,
				};
			});
		},
		enabled: !!servicesMap, // Only run after services are loaded
	});

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-20 text-slate-500 bg-white rounded-xl border border-slate-200">
				<Loader2 className="w-8 h-8 animate-spin" />
				<span className="ml-3">Loading your calendar...</span>
			</div>
		);
	}

	if (error) {
		return <div className="text-center py-10 bg-red-50 text-red-600 rounded-xl border border-red-200">Failed to load calendar appointments.</div>;
	}

	return (
		<div className="h-[600px] bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
			<Calendar
				localizer={localizer}
				events={appointments || []}
				startAccessor="start"
				endAccessor="end"
				style={{ height: "100%" }}
				views={["month", "week", "day", "agenda"]}
				view={view}
				onView={(newView) => setView(newView)}
				date={date}
				onNavigate={(newDate) => setDate(newDate)}
				onSelectEvent={(event: any) => {
					router.push(`/stylist/dashboard/appointments/${event.id}`);
				}}
				eventPropGetter={(event: any) => {
					const isPending = event.resource === "pending";
					return {
						className: isPending ? "bg-amber-100 border-l-4 border-l-amber-500 text-amber-900" : "bg-blue-100 border-l-4 border-l-blue-600 text-blue-900 border-none rounded-sm shadow-sm",
						style: {
							minHeight: "40px",
							padding: "4px",
						},
					};
				}}
				formats={{
					eventTimeRangeFormat: () => "", // Hide time slot text inside the event card
				}}
			/>
		</div>
	);
}
