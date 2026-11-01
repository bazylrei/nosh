CREATE TABLE "meal_slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"day" integer NOT NULL,
	"meal_type" text NOT NULL,
	"recipe_id" uuid NOT NULL,
	"serves" integer DEFAULT 2 NOT NULL,
	"week_start" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"cuisine" text NOT NULL,
	"meal_type" text[] DEFAULT '{}' NOT NULL,
	"dietary" text[] DEFAULT '{}' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"serves" integer DEFAULT 2 NOT NULL,
	"is_custom" boolean DEFAULT false NOT NULL,
	"ingredients" jsonb NOT NULL,
	"method" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"dietary" text[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "meal_slots" ADD CONSTRAINT "meal_slots_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;