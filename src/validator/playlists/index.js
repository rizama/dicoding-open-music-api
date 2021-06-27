const InvariantError = require('../../exceptions/InvariantError');
const { PlaylistPayloadSchema, AddSongPayloadSchema } = require('./schema');

const PlaylistValidator = {
    validatePlaylistPayload: (payload) => {
        const validationResult = PlaylistPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validateSongPayload: (payload) => {
        const validationResult = AddSongPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = PlaylistValidator;
