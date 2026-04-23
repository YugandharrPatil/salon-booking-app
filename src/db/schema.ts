import { sql } from "drizzle-orm";
import { integer, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const salonAppointments = pgTable("salon_appointments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	serviceId: text("service_id").notNull(),
	stylistId: text("stylist_id").notNull(),
	date: text().notNull(),
	time: text().notNull(),
	status: text().default("pending"),
	customerName: text("customer_name"),
	rating: integer(),
	review: text(),
});

export const salonServices = pgTable("salon_services", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	durationMinutes: integer("duration_minutes").notNull(),
	price: numeric({ precision: 10, scale: 2 }).default("0.00").notNull(),
	imageUrl: text("image_url"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
		.default(sql`timezone('utc'::text, now())`)
		.notNull(),
});

export const salonStylists = pgTable("salon_stylists", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	imageUrl: text("image_url"),
	serviceIds: uuid("service_ids").array().default([""]),
	password: text(),
	description: text().default("Expert Stylist"),
});
