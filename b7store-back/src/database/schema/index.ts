import { accounts } from './accounts';
import { banners } from './banners';
import { categories, categoriesRelations } from './categories';
import {
	categoriesMetadata,
	categoriesMetadataRelations,
} from './categories-metadata';
import { metadataValues, metadataValuesRelations } from './metadata-values';
import { orderItems, orderItemsRelations } from './order-items';
import { orders, ordersRelations } from './orders';
import { productImages, productImagesRelations } from './product-images';
import { products, productsRelations } from './products';
import {
	productsMetadata,
	productsMetadataRelations,
} from './products-metadata';
import { sessions } from './sessions';
import { userAddresses } from './user-addresses';
import { users } from './users';
import { verifications } from './verifications';

export const schema = {
	users,
	accounts,
	sessions,
	verifications,
	userAddresses,
	banners,
	categories,
	categoriesRelations,
	products,
	productsRelations,
	productImages,
	productImagesRelations,
	productsMetadata,
	productsMetadataRelations,
	categoriesMetadata,
	categoriesMetadataRelations,
	metadataValues,
	metadataValuesRelations,
	orders,
	ordersRelations,
	orderItemsRelations,
	orderItems,
};
