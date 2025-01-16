const { SongPayloadSchema, SongQuerySchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const SongsValidator = {
    validateSongPayload: (payload) => {
        const validationResult = SongPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },

    validateSongQuery: (payload) => {
        const validationResult = SongQuerySchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = SongsValidator;
