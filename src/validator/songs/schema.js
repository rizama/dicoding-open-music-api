const Joi = require('joi');

const SongPayloadSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().integer().required(),
    performer: Joi.string().required(),
    genre: Joi.string().required(),
    duration: Joi.number().integer().required(),
});

module.exports = { SongPayloadSchema };
