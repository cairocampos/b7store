import z from 'zod';

export const cartShippingRequest = z.object({
	zipcode: z.string(),
});
