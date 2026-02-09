import Elysia from 'elysia';
import z from 'zod';
import { getProductById } from '../../handlers/get-product-by-id';
import { getProducts } from '../../handlers/get-products';
import { getRelatedProducts } from '../../handlers/get-related-products';
import { incrementProductView } from '../../handlers/increment-product-view';
import type { Logger } from '../../providers/logger';
import { getProductsRequest } from '../requests/get-products.request';
import { getRelatedProductsRequest } from '../requests/get-related-products-request';

export const productController = new Elysia({ prefix: '/products' })
	.get(
		'/',
		({ query }) => {
			const { limit, metadata, orderBy } = query;
			const parsedMetadata = metadata ? JSON.parse(metadata) : undefined;
			return getProducts({ limit, metadata: parsedMetadata, orderBy });
		},
		{
			query: getProductsRequest,
		},
	)
	.get(
		'/:id',
		async ({ params, status }) => {
			const { id } = params;
			const product = await getProductById(id);
			if (!product) {
				return status(404, { message: 'Product not found' });
			}

			await incrementProductView(id);
			return product;
		},
		{
			params: z.object({
				id: z.uuidv7(),
			}),
		},
	)
	.get(
		'/:id/related',
		async ({ params, query, status }) => {
			const { id } = params;
			const { limit = 4 } = query;
			const product = await getProductById(id);
			if (!product) {
				return status(404, { message: 'Product not found' });
			}

			const relatedProducts = await getRelatedProducts({
				productId: id,
				limit,
			});

			return relatedProducts;
		},
		{
			params: z.object({
				id: z.uuidv7(),
			}),
			query: getRelatedProductsRequest,
		},
	);
