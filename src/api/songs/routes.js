const routes = (handler) => [
    {
        method: 'POST',
        path: '/songs',
        handler: handler.postSongHandler,
    },
    {
        method: 'GET',
        path: '/songs',
        handler: handler.getSongsHandler,
    },
    {
        method: 'GET',
        path: '/songs/{id}',
        handler: handler.getSongByIdHandler,
    },
    {
        method: 'PUT',
        path: '/songs/{id}',
        handler: handler.putSongByIdHandler,
    },
];

module.exports = routes;
