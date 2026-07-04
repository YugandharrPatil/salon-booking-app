"use server";

import { and, eq } from "drizzle-orm";
import { currentUser, db, revalidatePath, salonAppointments } from "./imports";

export async function createAppointment(data: { serviceId: string; stylistId: string; date: string; time: string }) {
	const user = await currentUser();

	if (!user) {
		throw new Error("Unauthorized");
	}

	const customerName = user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user.username || user.emailAddresses[0]?.emailAddress || "Guest";

	try {
		await db.insert(salonAppointments).values({
			userId: user.id,
			customerName: customerName,
			serviceId: data.serviceId,
			stylistId: data.stylistId,
			date: data.date,
			time: data.time,
			status: "pending",
		});
	} catch (error) {
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

	try {
		await db
			.delete(salonAppointments)
			.where(and(eq(salonAppointments.id, id), eq(salonAppointments.userId, user.id)));
	} catch (error) {
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

	try {
		await db
			.update(salonAppointments)
			.set({ status: "completed" })
			.where(and(eq(salonAppointments.id, id), eq(salonAppointments.userId, user.id)));
	} catch (error) {
		console.error("Failed to complete appointment:", error);
		throw new Error("Could not mark appointment as completed.");
	}

	revalidatePath("/dashboard");
}

export async function submitStylistReview(appointmentId: string, rating: number, review: string) {
	const user = await currentUser();
	if (!user) throw new Error("Unauthorized");

	try {
		await db
			.update(salonAppointments)
			.set({
				rating: rating,
				review: review,
				status: "completed",
			})
			.where(and(eq(salonAppointments.id, appointmentId), eq(salonAppointments.userId, user.id)));
	} catch (updateError) {
		console.error("Failed submitting appointment review:", updateError);
		throw new Error("Could not submit review.");
	}
}
