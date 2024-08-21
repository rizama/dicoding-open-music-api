/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    // memberikan constraint foreign key pada songs terhadap kolom id dari tabel album
    pgm.addConstraint(
        'songs',
        'fk_songs.album_id_albums.id',
        'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE'
    );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropConstraint('songs', 'fk_songs.album_id_albums.id');
};
