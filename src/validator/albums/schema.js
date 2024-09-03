const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
    name: Joi.string().required(),
    year: Joi.number()
        .integer()
        .min(1900)
        .max(2030)
        .required(),
});

const ImageHeadersSchema = Joi.object({
    'content-type': Joi.string()
        .valid(
            'image/apng',
            'image/avif',
            'image/gif',
            'image/jpeg',
            'image/png',
            'image/svg+xml',
            'image/webp'
        )
        .required(),
}).unknown();

module.exports = { AlbumPayloadSchema, ImageHeadersSchema };
