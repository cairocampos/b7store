import z from 'zod';

export const cartFinishRequest = z.object({
	addressId: z.string(),
	cart: z
		.array(
			z.object({
				productId: z.string(),
				quantity: z.number().int().min(1),
			}),
		)
		.nonempty(),
});
