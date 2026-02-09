import z from 'zod';

export const cartMountRequest = z.object({
	ids: z.array(z.string()).nonempty(),
});
