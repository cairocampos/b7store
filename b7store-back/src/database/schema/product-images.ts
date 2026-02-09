import { randomUUIDv7 } from 'bun';
import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { products } from './products';

export const productImages = pgTable('product_images', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => randomUUIDv7()),
	productId: text('product_id')
		.notNull()
		.references(() => products.id, { onDelete: 'cascade' }),
	url: text(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.$onUpdate(() => new Date())
		.notNull(),
});

export const productImagesRelations = relations(productImages, ({ one }) => ({
	product: one(products, {
		fields: [productImages.productId],
		references: [products.id],
		relationName: 'productImages',
	}),
}));
