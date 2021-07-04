const { errorHandler } = require('../../utils');

class UploadsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
    }

    async postUploadImageHandler(request, h) {
        try {
            const { data } = request.payload;

            this._validator.validateImageHeaders(data.hapi.headers);

            const pictureUrl = await this._service.writeFile(data, data.hapi);

            const response = h.response({
                status: 'success',
                data: {
                    pictureUrl,
                },
            });

            response.code(201);
            return response;
        } catch (error) {
            return errorHandler(error, h);
        }
    }
}

module.exports = UploadsHandler;
