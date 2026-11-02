CREATE TABLE "shopping_list_checks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "week_start" date NOT NULL,
  "item" text NOT NULL,
  "unit" text DEFAULT '' NOT NULL,
  "checked" boolean DEFAULT true NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX "shopping_list_checks_unique" ON "shopping_list_checks" ("week_start","item","unit");
