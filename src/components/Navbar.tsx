import { Button } from "@/components/ui/button";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export async function Navbar() {
	const user = await currentUser();
	const isStylist = user?.publicMetadata?.role === "stylist";
	const isAdmin = user?.publicMetadata?.role === "admin" || user?.username === "johncarmack";

	return (
		<nav className="border-b bg-white/75 backdrop-blur-md sticky top-0 z-50">
			<div className="container mx-auto px-4 h-16 flex items-center justify-between">
				<Link href={isAdmin ? "/admin/dashboard" : isStylist ? "/stylist/dashboard" : "/"} className="font-bold text-xl tracking-tight flex items-center gap-2">
					<span>LuxeSalon</span>
					{isStylist && !isAdmin && <span className="bg-blue-100 text-blue-800 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full">Stylist</span>}
					{isAdmin && <span className="bg-purple-100 text-purple-800 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full">Admin</span>}
				</Link>

				<div className="flex items-center gap-6">
					{!isStylist && !isAdmin && (
						<>
							<Link href="/services" className="text-sm font-medium text-slate-600 hover:text-slate-900">
								Services
							</Link>
							<Link href="/stylists" className="text-sm font-medium text-slate-600 hover:text-slate-900">
								Stylists
							</Link>

							{user && (
								<Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
									Dashboard
								</Link>
							)}
						</>
					)}

					{isStylist && !isAdmin && (
						<Link href="/stylist/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
							My Schedule
						</Link>
					)}

					{isAdmin && (
						<>
							<Link href="/admin/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
								Admin Console
							</Link>
							<Link href="/admin/services" className="text-sm font-medium text-slate-600 hover:text-slate-900">
								Manage Services
							</Link>
							<Link href="/admin/stylists" className="text-sm font-medium text-slate-600 hover:text-slate-900">
								Manage Stylists
							</Link>
						</>
					)}

					<div className="flex items-center gap-4">
						{!user ? (
							<div className="flex items-center gap-2">
								<Link href="/stylist/sign-in">
									<Button variant="ghost" size="sm" className="text-slate-500 hidden sm:inline-flex">
										Stylist Portal
									</Button>
								</Link>
								<Link href="/admin">
									<Button variant="ghost" size="sm" className="text-slate-500 hidden sm:inline-flex">
										Admin
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
