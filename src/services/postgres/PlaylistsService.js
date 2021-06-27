const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsService {
    constructor() {
        this._pool = new Pool();
    }

    async addPlaylist({ name, owner }) {
        const id = `playlist-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Playlist gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getPlaylists(owner) {
        const query = {
            text: `SELECT playlists.id, playlists.name, users.username FROM playlists
            LEFT JOIN users ON users.id = playlists.owner
            WHERE playlists.owner = $1
            `,
            values: [owner],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }

    async deletePlaylistById(id) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError(
                'Playlist gagal dihapus. Id tidak ditemukan'
            );
        }
    }

    async addSongToPlaylist(playlistId, songId) {
        const id = `ps-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Lagu gagal ditambahkan ke playlist');
        }
    }

    async getSongsFromPlaylist(playlistId) {
        const query = {
            text: `SELECT songs.id, songs.title, songs.performer FROM songs
            LEFT JOIN playlistsongs ON songs.id = playlistsongs.song_id
            WHERE playlistsongs.playlist_id = $1`,
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        return result.rows;
    }

    async deleteSongFromPlaylist(playlistId, songId) {
        const query = {
            text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Lagu gagal dihapus');
        }
    }

    async verifyPlaylistOwner(id, owner) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        const playlist = result.rows[0];

        if (playlist.owner !== owner) {
            throw new AuthorizationError(
                'Anda tidak berhak mengakses resource ini'
            );
        }
    }
}

module.exports = PlaylistsService;
