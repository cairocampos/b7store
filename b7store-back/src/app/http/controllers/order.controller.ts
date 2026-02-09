import Elysia from 'elysia';
import z from 'zod';
import { getOrderById } from '../../handlers/get-order-by-id';
import { getOrderBySessionId } from '../../handlers/get-order-by-session-id';
import { getUserOrders } from '../../handlers/get-user-orders';
import { bettherAuthMiddleware } from '../middlewares/better-auth';

export const orderController = new Elysia({ prefix: '/orders' })
	.use(bettherAuthMiddleware)
	.get(
		'',
		async ({ user }) => {
			const result = await getUserOrders(user.id);
			return result;
		},
		{
			auth: true,
		},
	)
	.get(
		'/:id',
		async ({ params, status }) => {
			const result = await getOrderById(params.id);
			if (!result) {
				return status(404, { message: 'Order not found' });
			}
			return result;
		},
		{
			params: z.object({
				id: z.string(),
			}),
		},
	)
	.get(
		'/session',
		async ({ query, status }) => {
			const { sessionId } = query;
			const result = await getOrderBySessionId(sessionId);

			if (!result) {
				return status(404, { message: 'Ocorreu um erro' });
			}
		},
		{
			query: z.object({
				sessionId: z.string(),
			}),
		},
	);
