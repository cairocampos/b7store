import { eq } from 'drizzle-orm';
import { db } from '../../database/client';
import { orders } from '../../database/schema/orders';

type UpdateOrderStatusData = {
	orderId: string;
	status: 'paid' | 'cancelled';
};

export const updateOrderStatus = async ({
	orderId,
	status,
}: UpdateOrderStatusData) => {
	await db.update(orders).set({ status }).where(eq(orders.id, orderId));
};
