class PlaylistHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
    }

    async postPlaylistHandler(request, h) {
        this._validator.validatePlaylistPayload(request.payload);
        const { name } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        const playlistId = await this._service.addPlaylist({
            name,
            owner: credentialId,
        });
        const response = h.response({
            status: 'success',
            message: 'Playlist berhasil ditambahkan',
            data: {
                playlistId,
            },
        });
        response.code(201);
        return response;
    }

    async getPlaylistHandler(request) {
        const { id: credentialId } = request.auth.credentials;
        const playlists = await this._service.getPlaylists(credentialId);
        return {
            status: 'success',
            data: {
                playlists,
            },
        };
    }

    async deletePlaylistHandler(request) {
        const { playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistOwner(playlistId, credentialId);
        await this._service.deletePlaylistById(playlistId);

        return {
            status: 'success',
            message: 'Playlist berhasil dihapus',
        };
    }

    // tambah activities
    async postSongToPlaylistHandler(request, h) {
        this._validator.validateSongPayload(request.payload);
        const { songId } = request.payload;
        const { playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(playlistId, credentialId);
        await this._service.addSongToPlaylist(playlistId, songId);
        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan ke playlist',
        });

        // add activities
        await this._service.addActivity({
            playlistId,
            songId,
            credentialId,
            action: 'add',
        });

        response.code(201);
        return response;
    }

    async getSongFromPlaylistHandler(request) {
        const { playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(playlistId, credentialId);

        const playlist = await this._service.getPlaylistById(playlistId);

        const songs = await this._service.getSongsFromPlaylist(playlistId);

        return {
            status: 'success',
            data: {
                playlist: {
                    ...playlist,
                    songs,
                },
            },
        };
    }

    // tambah activities
    async deleteSongFromPlaylistHandler(request) {
        const { playlistId } = request.params;
        const { songId } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(playlistId, credentialId);
        await this._service.deleteSongFromPlaylist(playlistId, songId);

        // add activities
        await this._service.addActivity({
            playlistId,
            songId,
            credentialId,
            action: 'delete',
        });

        return {
            status: 'success',
            message: 'Lagu berhasil dihapus dari playlist',
        };
    }

    async getPlaylistActivitiesHandler(request) {
        const { playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(playlistId, credentialId);

        const playlist = await this._service.getPlaylistById(playlistId);

        const songs = await this._service.getSongsFromPlaylist(playlistId);

        return {
            status: 'success',
            data: {
                playlist: {
                    ...playlist,
                    songs,
                },
            },
        };
    }

    async getActivityHandler(request) {
        const { playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(playlistId, credentialId);

        const activities = await this._service.getActivitiesByPlaylistId(playlistId);

        return {
            status: 'success',
            data: {
                playlistId,
                activities,
            },
        };
    }
}

module.exports = PlaylistHandler;
