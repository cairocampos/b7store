import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { categories } from './categories';
import { metadataValues } from './metadata-values';

export const categoriesMetadata = pgTable('categories_metadata', {
	id: varchar('id').primaryKey(),
	categoryId: text('category_id')
		.notNull()
		.references(() => categories.id, { onDelete: 'cascade' }),
	name: varchar(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.$onUpdate(() => new Date())
		.notNull(),
});

export const categoriesMetadataRelations = relations(
	categoriesMetadata,
	({ many, one }) => ({
		values: many(metadataValues, { relationName: 'metadataValues' }),
		cateogry: one(categories, {
			fields: [categoriesMetadata.categoryId],
			references: [categories.id],
			relationName: 'categoryMetadata',
		}),
	}),
);
