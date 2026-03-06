"use server";

import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createAppointment(data: { serviceId: string; stylistId: string; date: string; time: string }) {
	const session = await auth();
	const userId = session?.userId;

	if (!userId) {
		throw new Error("Unauthorized");
	}

	const { error } = await supabase.from("appointments").insert({
		user_id: userId,
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
	const session = await auth();
	const userId = session?.userId;

	if (!userId) {
		throw new Error("Unauthorized");
	}

	const { error } = await supabase.from("appointments").delete().eq("id", id).eq("user_id", userId);

	if (error) {
		console.error("Failed to delete appointment:", error);
		throw new Error("Could not cancel appointment. Please try again.");
	}

	revalidatePath("/dashboard");
}
