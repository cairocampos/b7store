ALTER TABLE "order_items" ALTER COLUMN "price" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "updated_at" SET DEFAULT now();