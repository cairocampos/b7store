import Elysia from 'elysia';
import z from 'zod';
import { calculateShipping } from '../../handlers/calculate-shipping';
import { cartFinish } from '../../handlers/cart-finish';
import { getProductsById } from '../../handlers/get-products-by-id';
import { bettherAuthMiddleware } from '../middlewares/better-auth';
import { cartFinishRequest } from '../requests/cart-finish-request';
import { cartMountRequest } from '../requests/cart-mount-request';
import { cartShippingRequest } from '../requests/cart-shipping-request';

export const cartController = new Elysia({ prefix: '/cart' })
	.use(bettherAuthMiddleware)
	.post(
		'/mount',
		async ({ body, status }) => {
			const { ids } = body;
			const products = await getProductsById(ids);

			return products;
		},
		{
			body: cartMountRequest,
		},
	)
	.get(
		'/shipping',
		async ({ query }) => {
			const { zipcode } = query;

			return calculateShipping(zipcode);
		},
		{
			query: cartShippingRequest,
		},
	)
	.post(
		'/finish',
		async ({ body, user, status }) => {
			const result = cartFinish({
				userId: user.id,
				...body,
			});

			return result;
		},
		{
			auth: true,
			body: cartFinishRequest,
			response: {
				200: z.object({
					orderId: z.string(),
					url: z.string(),
				}),
			},
		},
	);
