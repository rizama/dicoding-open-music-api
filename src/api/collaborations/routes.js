const routes = (handler) => [
    {
        method: 'POST',
        path: '/collaborations',
        handler: (request, h) => handler.postCollaborationHandler(request, h),
        options: {
            auth: 'songsapp_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/collaborations',
        handler: (request, h) => handler.deleteCollaborationHandler(request, h),
        options: {
            auth: 'songsapp_jwt',
        },
    },
];

module.exports = routes;
