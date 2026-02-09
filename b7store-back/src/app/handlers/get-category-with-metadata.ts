import { eq } from 'drizzle-orm';
import { db } from '../../database/client';
import { categories } from '../../database/schema/categories';

export const getCategoryWithMetadata = async (slug: string) => {
	const category = await db.query.categories.findFirst({
		where: eq(categories.slug, slug),
		with: {
			metadata: {
				columns: {
					id: true,
					name: true,
				},
				with: {
					values: {
						columns: {
							id: true,
							label: true,
						},
					},
				},
			},
		},
	});

	return category;
};
