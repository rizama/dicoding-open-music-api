const InvariantError = require('../../exceptions/InvariantError');
const ImageHeadersSchema = require('./schema');

const UploadValidator = {
    validateImageHeaders: (payload) => {
        const validateResult = ImageHeadersSchema.validate(payload);

        if (validateResult.error) {
            throw new InvariantError(validateResult.error.message);
        }
    },
};

module.exports = UploadValidator;
