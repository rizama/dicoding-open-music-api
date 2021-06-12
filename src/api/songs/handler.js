const ClientError = require('../../exceptions/ClientError');

class SongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongsHandler = this.getSongsHandler.bind(this);
    }

    async postSongHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);
            const {
                title = 'untitled',
                year,
                performer,
                genre,
                duration,
            } = request.payload;

            const songId = await this._service.addSong({
                title,
                year,
                performer,
                genre,
                duration,
            });

            const response = h.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan',
                data: {
                    songId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async getSongsHandler() {
        const songs = await this._service.getSongs();
        return {
            status: 'success',
            data: {
                songs,
            },
        };
    }
}

module.exports = SongsHandler;
