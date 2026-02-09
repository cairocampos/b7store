import { db } from '../../database/client';
import { getAbsoluteImageUrl } from '../helpers/get-absolute-image-url';

export const getProductById = async (id: string) => {
	const product = await db.query.products.findFirst({
		columns: {
			id: true,
			label: true,
			price: true,
			description: true,
		},
		where: (products, { eq }) => eq(products.id, id),
		with: {
			images: true,
			category: {
				columns: {
					id: true,
					name: true,
					slug: true,
				},
			},
		},
	});

	if (!product) {
		return null;
	}

	return {
		...product,
		images: product.images.map((image) =>
			getAbsoluteImageUrl(image.url as string),
		),
	};
};
