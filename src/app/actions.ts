"use server";

import { supabase } from "@/lib/supabase";
import { TABLES } from "@/lib/tables";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createAppointment(data: { serviceId: string; stylistId: string; date: string; time: string }) {
	const user = await currentUser();

	if (!user) {
		throw new Error("Unauthorized");
	}

	const customerName = user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user.username || user.emailAddresses[0]?.emailAddress || "Guest";

	const { error } = await supabase.from(TABLES.APPOINTMENTS).insert({
		user_id: user.id,
		customer_name: customerName,
		service_id: data.serviceId,
		stylist_id: data.stylistId,
		date: data.date,
		time: data.time,
		status: "pending",
	});

	if (error) {
		console.error("Failed to create appointment:", error);
		throw new Error("Could not schedule appointment. Please try again.");
	}

	revalidatePath("/dashboard");
}

export async function deleteAppointment(id: string) {
	const user = await currentUser();

	if (!user) {
		throw new Error("Unauthorized");
	}

	const { error } = await supabase.from(TABLES.APPOINTMENTS).delete().eq("id", id).eq("user_id", user.id);

	if (error) {
		console.error("Failed to delete appointment:", error);
		throw new Error("Could not cancel appointment. Please try again.");
	}

	revalidatePath("/dashboard");
}

export async function completeAppointment(id: string) {
	const user = await currentUser();

	if (!user) {
		throw new Error("Unauthorized");
	}

	const { error } = await supabase.from(TABLES.APPOINTMENTS).update({ status: "completed" }).eq("id", id).eq("user_id", user.id);

	if (error) {
		console.error("Failed to complete appointment:", error);
		throw new Error("Could not mark appointment as completed.");
	}

	revalidatePath("/dashboard");
}

export async function submitStylistReview(appointmentId: string, rating: number, review: string) {
	const user = await currentUser();
	if (!user) throw new Error("Unauthorized");

	const { error: updateError } = await supabase
		.from(TABLES.APPOINTMENTS)
		.update({
			rating: rating,
			review: review,
			status: "completed",
		})
		.eq("id", appointmentId)
		.eq("user_id", user.id);

	if (updateError) {
		console.error("Failed submitting appointment review:", updateError);
		throw new Error("Could not submit review.");
	}
}

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

	// 2. Insert the DB record using the username as id
	const { error } = await supabase.from(TABLES.STYLISTS).insert({
		id: data.username,
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
