import { bannerController } from '@controllers/banner.controller';
import { cartController } from '@controllers/cart.controller';
import { categoryController } from '@controllers/category.controller';
import { orderController } from '@controllers/order.controller';
import { productController } from '@controllers/product.controller';
import { webhookController } from '@controllers/webhook.controller';
import cors from '@elysiajs/cors';
import { openapi } from '@elysiajs/openapi';
import staticPlugin from '@elysiajs/static';
import { Elysia } from 'elysia';
import z from 'zod';
import { errorHandler } from './app/errors/handler';
import { userController } from './app/http/controllers/user.controller';
import {
	bettherAuthMiddleware,
	OpenAPI,
} from './app/http/middlewares/better-auth';
import { Logger } from './app/providers/logger';

const app = new Elysia()
	.use(
		openapi({
			mapJsonSchema: {
				zod: z.toJSONSchema,
			},
			documentation: {
				components: await OpenAPI.components,
				paths: await OpenAPI.getPaths(),
			},
		}),
	)
	.use(cors())
	.use(
		staticPlugin({
			assets: 'uploads',
			prefix: '/uploads',
		}),
	)
	// .onError(({ error, code, status }) => {
	// 	return status(500, { message: 'An error occurred' });
	// })
	.get('/ping', () => {
		return {
			pong: true,
		};
	})
	.decorate({
		logger: new Logger(),
	})
	.decorate('db', new Logger())
	.use(bettherAuthMiddleware)
	.use(userController)
	.use(bannerController)
	.use(productController)
	.use(categoryController)
	.use(cartController)
	.use(webhookController)
	.use(orderController)
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
