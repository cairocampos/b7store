import z from 'zod';

export const getRelatedProductsRequest = z.object({
	limit: z.coerce.number().optional(),
});

export type GetRelatedProductsRequest = z.infer<
	typeof getRelatedProductsRequest
>;
