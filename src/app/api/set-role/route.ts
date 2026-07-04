import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const event = await req.json();

	if (event.type === "user.created") {
		const user = event.data;
		const selectedRole = user.publicMetadata?.role || "user";
		const client = await clerkClient();
		await client.users.updateUserMetadata(user.id, { publicMetadata: { role: selectedRole } });
		return NextResponse.json({ ok: true });
	}
}
