/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */

const ClientError = require('../exceptions/ClientError');

const mapDBToModel = ({ id, title, performer }) => ({
    id,
    title,
    performer,
});

const mapDBToModelDetail = ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    created_at,
    updated_at,
}) => ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    insertedAt: created_at,
    updatedAt: updated_at,
});

const errorHandler = (error, h) => {
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
};

module.exports = { mapDBToModel, mapDBToModelDetail, errorHandler };
