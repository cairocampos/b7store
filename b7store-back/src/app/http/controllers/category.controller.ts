import Elysia from 'elysia';
import z from 'zod';
import { getCategoryWithMetadata } from '../../handlers/get-category-with-metadata';

export const categoryController = new Elysia({ prefix: '/categories' }).get(
	'/:slug/metadata',
	async ({ params, status }) => {
		const { slug } = params;
		const category = await getCategoryWithMetadata(slug);
		if (!category) {
			return status(404, { message: 'Category not found' });
		}
		return category;
	},
	{
		params: z.object({
			slug: z.string(),
		}),
	},
);
