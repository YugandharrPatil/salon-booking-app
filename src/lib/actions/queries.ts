"use server";

import { db } from "@/db/drizzle";
import { salonAppointments, salonServices, salonStylists } from "@/db/schema";
import { and, asc, desc, eq, isNotNull, sql } from "drizzle-orm";

// Fetch all services ordered by name
export async function getServices() {
	try {
		return await db.select().from(salonServices).orderBy(asc(salonServices.name));
	} catch (error) {
		console.error("Error in getServices server action:", error);
		throw new Error("Failed to fetch services.");
	}
}

// Fetch a service by its ID
export async function getServiceById(id: string) {
	try {
		const results = await db.select().from(salonServices).where(eq(salonServices.id, id)).limit(1);
		return results[0] || null;
	} catch (error) {
		console.error(`Error in getServiceById(${id}):`, error);
		throw new Error("Failed to fetch service details.");
	}
}

// Fetch all stylists ordered by name
export async function getStylists() {
	try {
		return await db.select().from(salonStylists).orderBy(asc(salonStylists.name));
	} catch (error) {
		console.error("Error in getStylists server action:", error);
		throw new Error("Failed to fetch stylists.");
	}
}

// Fetch a stylist by ID
export async function getStylistById(id: string) {
	try {
		const results = await db.select().from(salonStylists).where(eq(salonStylists.id, id)).limit(1);
		return results[0] || null;
	} catch (error) {
		console.error(`Error in getStylistById(${id}):`, error);
		throw new Error("Failed to fetch stylist profile.");
	}
}

// Fetch stylists that support a specific service
export async function getAvailableStylistsForService(serviceId: string) {
	try {
		// SQLite JSON array contains check
		return await db.select().from(salonStylists).where(
			sql`exists (
				select 1 from json_each(${salonStylists.serviceIds}) 
				where json_each.value = ${serviceId}
			)`
		);
	} catch (error) {
		console.error(`Error in getAvailableStylistsForService(${serviceId}):`, error);
		throw new Error("Failed to fetch available stylists for service.");
	}
}

// Fetch all appointments ordered by date
export async function getAllAppointments() {
	try {
		return await db.select().from(salonAppointments).orderBy(asc(salonAppointments.date));
	} catch (error) {
		console.error("Error in getAllAppointments server action:", error);
		throw new Error("Failed to fetch appointments.");
	}
}

// Fetch appointments for a specific user
export async function getAppointmentsForUser(userId: string) {
	try {
		return await db.select().from(salonAppointments).where(eq(salonAppointments.userId, userId));
	} catch (error) {
		console.error(`Error in getAppointmentsForUser(${userId}):`, error);
		throw new Error("Failed to fetch appointments for user.");
	}
}

// Fetch appointments for a specific stylist
export async function getAppointmentsForStylist(username: string) {
	try {
		return await db
			.select()
			.from(salonAppointments)
			.where(eq(salonAppointments.stylistId, username.toLowerCase()));
	} catch (error) {
		console.error(`Error in getAppointmentsForStylist(${username}):`, error);
		throw new Error("Failed to fetch appointments for stylist.");
	}
}

// Fetch all reviews for a stylist (appointments with a rating)
export async function getReviewsForStylist(stylistId: string) {
	try {
		return await db
			.select()
			.from(salonAppointments)
			.where(and(eq(salonAppointments.stylistId, stylistId), isNotNull(salonAppointments.rating)))
			.orderBy(desc(salonAppointments.date));
	} catch (error) {
		console.error(`Error in getReviewsForStylist(${stylistId}):`, error);
		throw new Error("Failed to fetch reviews for stylist.");
	}
}

// Fetch all rating values for stylists (to calculate average ratings)
export async function getRatingsList() {
	try {
		return await db
			.select({
				stylistId: salonAppointments.stylistId,
				rating: salonAppointments.rating,
			})
			.from(salonAppointments)
			.where(isNotNull(salonAppointments.rating));
	} catch (error) {
		console.error("Error in getRatingsList server action:", error);
		throw new Error("Failed to fetch ratings list.");
	}
}

// Lookup map for services
export async function getServicesMap() {
	try {
		const services = await db.select().from(salonServices);
		const map: Record<string, typeof services[number]> = {};
		services.forEach((s) => {
			map[s.id] = s;
		});
		return map;
	} catch (error) {
		console.error("Error in getServicesMap server action:", error);
		throw new Error("Failed to build services map.");
	}
}

// Lookup map for stylists
export async function getStylistsMap() {
	try {
		const stylists = await db.select().from(salonStylists);
		const map: Record<string, typeof stylists[number]> = {};
		stylists.forEach((s) => {
			map[s.id] = s;
		});
		return map;
	} catch (error) {
		console.error("Error in getStylistsMap server action:", error);
		throw new Error("Failed to build stylists map.");
	}
}

// Fetch appointment by ID
export async function getAppointmentById(id: string) {
	try {
		const results = await db.select().from(salonAppointments).where(eq(salonAppointments.id, id)).limit(1);
		return results[0] || null;
	} catch (error) {
		console.error(`Error in getAppointmentById(${id}):`, error);
		throw new Error("Failed to fetch appointment details.");
	}
}
