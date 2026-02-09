import { desc, eq } from 'drizzle-orm';
import { db } from '../../database/client';
import { orders } from '../../database/schema/orders';

export const getUserOrders = async (userId: string) => {
	return db
		.select({
			id: orders.id,
			status: orders.status,
			total: orders.total,
			createdAt: orders.createdAt,
		})
		.from(orders)
		.where(eq(orders.userId, userId))
		.orderBy(desc(orders.createdAt));
};
