import Elysia from 'elysia';

export const errorHandler = new Elysia().onError(({ error, code, status }) => {
	console.log({ code });
	// Entender como isso funciona
	// if (code === 'VALIDATION') return error.detail(error.message);

	return status(400, { message: 'Deu ruim' });
});
