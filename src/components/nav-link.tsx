import Link from "next/link";
import { Button } from "./ui/button";

type NavLinkProps = {
	label: string;
	href: string;
	isActive?: boolean;
};

export default function NavLink({ label, href, isActive }: NavLinkProps) {
	return (
		<Button asChild variant={isActive ? "outline" : "ghost"}>
			<Link href={href}>{label}</Link>
		</Button>
	);
}
