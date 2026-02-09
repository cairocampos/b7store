import z from 'zod';

const envSchema = z.object({
	APP_URL: z.string().url(),
	APP_FRONT_URL: z.string().url(),
	DATABASE_URL: z.string().startsWith('postgresql://'),
	STRIPE_SECRET_KEY: z.string(),
	STRIPE_WEBHOOK_SECRET: z.string(),
	// DB_CONNECTION: z.enum(["postgresql"]),
	// DB_HOST: z.string(),
	// DB_PORT: z.coerce.number(),
	// DB_DATABASE: z.string(),
	// DB_USERNAME: z.string(),
	// DB_PASSWORD: z.string(),
});

export const env = envSchema.parse(process.env);
