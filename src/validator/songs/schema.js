const Joi = require('joi');

const SongPayloadSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().integer()
        .min(1900)
        .max(2030)
        .required(),
    genre: Joi.string().required(),
    performer: Joi.string().required(),
    duration: Joi.number().integer(),
    albumId: Joi.string(),
});

const SongQuerySchema = Joi.object({
    title: Joi.string().allow(null, ''),
    performer: Joi.string().allow(null, ''),
});

module.exports = { SongPayloadSchema, SongQuerySchema };
