import { StylistCalendar } from "@/components/StylistCalendar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function StylistDashboardCalendarPage() {
	const user = await currentUser();

	if (!user || !user.username) {
		redirect("/dashboard");
	}

	return <StylistCalendar username={user.username} />;
}
