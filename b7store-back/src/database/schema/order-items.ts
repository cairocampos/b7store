import { randomUUIDv7 } from 'bun';
import { relations } from 'drizzle-orm';
import {
	decimal,
	integer,
	pgTable,
	text,
	timestamp,
} from 'drizzle-orm/pg-core';
import { orders } from './orders';
import { products } from './products';

export const orderItems = pgTable('order_items', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => randomUUIDv7()),
	orderId: text('order_id')
		.notNull()
		.references(() => orders.id, { onDelete: 'cascade' }),
	productId: text('product_id')
		.notNull()
		.references(() => products.id, { onDelete: 'cascade' }),
	quantity: integer(),
	price: decimal({ scale: 2, precision: 10, mode: 'number' }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.$onUpdate(() => new Date())
		.defaultNow()
		.notNull(),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
	product: one(products, {
		fields: [orderItems.productId],
		references: [products.id],
	}),
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id],
		relationName: 'orderItems',
	}),
}));
