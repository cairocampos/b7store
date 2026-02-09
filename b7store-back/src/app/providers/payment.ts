import {
	createStripeCheckoutSession,
	getStripeCheckoutSession,
} from '../libs/stripe';
import type { CartItem } from '../types/cart-item';

type CreatePaymentLinkData = {
	cart: CartItem[];
	shippingCost: number;
	orderId: string;
};

export const createPaymentLink = async (data: CreatePaymentLinkData) => {
	try {
		const session = await createStripeCheckoutSession(data);
		return {
			url: session.url,
		};
	} catch (error) {
		console.error('Error creating payment link:', error);
		throw error;
	}
};

export const getOrderIdFromSession = async (sessionId: string) => {
	const session = await getStripeCheckoutSession(sessionId);
	return session.metadata?.orderId;
};
