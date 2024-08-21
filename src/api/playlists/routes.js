const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists',
        handler: (request, h) => handler.postPlaylistHandler(request, h),
        options: {
            auth: 'songsapp_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists',
        handler: (request, h) => handler.getPlaylistHandler(request, h),
        options: {
            auth: 'songsapp_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{playlistId}',
        handler: (request, h) => handler.deletePlaylistHandler(request, h),
        options: {
            auth: 'songsapp_jwt',
        },
    },
    {
        method: 'POST',
        path: '/playlists/{playlistId}/songs',
        handler: (request, h) => handler.postSongToPlaylistHandler(request, h),
        options: {
            auth: 'songsapp_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists/{playlistId}/songs',
        handler: (request, h) => handler.getSongFromPlaylistHandler(request, h),
        options: {
            auth: 'songsapp_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{playlistId}/songs',
        handler: (request, h) =>
            handler.deleteSongFromPlaylistHandler(request, h),
        options: {
            auth: 'songsapp_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists/{playlistId}/activities',
        handler: (request, h) => handler.getActivityHandler(request, h),
        options: {
            auth: 'songsapp_jwt',
        },
    },
];

module.exports = routes;
