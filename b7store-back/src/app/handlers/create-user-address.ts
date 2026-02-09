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

export const createUserAddress = async (data: CreateUserAddressData) => {
	const address = await db
		.insert(userAddresses)
		.values({
			userId: data.userId,
			zipcode: data.zipcode,
			street: data.street,
			number: data.number,
			city: data.city,
			state: data.state,
			country: data.country,
			complement: data.complement,
		})
		.returning();

	return address[0];
};
