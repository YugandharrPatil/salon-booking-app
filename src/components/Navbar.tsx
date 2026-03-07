import { Button } from "@/components/ui/button";
import { dummyStylists } from "@/lib/data";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export async function Navbar() {
	const user = await currentUser();
	const isStylist = user?.publicMetadata?.role === "stylist" || (user?.username ? dummyStylists.some((s) => s.username === user.username) : false);

	return (
		<nav className="border-b bg-white/75 backdrop-blur-md sticky top-0 z-50">
			<div className="container mx-auto px-4 h-16 flex items-center justify-between">
				<Link href={isStylist ? "/stylist/dashboard" : "/"} className="font-bold text-xl tracking-tight flex items-center gap-2">
					<span>LuxeSalon</span>
					{isStylist && <span className="bg-blue-100 text-blue-800 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full">Stylist</span>}
				</Link>

				<div className="flex items-center gap-6">
					{!isStylist && (
						<>
							<Link href="/services" className="text-sm font-medium text-slate-600 hover:text-slate-900">
								Services
							</Link>

							{user && (
								<Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
									Dashboard
								</Link>
							)}
						</>
					)}

					{isStylist && (
						<Link href="/stylist/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
							My Schedule
						</Link>
					)}

					<div className="flex items-center gap-4">
						{!user ? (
							<div className="flex items-center gap-2">
								<Link href="/stylist/sign-in">
									<Button variant="ghost" size="sm" className="text-slate-500">
										Stylist Portal
									</Button>
								</Link>
								<SignInButton mode="modal">
									<Button variant="default" size="sm">
										Sign In
									</Button>
								</SignInButton>
							</div>
						) : (
							<UserButton />
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}
