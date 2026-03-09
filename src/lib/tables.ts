// Supabase table names — single source of truth.
// Update the values here whenever you rename tables in the database.

export const TABLES = {
	APPOINTMENTS: "salon_appointments",
	SERVICES: "salon_services",
	STYLISTS: "salon_stylists",
} as const;
