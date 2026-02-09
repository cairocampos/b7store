import { randomUUIDv7 } from 'bun';
import { relations } from 'drizzle-orm';
import {
	decimal,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from 'drizzle-orm/pg-core';
import { orderItems } from './order-items';
import { users } from './users';

export const orderStatusEnum = pgEnum('status', [
	'pending',
	'approved',
	'cancelled',
	'paid',
]);

export const orders = pgTable('orders', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => randomUUIDv7()),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	status: orderStatusEnum().default('pending').notNull(),
	total: decimal({ scale: 2, precision: 10, mode: 'number' }),
	shippingCost: decimal('shipping_cost', {
		scale: 2,
		precision: 10,
		mode: 'number',
	}),
	shippingDays: integer('shipping_days'),
	shippingZipcode: text('shipping_zipcode'),
	shippingStreet: text('shipping_street'),
	shippingNumber: text('shipping_number'),
	shippingCity: text('shipping_city'),
	shippingState: text('shipping_state'),
	shippingCountry: text('shipping_country'),
	shippingComplement: text('shipping_complement'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.$onUpdate(() => new Date())
		.defaultNow()
		.notNull(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
	user: one(users, {
		fields: [orders.userId],
		references: [users.id],
	}),
	orderItems: many(orderItems, { relationName: 'orderItems' }),
}));
