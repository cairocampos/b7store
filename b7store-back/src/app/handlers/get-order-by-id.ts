import { db } from '../../database/client';
import { getAbsoluteImageUrl } from '../helpers/get-absolute-image-url';

export const getOrderById = async (orderId: string) => {
	const order = await db.query.orders.findFirst({
		where: (orders, { eq }) => eq(orders.id, orderId),
		with: {
			orderItems: {
				columns: {
					id: true,
					quantity: true,
					price: true,
				},
				with: {
					product: {
						columns: {
							id: true,
							label: true,
							price: true,
						},
						with: {
							images: {
								limit: 1,
								columns: {
									url: true,
								},
							},
						},
					},
				},
			},
		},
	});

	const orderItems = order?.orderItems?.map((item) => {
		const imageUrl = item.product.images[0]?.url;
		return {
			...item,
			product: {
				id: item.product.id,
				label: item.product.label,
				price: item.product.price,
				image: imageUrl ? getAbsoluteImageUrl(imageUrl) : null,
			},
		};
	});

	return {
		...order,
		orderItems,
	};
};
