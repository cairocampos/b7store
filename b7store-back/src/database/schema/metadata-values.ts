import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { categoriesMetadata } from './categories-metadata';

export const metadataValues = pgTable('metadata_values', {
	id: varchar('id').primaryKey(),
	categoryMetadataId: text('category_metadata_id')
		.notNull()
		.references(() => categoriesMetadata.id, { onDelete: 'cascade' }),
	label: varchar(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.$onUpdate(() => new Date())
		.notNull(),
});

export const metadataValuesRelations = relations(metadataValues, ({ one }) => ({
	categoryMetadata: one(categoriesMetadata, {
		fields: [metadataValues.categoryMetadataId],
		references: [categoriesMetadata.id],
		relationName: 'metadataValues',
	}),
}));
