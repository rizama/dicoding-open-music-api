class UsersHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
    }

    async postUserHandler(request, h) {
        this._validator.validateUserPayload(request.payload);

        const { username, password, fullname } = request.payload;

        const userId = await this._service.addUser({
            username,
            password,
            fullname,
        });

        const response = h.response({
            status: 'success',
            message: 'User berhasil ditambahkan',
            data: {
                userId,
            },
        });
        response.code(201);
        return response;
    }

    async getUserByIdHandler(request) {
        const { id } = request.params;
        const user = await this._service.getUserById(id);
        return {
            status: 'success',
            data: {
                user,
            },
        };
    }

    async getUsersByUsernameHandler(request) {
        const { username = '' } = request.query;
        const users = await this._service.getUsersByUsername(username);
        return {
            status: 'success',
            data: {
                users,
            },
        };
    }
}

module.exports = UsersHandler;
