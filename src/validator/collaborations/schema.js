const Joi = require('joi');

const CollaborationPayloadaSchema = Joi.object({
    playlistId: Joi.string().required(),
    userId: Joi.string().required(),
});

module.exports = { CollaborationPayloadaSchema };
