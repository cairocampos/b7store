import { eq } from 'drizzle-orm';
import { db } from '../../database/client';
import { orderItems } from '../../database/schema/order-items';
import { orders } from '../../database/schema/orders';
import { products } from '../../database/schema/products';
import type { Address } from '../types/address';
import type { CartItem } from '../types/cart-item';

type CreateOrderData = {
	userId: string;
	address: Address;
	shippingCost: number;
	shippingDays: number;
	cart: CartItem[];
};

export const createOrder = async (data: CreateOrderData) => {
	let subtotal = 0;
	const items: Array<{
		productId: string;
		quantity: number;
		price: number;
	}> = [];
	for (const item of data.cart) {
		const [product] = await db
			.select()
			.from(products)
			.where(eq(products.id, item.productId))
			.limit(1);

		if (product) {
			subtotal += product.price * item.quantity;
			items.push({
				productId: product.id,
				quantity: item.quantity,
				price: product.price,
			});
		}
	}

	const total = subtotal + data.shippingCost;
	const { id: orderId } = await db.transaction(async (tx) => {
		const [order] = await tx
			.insert(orders)
			.values({
				userId: data.userId,
				shippingCost: data.shippingCost,
				shippingDays: data.shippingDays,
				total,
				shippingZipcode: data.address.zipcode,
				shippingStreet: data.address.street,
				shippingNumber: data.address.number,
				shippingCity: data.address.city,
				shippingState: data.address.state,
				shippingCountry: data.address.country,
				shippingComplement: data.address.complement,
			})
			.returning({ id: orders.id });

		await tx.insert(orderItems).values(
			items.map((item) => ({
				orderId: order.id,
				productId: item.productId,
				quantity: item.quantity,
				price: item.price,
			})),
		);

		return order;
	});

	console.log('[ORDER ID]', orderId);

	return {
		orderId,
	};
};
