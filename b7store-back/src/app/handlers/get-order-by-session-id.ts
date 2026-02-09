import { db } from '../../database/client';
import { getOrderIdFromSession } from '../providers/payment';

export const getOrderBySessionId = async (sessionId: string) => {
	const orderId = await getOrderIdFromSession(sessionId);
	if (!orderId) {
		return;
	}

	const order = await db.query.orders.findFirst({
		where: (orders, { eq }) => eq(orders.id, orderId),
	});

	return order;
};
