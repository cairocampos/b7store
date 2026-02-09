import Elysia from 'elysia';
import z from 'zod';
import { createUserAddress } from '../../handlers/create-user-address';
import { getUserAddresses } from '../../handlers/get-user-addresses';
import { bettherAuthMiddleware } from '../middlewares/better-auth';
import { createUserAddressRequest } from '../requests/create-user-address-request';

export const userController = new Elysia({ prefix: '/users' })
	.use(bettherAuthMiddleware)
	.get(
		'/:id',
		({ params, user }) => {
			const userId = params.id;

			const authenticatedUserName = user.name;

			console.log({ user });

			return {
				id: userId,
				name: authenticatedUserName,
			};
		},
		{
			auth: true,
			detail: {
				summary: 'Buscar um usuario pelo ID',
				tags: ['users'],
			},
			params: z.object({
				id: z.uuid(),
			}),
			response: {
				200: z.object({
					id: z.string(),
					name: z.string(),
				}),
			},
		},
	)
	.get(
		'/addresses',
		async ({ user }) => {
			const result = await getUserAddresses(user.id);

			return result;
		},
		{
			auth: true,
		},
	)
	.post(
		'/addresses',
		async ({ body, status, user }) => {
			const result = await createUserAddress({
				userId: user.id,
				...body,
			});

			return status(201, result);
		},
		{
			body: createUserAddressRequest,
			auth: true,
		},
	);
