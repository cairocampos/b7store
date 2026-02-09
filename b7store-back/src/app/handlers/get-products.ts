import { and, asc, desc, eq, inArray, or, type SQL } from 'drizzle-orm';
import { db } from '../../database/client';
import { productImages } from '../../database/schema/product-images';
import { products as productsSchema } from '../../database/schema/products';
import { productsMetadata } from '../../database/schema/products-metadata';
import { ProductOrderBy } from '../enums/product-order-by';
import { getAbsoluteImageUrl } from '../helpers/get-absolute-image-url';

type GetProductsFilters = {
	metadata?: Record<string, string>;
	limit?: number;
	orderBy?: ProductOrderBy;
};

export const getProducts = async (filters: GetProductsFilters) => {
	const { limit, metadata, orderBy } = filters;
	const query: SQL[] = [];
	const order: SQL[] = [];

	if (orderBy === ProductOrderBy.VIEWS) {
		order.push(desc(productsSchema.viewsCount));
	}

	if (orderBy === ProductOrderBy.SELLING) {
		order.push(desc(productsSchema.salesCount));
	}

	if (orderBy === ProductOrderBy.PRICE) {
		order.push(asc(productsSchema.price));
	}

	const metadataFilters: SQL[] = [];
	if (metadata) {
		for (const categoryMetadataId in filters.metadata) {
			const value = filters.metadata[categoryMetadataId];
			if (typeof value !== 'string') {
				continue;
			}

			const valueIds = value
				.split('|')
				.map((val) => val.trim())
				.filter(Boolean);

			if (!valueIds.length) {
			}
		}
	}

	// SELECT * FROM products WHERE ((category = 1 AND metadata_value IN (2,3)) OR (category = 2 AND metadata_value IN (4,5))
	if (metadataFilters.length) {
		//
	}

	const products = await db.query.products.findMany({
		columns: {
			id: true,
			label: true,
			price: true,
		},
		with: {
			images: {
				limit: 1,
				orderBy: asc(productImages.createdAt),
			},
			metadata: {
				where: or(...metadataFilters.map((filter) => and(filter))),
			},
		},
		where: and(...query),
		orderBy: order.length ? order : undefined,
		limit: limit,
	});

	return products.map((product) => {
		const productImage = product.images.length
			? `media/products/${product.images[0].url}`
			: null;

		const { images: _, ...data } = product;

		return {
			...data,
			image: productImage ? getAbsoluteImageUrl(productImage) : null,
		};
	});
};
