-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."property_status" AS ENUM('available', 'sold', 'pending');--> statement-breakpoint
CREATE TYPE "public"."property_type" AS ENUM('house', 'apartment', 'condo', 'townhouse', 'land', 'commercial');--> statement-breakpoint
CREATE TYPE "public"."sender_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."visit_status" AS ENUM('pending', 'confirmed', 'cancelled');--> statement-breakpoint
CREATE SEQUENCE "public"."pet_messages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."agency_projects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."agency_messages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE TABLE "salon_appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"service_id" text NOT NULL,
	"stylist_id" text NOT NULL,
	"date" text NOT NULL,
	"time" text NOT NULL,
	"status" text DEFAULT 'pending',
	"customer_name" text,
	"rating" integer,
	"review" text
);
--> statement-breakpoint
CREATE TABLE "salon_services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"duration_minutes" integer NOT NULL,
	"price" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "salon_stylists" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image_url" text,
	"service_ids" uuid[] DEFAULT '{""}',
	"password" text
);

*/