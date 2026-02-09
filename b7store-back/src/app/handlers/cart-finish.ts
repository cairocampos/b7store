import { and, eq } from 'drizzle-orm';
import { db } from '../../database/client';
import { userAddresses } from '../../database/schema/user-addresses';
import { createPaymentLink } from '../providers/payment';
import { createOrder } from './create-order';

export type CartFinishData = {
	userId: string;
	addressId: string;
	cart: {
		productId: string;
		quantity: number;
	}[];
};

export const cartFinish = async (data: CartFinishData) => {
	const [address] = await db
		.select()
		.from(userAddresses)
		.where(
			and(
				eq(userAddresses.id, data.addressId),
				eq(userAddresses.userId, data.userId),
			),
		);

	if (!address) {
		throw new Error('Address not found');
	}

	const shippingCost = 7; // TODO: temporário
	const shippingDays = 3; // TODO: temporário

	const { orderId } = await createOrder({
		userId: data.userId,
		address,
		shippingCost,
		shippingDays,
		cart: data.cart,
	});

	const { url } = await createPaymentLink({
		cart: data.cart,
		shippingCost,
		orderId,
	});

	return {
		orderId,
		url,
	};
};
