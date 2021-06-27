const PlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'playlists',
    version: '1.0.0',
    register: async (server, { service, validator }) => {
        const playlistsHandler = new PlaylistHandler(service, validator);
        server.route(routes(playlistsHandler));
    },
};
