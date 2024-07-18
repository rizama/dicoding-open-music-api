const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBAlbumsToModel } = require('../../utils');

class AlbumsService {
    constructor() {
        this._pool = new Pool();
    }

    async addAlbum({ name, year }) {
        const id = `album-${nanoid(16)}`;
        const insertedAt = new Date().toISOString();

        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $4) RETURNING id',
            values: [id, name, year, insertedAt],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Album gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getAlbumById(id) {
        const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id],
        };
        const album = await this._pool.query(query);

        if (!album.rows.length) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        const querySongs = {
            text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
            values: [id],
        };
        const songs = await this._pool.query(querySongs);

        const transformedAlbum = mapDBAlbumsToModel({
            ...album.rows[0],
            songs: songs.rows,
        });

        return transformedAlbum;
    }

    async editAlbumById(id, { name, year }) {
        const updatedAt = new Date().toISOString();
        const query = {
            text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
            values: [name, year, updatedAt, id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError(
                'Gagal memperbarui album. Id tidak ditemukan'
            );
        }
    }

    async deleteAlbumById(id) {
        const query = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError(
                'Gagal menghapus album. Id tidak ditemukan'
            );
        }
    }
}

module.exports = AlbumsService;
