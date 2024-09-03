const { AlbumPayloadSchema, ImageHeadersSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AlbumsValidator = {
    validateAlbumPayload: (payload) => {
        const validationResult = AlbumPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },

    validateCoverAlbumImageHeaders: (headers) => {
        const validationResult = ImageHeadersSchema.validate(headers);

        if (validationResult.error) {
            console.log(validationResult.error.message, 'validationResult.error.message');
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = AlbumsValidator;
