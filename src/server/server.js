require('dotenv').config();

const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const loadModel = require('../services/loadModel');

console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

(async () => {
    const server = Hapi.server({
        port: 3001,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    try {
        const model = await loadModel();
        server.app.model = model;

        server.route(routes);

        server.ext('onPreResponse', (request, h) => {
            const response = request.response;

            if (response.isBoom) {
                const newResponse = h.response({
                    status: 'fail',
                    message: response.message
                });
                newResponse.code(response.output.statusCode);
                return newResponse;
            }

            return h.continue;
        });

        await server.start();
        console.log(`Server mulai di: ${server.info.uri}`);
    } catch (err) {
        console.error('Gagal memulai server:', err);
        process.exit(1); // Keluar dengan kode kesalahan
    }
})();
