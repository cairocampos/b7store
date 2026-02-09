import { env } from '@env';

export function getAbsoluteImageUrl(relativePath: string): string {
	return `${env.APP_URL}/uploads/${relativePath}`;
}
