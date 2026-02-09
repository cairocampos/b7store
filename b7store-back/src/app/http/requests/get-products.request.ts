import z from 'zod';
import { ProductOrderBy } from '../../enums/product-order-by';

export const getProductsRequest = z.object({
	metadata: z.string().optional(),
	orderBy: z.enum(ProductOrderBy).optional(),
	limit: z.coerce.number().optional(),
});

export type GetProductsRequest = z.infer<typeof getProductsRequest>;
