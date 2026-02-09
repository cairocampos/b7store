import { randomUUIDv7 } from 'bun';
import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { categoriesMetadata } from './categories-metadata';

export const categories = pgTable('categories', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => randomUUIDv7()),
	slug: varchar().unique(),
	name: text(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.$onUpdate(() => new Date())
		.notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
	metadata: many(categoriesMetadata, {
		relationName: 'categoryMetadata',
	}),
}));
