import { AppointmentList } from "@/components/appointment-list";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
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
					<SignInButton mode="modal">
						<Button variant="default" size="sm">
							Sign In
						</Button>
					</SignInButton>
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
				<h1 className="text-3xl mb-4 font-bold tracking-tight text-slate-900">Dashboard</h1>
				<div className="flex justify-between items-center mb-8">
					<h2 className="text-xl font-bold tracking-tight text-slate-900">Your Appointments</h2>
					<Button asChild>
						<Link href="/services">Book New Appointment</Link>
					</Button>
				</div>

				<AppointmentList />
			</main>
		</div>
	);
}
