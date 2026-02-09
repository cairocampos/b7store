import { eq, inArray } from 'drizzle-orm';
import { db } from '../../database/client';
import { productImages } from '../../database/schema/product-images';
import { products } from '../../database/schema/products';
import { getAbsoluteImageUrl } from '../helpers/get-absolute-image-url';

export const getProductsById = async (ids: string[]) => {
	const products = await db
		.select({
			id: products.id,
			label: products.label,
			price: products.price,
			description: products.description,
			categoryId: products.categoryId,
			image: productImages.url,
		})
		.from(products)
		.leftJoin(productImages, eq(productImages.productId, products.id))
		.where(inArray(products.id, ids));

	return products.map((product) => ({
		...product,
		image: product.image ? getAbsoluteImageUrl(product.image) : null,
	}));
};
