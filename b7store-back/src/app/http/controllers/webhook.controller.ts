import { env } from '@env';
import Elysia from 'elysia';
import z from 'zod';
import { updateOrderStatus } from '../../handlers/update-order-status';
import { getConstructEvent } from '../../libs/stripe';

export const webhookController = new Elysia({ prefix: '/webhook' }).post(
	'/stripe',
	async ({ headers, status, request }) => {
		const rawBody = await request.text();
		const signature = headers['stripe-signature'];
		// if (env.STRIPE_WEBHOOK_SECRET !== signature) {
		// 	return status(400, { message: 'Invalid signature' });
		// }

		const event = await getConstructEvent(
			rawBody,
			signature,
			env.STRIPE_WEBHOOK_SECRET,
		);

		if (event) {
			const session = event.data.object as any;
			const orderId = session.metadata.orderId as string;
			console.log({ orderId });

			switch (event.type) {
				case 'checkout.session.completed':
				case 'checkout.session.async_payment_succeeded':
					await updateOrderStatus({ orderId, status: 'paid' });
					break;
				case 'checkout.session.expired':
				case 'checkout.session.async_payment_failed':
					await updateOrderStatus({ orderId, status: 'cancelled' });
					break;
			}
		}

		return [];
	},
	{
		headers: z.object({
			'stripe-signature': z.string(),
		}),
	},
);
