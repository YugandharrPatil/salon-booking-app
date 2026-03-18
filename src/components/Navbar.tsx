"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavLink from "./nav-link";

const LINKS = {
	user: [
		{
			id: 1,
			label: "Dashboard",
			href: "/dashboard",
		},
		{
			id: 2,
			label: "Stylists",
			href: "/stylists",
		},
		{
			id: 3,
			label: "Services",
			href: "/services",
		},
	],
	admin: [
		{
			id: 1,
			label: "Dashboard",
			href: "/admin/dashboard",
		},
		{
			id: 2,
			label: "Manage Services",
			href: "/admin/services",
		},
		{
			id: 3,
			label: "Manage Stylists",
			href: "/admin/stylists",
		},
	],
	stylist: [
		{
			id: 1,
			label: "My Schedule",
			href: "/stylist/dashboard",
		},
	],
	guest: [
		{
			id: 1,
			label: "Admin Portal",
			href: "/admin/sign-in",
		},
		{
			id: 2,
			label: "Stylist Portal",
			href: "/stylist/sign-in",
		},
		{
			id: 3,
			label: "Sign In",
			href: "/sign-in",
		},
	],
};

export default function Navbar() {
	const pathname = usePathname();
	const { user, isSignedIn, isLoaded } = useUser();
	if (!isLoaded) return null;

	const isAdmin = user?.publicMetadata?.role === "admin" && isSignedIn;
	const isStylist = user?.publicMetadata?.role === "stylist" && isSignedIn;
	const isUser = isSignedIn && !isStylist && !isAdmin;

	return (
		<nav className="border-b bg-white/75 backdrop-blur-md sticky top-0 z-50">
			<div className="container mx-auto px-4 h-16 flex items-center justify-between">
				{/* LEFT LOGO LINK */}
				<Link href={isAdmin ? "/admin/dashboard" : isStylist ? "/stylist/dashboard" : isUser ? "/dashboard" : "/"} className="font-bold text-xl tracking-tight flex items-center gap-2">
					<span>LuxeSalon</span>
					{isAdmin && <span className="bg-purple-100 text-purple-800 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full">Admin</span>}
					{isStylist && <span className="bg-blue-100 text-blue-800 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full">Stylist</span>}
				</Link>

				<div className="flex items-center gap-2">
					{(isUser ? LINKS.user : isStylist ? LINKS.stylist : isAdmin ? LINKS.admin : !isSignedIn ? LINKS.guest : []).map((link) => (
						<NavLink key={link.id} label={link.label} href={link.href} isActive={pathname === link.href} />
					))}
					{isSignedIn && <UserButton />}
				</div>
			</div>
		</nav>
	);
}
