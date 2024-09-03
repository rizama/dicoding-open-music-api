const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums',
        handler: (request, h) => handler.postAlbumHandler(request, h),
    },
    {
        method: 'GET',
        path: '/albums',
        handler: (request, h) => handler.getAlbumsHandler(request, h),
    },
    {
        method: 'GET',
        path: '/albums/{id}',
        handler: (request, h) => handler.getAlbumByIdHandler(request, h),
    },
    {
        method: 'PUT',
        path: '/albums/{id}',
        handler: (request, h) => handler.putAlbumByIdHandler(request, h),
    },
    {
        method: 'DELETE',
        path: '/albums/{id}',
        handler: (request, h) => handler.deleteAlbumByIdHandler(request, h),
    },
    {
        method: 'POST',
        path: '/albums/{id}/covers',
        handler: (request, h) => handler.postCoverAlbumHandler(request, h),
        options: {
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
                output: 'stream',
                maxBytes: 512000,
            },
        },
    },
    {
        method: 'GET',
        path: '/albums/{id}/likes',
        handler: (request, h) =>
            handler.getUserAlbumLikesByIdHandler(request, h),
    },
    {
        method: 'POST',
        path: '/albums/{id}/likes',
        handler: (request, h) => handler.postUserAlbumLikesHandler(request, h),
        options: {
            auth: 'songsapp_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/albums/{id}/likes',
        handler: (request, h) =>
            handler.deleteUserAlbumLikesHandler(request, h),
        options: {
            auth: 'songsapp_jwt',
        },
    },
];

module.exports = routes;
