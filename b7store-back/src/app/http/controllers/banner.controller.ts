import Elysia from 'elysia';
import { getAllBanners } from '../../handlers/get-all-banners';

export const bannerController = new Elysia({ prefix: '/banners' }).get(
	'/',
	() => {
		return getAllBanners();
	},
);
