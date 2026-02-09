import { randomUUIDv7 } from 'bun';
import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { categoriesMetadata } from './categories-metadata';
import { metadataValues } from './metadata-values';
import { products } from './products';

export const productsMetadata = pgTable('products_metadata', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => randomUUIDv7()),
	productId: text('product_id')
		.notNull()
		.references(() => products.id, { onDelete: 'cascade' }),
	categoryMetadataId: text('category_metadata_id')
		.notNull()
		.references(() => categoriesMetadata.id, { onDelete: 'cascade' }),
	metadataValueId: text('metadata_value_id')
		.notNull()
		.references(() => metadataValues.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.$onUpdate(() => new Date())
		.notNull(),
});

export const productsMetadataRelations = relations(
	productsMetadata,
	({ one }) => ({
		product: one(products, {
			fields: [productsMetadata.productId],
			references: [products.id],
			relationName: 'productMetadata',
		}),
	}),
);
