import { faker } from '@faker-js/faker';
import { db } from '../client';
import { banners } from '../schema/banners';
import { categories } from '../schema/categories';
import { categoriesMetadata } from '../schema/categories-metadata';
import { metadataValues } from '../schema/metadata-values';
import { productImages } from '../schema/product-images';
import { products } from '../schema/products';
import { productsMetadata } from '../schema/products-metadata';

async function main() {
	console.log('🌱 Starting database seeding...');

	console.log('Checking if database has already been seeded...');

	const existingCategory = await db.query.categories.findFirst({
		where: (c, { eq }) => eq(c.slug, 'camisas'),
	});

	if (existingCategory) {
		console.log(
			'✅ Database has already been seeded. Skipping to avoid duplicate records.',
		);
		console.log('Found existing category: ', existingCategory.name);
		return;
	}

	console.log('📝 No existing data found. Processing with seeding...');

	console.log('Creating category...');

	const [category] = await db
		.insert(categories)
		.values({
			name: 'Camisas',
			slug: 'camisas',
		})
		.returning();

	console.log('✅ Category created: ', category.name);

	console.log('Creating category metadata...');
	const [categoryMetadata] = await db
		.insert(categoriesMetadata)
		.values({
			id: 'tech',
			name: 'Tecnologia',
			categoryId: category.id,
		})
		.returning();

	console.log('✅ Category metadata created: ', categoryMetadata.name);

	// Create banners
	console.log('Creating banner...');
	const bannersResult = await db
		.insert(banners)
		.values([
			{
				image: 'banner_promo_1.jpg',
				link: '/banners/camisas',
			},
			{
				image: 'banner_promo_2.jpg',
				link: '/banners/camisas',
			},
		])
		.returning();

	console.log('✅ Banners created: ', bannersResult.length);

	// Create MetadataValues
	console.log('Creating  metadata values...');
	const metadataValuesResult = await db
		.insert(metadataValues)
		.values([
			{
				id: 'node',
				label: 'Node',
				categoryMetadataId: 'tech',
			},
			{
				id: 'react',
				label: 'React',
				categoryMetadataId: 'tech',
			},
			{
				id: 'python',
				label: 'Python',
				categoryMetadataId: 'tech',
			},
			{
				id: 'php',
				label: 'PHP',
				categoryMetadataId: 'tech',
			},
		])
		.returning();
	console.log('✅ Metadata value created: ', metadataValuesResult.length);

	// Create products
	console.log('Creating products...');
	const productsResult = await db
		.insert(products)
		.values([
			{
				label: 'Camisa RN',
				price: 89.09,
				description:
					'Camisa com estampa de React Native, perfeita para desenvolvedores',
				categoryId: category.id,
			},
			{
				label: 'Camisa React',
				price: 94.5,
				description:
					'Camisa com logo do React, ideal para front-end developers',
				categoryId: category.id,
			},
			{
				label: 'Camisa RN',
				price: 89.09,
				description:
					'Camisa com estampa de React Native, perfeita para desenvolvedores',
				categoryId: category.id,
			},
			{
				label: 'Camisa Node',
				price: 79.99,
				description: 'Camisa com design Node, para programadores Node',
				categoryId: category.id,
			},
			{
				label: 'Camisa PHP',
				price: 69.9,
				description: 'Camisa com estampa PHP, para desenvolvedores web',
				categoryId: category.id,
			},
		])
		.returning();
	console.log('✅ Products created: ', productsResult.length);

	// Create ProductImages for each product
	console.log('Creating product images...');
	const productImagesData = [];
	for (const product of productsResult) {
		const images = await db
			.insert(productImages)
			.values([
				{
					productId: product.id,
					url: `product_${product.label.replaceAll(' ', '')}_1.jpg`,
				},
				{
					productId: product.id,
					url: `product_${product.label.replaceAll(' ', '')}_2.jpg`,
				},
			])
			.returning();

		productImagesData.push(images);
	}
	console.log('✅ Product images created: ', productImagesData.length);

	// Create ProductMetadata for each product
	console.log('Creating product metadata...');
	const productMetadata = await db
		.insert(productsMetadata)
		.values([
			{
				productId: productsResult[0].id,
				categoryMetadataId: 'tech',
				metadataValueId: 'reach',
			},
			{
				productId: productsResult[1].id,
				categoryMetadataId: 'tech',
				metadataValueId: 'reach',
			},
			{
				productId: productsResult[2].id,
				categoryMetadataId: 'tech',
				metadataValueId: 'python',
			},
			{
				productId: productsResult[3].id,
				categoryMetadataId: 'tech',
				metadataValueId: 'php',
			},
		])
		.returning();

	console.log('✅ Product metadata created: ', productMetadata.length);
	console.log('🎉 Databae seeding completed uccessfully!');
}
main().catch((error) => {
	console.error('❌ Error during seeding: ', error);
	process.exit(1);
});
