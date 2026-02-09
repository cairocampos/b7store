ALTER TABLE "products" ALTER COLUMN "views_count" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "views_count" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "sales_count" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "sales_count" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "updated_at" SET DEFAULT now();