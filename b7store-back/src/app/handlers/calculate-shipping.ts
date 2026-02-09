export const calculateShipping = async (zipcode: string) => {
	return {
		zipcode,
		days: 3,
		cost: 12.75,
	};
};
