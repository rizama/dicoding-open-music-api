/* eslint-disable object-curly-newline */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModel } = require('../../utils');

class NotesService {
    constructor() {
        this._pool = new Pool();
    }

    async addSong({ title, year, performer, genre, duration }) {
        const id = `song-${nanoid(16)}`;
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;

        const query = {
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
            values: [
                id,
                title,
                year,
                performer,
                genre,
                duration,
                insertedAt,
                updatedAt,
            ],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Lagu gagal ditambahkan');
        }

        return result.rows[0].id;
    }
}

module.exports = NotesService;
