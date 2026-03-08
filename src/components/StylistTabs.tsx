"use client";

import { Calendar as CalendarIcon, LayoutList } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function StylistTabs() {
	const pathname = usePathname();
	const isCalendar = pathname === "/stylist/dashboard/calendar";

	return (
		<div className="flex items-center gap-2 p-1 bg-slate-200/50 rounded-lg w-fit">
			<Link href="/stylist/dashboard" className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${!isCalendar ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"}`}>
				<LayoutList className="w-4 h-4" />
				List View
			</Link>
			<Link
				href="/stylist/dashboard/calendar"
				className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${isCalendar ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"}`}
			>
				<CalendarIcon className="w-4 h-4" />
				Calendar View
			</Link>
		</div>
	);
}
