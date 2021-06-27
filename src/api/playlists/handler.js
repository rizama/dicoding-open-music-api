const { errorHandler } = require('../../utils');

class PlaylistHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
        this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
        this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
        this.getSongFromPlaylistHandler = this.getSongFromPlaylistHandler.bind(this);
        this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
    }

    async postPlaylistHandler(request, h) {
        try {
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
        } catch (error) {
            return errorHandler(error, h);
        }
    }

    async getPlaylistHandler(request, h) {
        try {
            const { id: credentialId } = request.auth.credentials;
            const playlists = await this._service.getPlaylists(credentialId);
            return {
                status: 'success',
                data: {
                    playlists,
                },
            };
        } catch (error) {
            console.log(error);
            return errorHandler(error, h);
        }
    }

    async deletePlaylistHandler(request, h) {
        try {
            const { playlistId } = request.params;
            const { id: credentialId } = request.auth.credentials;

            await this._service.verifyPlaylistOwner(playlistId, credentialId);
            await this._service.deletePlaylistById(playlistId);

            return {
                status: 'success',
                message: 'Playlist berhasil dihapus',
            };
        } catch (error) {
            return errorHandler(error, h);
        }
    }

    async postSongToPlaylistHandler(request, h) {
        try {
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
            response.code(201);
            return response;
        } catch (error) {
            return errorHandler(error, h);
        }
    }

    async getSongFromPlaylistHandler(request, h) {
        try {
            const { playlistId } = request.params;
            const { id: credentialId } = request.auth.credentials;

            await this._service.verifyPlaylistAccess(playlistId, credentialId);

            const songs = await this._service.getSongsFromPlaylist(playlistId);

            return {
                status: 'success',
                data: {
                    songs,
                },
            };
        } catch (error) {
            return errorHandler(error, h);
        }
    }

    async deleteSongFromPlaylistHandler(request, h) {
        try {
            const { playlistId } = request.params;
            const { songId } = request.payload;
            const { id: credentialId } = request.auth.credentials;

            await this._service.verifyPlaylistAccess(playlistId, credentialId);
            await this._service.deleteSongFromPlaylist(playlistId, songId);

            return {
                status: 'success',
                message: 'Lagu berhasil dihapus dari playlist',
            };
        } catch (error) {
            return errorHandler(error, h);
        }
    }
}

module.exports = PlaylistHandler;
