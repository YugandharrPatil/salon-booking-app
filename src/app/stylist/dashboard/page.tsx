import { StylistAppointments } from "@/components/StylistAppointments";
import { dummyStylists } from "@/lib/data";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function StylistDashboardPage() {
	const user = await currentUser();

	if (!user) {
		redirect("/stylist/sign-in");
	}

	// Verify they actually have the stylist role in publicMetadata
	const isStylist = user?.publicMetadata?.role === "stylist" || (user?.username ? dummyStylists.some((s) => s.username === user.username) : false);
	if (!isStylist) {
		redirect("/dashboard");
	}

	// Ensure user.username exists since we are passing it to StylistAppointments
	const username = user.username;
	if (!username) {
		console.error("Stylist user has no username. Roles misconfigured.");
		redirect("/dashboard");
	}

	return <StylistAppointments username={username} />;
}
