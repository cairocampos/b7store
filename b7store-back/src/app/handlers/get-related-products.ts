import { and, desc, eq, notInArray } from 'drizzle-orm';
import { db } from '../../database/client';
import { productImages } from '../../database/schema/product-images';
import { products } from '../../database/schema/products';
import { getAbsoluteImageUrl } from '../helpers/get-absolute-image-url';

type GetRelatedProductsData = {
	productId: string;
	limit: number;
};

export const getRelatedProducts = async ({
	productId,
	limit,
}: GetRelatedProductsData) => {
	const product = await db.query.products.findFirst({
		where: (products, { eq }) => eq(products.id, productId),
	});

	if (!product) {
		return [];
	}

	const relatedProducts = await db
		.select({
			id: products.id,
			label: products.label,
			price: products.price,
			categoryId: products.categoryId,
			image: productImages.url,
		})
		.from(products)
		.where(
			and(
				eq(products.categoryId, product.categoryId),
				notInArray(products.id, [productId]),
			),
		)
		.leftJoin(productImages, eq(products.id, productImages.productId))
		.orderBy(desc(products.viewsCount))
		.limit(limit);

	return relatedProducts.map((product) => {
		return {
			...product,
			liked: false,
			image: product.image ? getAbsoluteImageUrl(product.image) : null,
		};
	});
};
