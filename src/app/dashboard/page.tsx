import { AppointmentList } from "@/components/AppointmentList";
import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
	const user = await currentUser();

	if (!user) {
		return (
			<div className="min-h-screen bg-slate-50 flex flex-col">
				<div className="container mx-auto px-4 py-12 text-center">
					<h2 className="text-2xl font-bold mb-4">You need to sign in to view this page</h2>
					<Button asChild>
						<Link href="/sign-in">Sign In</Link>
					</Button>
				</div>
			</div>
		);
	}

	const isStylist = user?.publicMetadata?.role === "stylist";
	if (isStylist) {
		redirect("/stylist/dashboard");
	}

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col">
			<main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold tracking-tight text-slate-900">Your Appointments</h1>
					<Button asChild>
						<Link href="/services">Book New Appointment</Link>
					</Button>
				</div>

				<AppointmentList />
			</main>
		</div>
	);
}
