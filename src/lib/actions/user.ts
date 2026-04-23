"use server";

import { currentUser, revalidatePath, supabase, TABLES } from "./imports";

export async function createAppointment(data: { serviceId: string; stylistId: string; date: string; time: string }) {
	const user = await currentUser();

	if (!user) {
		throw new Error("Unauthorized");
	}

	const customerName = user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user.username || user.emailAddresses[0]?.emailAddress || "Guest"; // TODO: Guest cannot access this page

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
