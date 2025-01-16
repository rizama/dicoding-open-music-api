const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBAlbumsToModel } = require('../../utils');

class AlbumsService {
    constructor(storageS3Service, cacheService) {
        this._pool = new Pool();
        this._storageS3Service = storageS3Service;
        this._cacheService = cacheService;
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

    async updateCoverAlbum({ id, cover }) {
        const coverUrl = await this._storageS3Service.writeFile(
            cover,
            cover.hapi
        );

        const updatedAt = new Date().toISOString();
        const query = {
            text: 'UPDATE albums SET cover = $1, updated_at = $2 WHERE id = $3 RETURNING id',
            values: [coverUrl, updatedAt, id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError(
                'Gagal memperbarui album. Id tidak ditemukan'
            );
        }
    }

    async getAlbumLikesByAlbumId(id) {
        try {
            const albumLikesCount = await this._cacheService.get(`album_likes:${id}`);

            return {
                source: 'cache',
                data: JSON.parse(albumLikesCount),
            };
        } catch (error) {
            const query = {
                text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
                values: [id],
            };
            const albumLikesCount = await this._pool.query(query);

            await this._cacheService.set(`album_likes:${id}`, albumLikesCount.rowCount);

            return {
                source: 'db',
                data: albumLikesCount.rowCount,
            };
        }
    }

    async addAlbumLikes(albumId, userId) {
        const id = `likes-${nanoid(16)}`;

        const queryCheck = {
            text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
            values: [userId, albumId],
        };
        const existLike = await this._pool.query(queryCheck);
        if (existLike.rowCount) {
            throw new InvariantError(
                'Likes gagal ditambahkan. Anda sudah menyukai album ini.'
            );
        }

        const query = {
            text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
            values: [id, userId, albumId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Likes gagal ditambahkan');
        }

        await this._cacheService.delete(`album_likes:${albumId}`);

        return result.rows[0].id;
    }

    async deleteAlbumLikes(userId, albumId) {
        const query = {
            text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
            values: [userId, albumId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Likes gagal dihapus');
        }

        await this._cacheService.delete(`album_likes:${albumId}`);
    }
}

module.exports = AlbumsService;
