import { env } from '@env';
import Stripe from 'stripe';
import { db } from '../../database/client';
import type { CartItem } from '../types/cart-item';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY);

type CreateStripeCheckoutSessionData = {
	cart: CartItem[];
	shippingCost: number;
	orderId: string;
	// items: Array<{
	// 	name: string;
	// 	quantity: number;
	// 	price: number;
	// }>;
	// currency: string;
};

export const createStripeCheckoutSession = async (
	data: CreateStripeCheckoutSessionData,
) => {
	const stripeLineItems: Stripe.PaymentLinkCreateParams.LineItem[] = [];

	for (const item of data.cart) {
		const product = await db.query.products.findFirst({
			where: (products, { eq }) => eq(products.id, item.productId),
		});

		if (product) {
			stripeLineItems.push({
				price_data: {
					product_data: {
						name: product.label,
					},
					currency: 'BRL',
					unit_amount: Math.round(product.price * 100),
				},
				quantity: item.quantity,
			});
		}
	}

	if (data.shippingCost > 0) {
		stripeLineItems.push({
			price_data: {
				currency: 'BRL',
				product_data: {
					name: 'Frete',
				},
				unit_amount: Math.round(data.shippingCost * 100),
			},
			quantity: 1,
		});
	}

	const session = await stripe.checkout.sessions.create({
		line_items: stripeLineItems,
		mode: 'payment',
		metadata: {
			orderId: data.orderId,
		},
		success_url: `${env.APP_FRONT_URL}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${env.APP_FRONT_URL}/my-orders`,
	});

	return session;
};

export const getConstructEvent = async (
	rawBody: string,
	signature: string,
	webhookKey: string,
) => {
	try {
		const data = await stripe.webhooks.constructEventAsync(
			rawBody,
			signature,
			webhookKey,
		);
		return data;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export const getStripeCheckoutSession = async (sessionId: string) => {
	return await stripe.checkout.sessions.retrieve(sessionId);
};
