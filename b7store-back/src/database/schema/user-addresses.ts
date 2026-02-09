import { randomUUIDv7 } from 'bun';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const userAddresses = pgTable('user_addresses', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => randomUUIDv7()),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	zipcode: text().notNull(),
	street: text().notNull(),
	number: text().notNull(),
	city: text().notNull(),
	state: text().notNull(),
	country: text().notNull(),
	complement: text(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.$onUpdate(() => new Date())
		.notNull(),
});
