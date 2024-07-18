require('dotenv').config();
const Hapi = require('@hapi/hapi');

/**
 * Plugins Zone
 */
const songs = require('./api/songs');
const albums = require('./api/albums');

/**
 * Services Zone
 */
const SongsService = require('./services/postgres/SongsService');
const AlbumsService = require('./services/postgres/AlbumsService');

/**
 * Validators Zone
 */
const SongsValidator = require('./validator/songs');
const AlbumsValidator = require('./validator/albums');
const ClientError = require('./exceptions/ClientError');

const init = async () => {
    const songsService = new SongsService();
    const albumsService = new AlbumsService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register([
        {
            plugin: songs,
            options: {
                service: songsService,
                validator: SongsValidator,
            },
        },
        {
            plugin: albums,
            options: {
                service: albumsService,
                validator: AlbumsValidator,
            },
        },
    ]);

    server.ext('onPreResponse', (request, h) => {
        const { response } = request;

        if (response instanceof Error) {
            if (response instanceof ClientError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: response.message,
                });
                newResponse.code(response.statusCode);
                return newResponse;
            }

            if (!response.isServer) {
                return h.continue;
            }

            const newResponse = h.response({
                status: 'error',
                message: 'terjadi kegagalan pada server kami',
            });
            console.log(`Error: ${response.message}`);
            newResponse.code(500);
            return newResponse;
        }

        return h.continue;
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
