"use server";

import { currentUser, revalidatePath, supabase, TABLES } from "./imports";

export async function createService(data: { name: string; description: string | null; duration_minutes: number; price: number; image_url: string | null }) {
	const user = await currentUser();
	if (!user) throw new Error("Unauthorized");

	const isAdmin = user.publicMetadata?.role === "admin";
	if (!isAdmin) throw new Error("Forbidden");

	const { error } = await supabase.from(TABLES.SERVICES).insert({
		name: data.name,
		description: data.description,
		duration_minutes: data.duration_minutes,
		price: data.price,
		image_url: data.image_url,
	});

	if (error) {
		console.error("Failed to create service:", error);
		throw new Error("Could not create service.");
	}
	revalidatePath("/admin/services");
	revalidatePath("/services");
}

export async function updateService(id: string, data: { name: string; description: string | null; duration_minutes: number; price: number; image_url: string | null }) {
	const user = await currentUser();
	if (!user) throw new Error("Unauthorized");

	const isAdmin = user.publicMetadata?.role === "admin";
	if (!isAdmin) throw new Error("Forbidden");

	const { error } = await supabase
		.from(TABLES.SERVICES)
		.update({
			name: data.name,
			description: data.description,
			duration_minutes: data.duration_minutes,
			price: data.price,
			image_url: data.image_url,
		})
		.eq("id", id);

	if (error) {
		console.error("Failed to update service:", error);
		throw new Error("Could not update service.");
	}
	revalidatePath("/admin/services");
	revalidatePath("/services");
}

export async function deleteService(id: string) {
	const user = await currentUser();
	if (!user) throw new Error("Unauthorized");

	const isAdmin = user.publicMetadata?.role === "admin";
	if (!isAdmin) throw new Error("Forbidden");

	const { error } = await supabase.from(TABLES.SERVICES).delete().eq("id", id);

	if (error) {
		console.error("Failed to delete service:", error);
		throw new Error("Could not delete service.");
	}
	revalidatePath("/admin/services");
	revalidatePath("/services");
}

export async function createStylist(data: { username: string; name: string; password: string; email: string; image_url: string | null; service_ids: string[] }) {
	const user = await currentUser();
	if (!user) throw new Error("Unauthorized");

	const isAdmin = user.publicMetadata?.role === "admin";
	if (!isAdmin) throw new Error("Forbidden");

	// 1. Create the Clerk user with `stylist` role
	const { clerkClient } = await import("@clerk/nextjs/server");
	const clerk = await clerkClient();

	let clerkUser;
	try {
		clerkUser = await clerk.users.createUser({
			username: data.username,
			password: data.password,
			emailAddress: [data.email],
			publicMetadata: { role: "stylist" },
		});
	} catch (err: unknown) {
		console.error("Failed to create Clerk user:", JSON.stringify(err, null, 2));
		const clerkErr = err as { errors?: { message?: string; longMessage?: string }[]; message?: string };
		const msg = clerkErr.errors?.[0]?.longMessage || clerkErr.errors?.[0]?.message || clerkErr.message || "Could not create stylist account in Clerk.";
		throw new Error(msg);
	}

	// 2. Insert the DB record using the username as id (always lowercased to match Clerk's username normalization)
	const { error } = await supabase.from(TABLES.STYLISTS).insert({
		id: data.username.toLowerCase(),
		name: data.name,
		password: data.password,
		image_url: data.image_url,
		service_ids: data.service_ids,
	});

	if (error) {
		console.error("Failed to create stylist in DB:", error);
		// Attempt to clean up the Clerk user we just created
		try {
			await clerk.users.deleteUser(clerkUser.id);
		} catch (cleanupErr) {
			console.error("Failed to clean up Clerk user:", cleanupErr);
		}
		throw new Error("Could not create stylist profile.");
	}

	revalidatePath("/admin/stylists");
	revalidatePath("/stylists");
}

export async function updateStylist(id: string, data: { name: string; image_url: string | null; service_ids: string[] }) {
	const user = await currentUser();
	if (!user) throw new Error("Unauthorized");

	const isAdmin = user.publicMetadata?.role === "admin";
	if (!isAdmin) throw new Error("Forbidden");

	const { error } = await supabase
		.from(TABLES.STYLISTS)
		.update({
			name: data.name,
			image_url: data.image_url,
			service_ids: data.service_ids,
		})
		.eq("id", id);

	if (error) {
		console.error("Failed to update stylist:", error);
		throw new Error("Could not update stylist.");
	}
	revalidatePath("/admin/stylists");
	revalidatePath("/stylists");
}

export async function deleteStylist(id: string) {
	const user = await currentUser();
	if (!user) throw new Error("Unauthorized");

	const isAdmin = user.publicMetadata?.role === "admin";
	if (!isAdmin) throw new Error("Forbidden");

	// Delete from Supabase
	const { error } = await supabase.from(TABLES.STYLISTS).delete().eq("id", id);

	if (error) {
		console.error("Failed to delete stylist:", error);
		throw new Error("Could not delete stylist.");
	}

	// Try to also delete the Clerk user (best-effort since the username might not map to a Clerk user directly)
	try {
		const { clerkClient } = await import("@clerk/nextjs/server");
		const clerk = await clerkClient();
		const users = await clerk.users.getUserList({ username: [id] });
		if (users.data.length > 0) {
			await clerk.users.deleteUser(users.data[0].id);
		}
	} catch (err) {
		console.error("Could not delete corresponding Clerk user (non-critical):", err);
	}

	revalidatePath("/admin/stylists");
	revalidatePath("/stylists");
}
