import { randomUUIDv7 } from 'bun';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const banners = pgTable('banners', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => randomUUIDv7()),
	image: text(),
	link: text(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.$onUpdate(() => new Date())
		.notNull(),
});
