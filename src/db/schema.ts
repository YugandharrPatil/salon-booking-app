import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const salonAppointments = sqliteTable("salon_appointments", {
	id: text("id")
		.primaryKey()
		.notNull()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text("user_id").notNull(),
	serviceId: text("service_id").notNull(),
	stylistId: text("stylist_id").notNull(),
	date: text("date").notNull(),
	time: text("time").notNull(),
	status: text("status").default("pending"),
	customerName: text("customer_name"),
	rating: integer("rating"),
	review: text("review"),
});

export const salonServices = sqliteTable("salon_services", {
	id: text("id")
		.primaryKey()
		.notNull()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	description: text("description"),
	durationMinutes: integer("duration_minutes").notNull(),
	price: real("price").default(0.00).notNull(),
	imageUrl: text("image_url"),
	createdAt: text("created_at")
		.default(sql`(CURRENT_TIMESTAMP)`)
		.notNull(),
});

export const salonStylists = sqliteTable("salon_stylists", {
	id: text("id").primaryKey().notNull(), // uses Clerk username as ID
	name: text("name").notNull(),
	imageUrl: text("image_url"),
	serviceIds: text("service_ids", { mode: "json" }).$type<string[]>().default([]),
	password: text("password"),
	description: text("description").default("Expert Stylist"),
});
