import { eq, sql } from 'drizzle-orm';
import { db } from '../../database/client';
import { products } from '../../database/schema/products';

export const incrementProductView = async (productId: string) => {
	await db
		.update(products)
		.set({
			viewsCount: sql`${products.viewsCount} + 1`,
		})
		.where(eq(products.id, productId));
};
