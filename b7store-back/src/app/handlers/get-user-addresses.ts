import { desc, eq } from 'drizzle-orm';
import { db } from '../../database/client';
import { userAddresses } from '../../database/schema/user-addresses';

export type CreateUserAddressData = {
	userId: string;
	zipcode: string;
	street: string;
	number: string;
	city: string;
	state: string;
	country: string;
	complement?: string;
};

export const getUserAddresses = async (userId: string) => {
	const addresses = await db
		.select()
		.from(userAddresses)
		.where(eq(userAddresses.userId, userId))
		.orderBy(desc(userAddresses.createdAt));

	return addresses;
};
