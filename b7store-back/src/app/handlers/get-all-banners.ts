import { db } from '../../database/client';
import { banners } from '../../database/schema/banners';
import { getAbsoluteImageUrl } from '../helpers/get-absolute-image-url';

export const getAllBanners = async () => {
	const result = await db
		.select({ image: banners.image, link: banners.link })
		.from(banners);

	return result.map((banner) => ({
		...banner,
		image: banner.image ? getAbsoluteImageUrl(banner.image) : null,
	}));
};
