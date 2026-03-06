import { Button } from "@/components/ui/button";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export async function Navbar() {
	const { userId } = await auth();

	return (
		<nav className="border-b bg-white/75 backdrop-blur-md sticky top-0 z-50">
			<div className="container mx-auto px-4 h-16 flex items-center justify-between">
				<Link href="/" className="font-bold text-xl tracking-tight">
					LuxeSalon
				</Link>

				<div className="flex items-center gap-6">
					<Link href="/services" className="text-sm font-medium text-slate-600 hover:text-slate-900">
						Services
					</Link>
					{userId && (
						<Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
							Dashboard
						</Link>
					)}

					<div className="flex items-center gap-4">
						{!userId ? (
							<SignInButton mode="modal">
								<Button variant="default" size="sm">
									Sign In
								</Button>
							</SignInButton>
						) : (
							<UserButton />
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}
