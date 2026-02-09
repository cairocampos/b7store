import { randomUUIDv7 } from 'bun';
import { relations } from 'drizzle-orm';
import {
	decimal,
	integer,
	pgTable,
	text,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';
import { categories } from './categories';
import { productImages } from './product-images';
import { productsMetadata } from './products-metadata';

export const products = pgTable('products', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => randomUUIDv7()),
	label: varchar().notNull(),
	price: decimal({ scale: 2, precision: 10, mode: 'number' }).notNull(),
	description: text(),
	categoryId: text('category_id')
		.notNull()
		.references(() => categories.id, { onDelete: 'cascade' }),
	viewsCount: integer('views_count').default(0).notNull(),
	salesCount: integer('sales_count').default(0).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const productsRelations = relations(products, ({ many, one }) => ({
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id],
	}),
	images: many(productImages, { relationName: 'productImages' }),
	metadata: many(productsMetadata, { relationName: 'productMetadata' }),
}));
