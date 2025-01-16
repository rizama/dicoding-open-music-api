const mapDBSongsToModel = ({ id, title, performer }) => ({
    id,
    title,
    performer,
});

const mapDBSongsToModelDetail = ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    album_id: albumId,
}) => ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    albumId,
});

const mapDBAlbumsToModel = ({ id, name, cover, year, songs }) => ({
    id,
    name,
    coverUrl: cover,
    year,
    songs,
});

module.exports = {
    mapDBSongsToModel,
    mapDBSongsToModelDetail,
    mapDBAlbumsToModel,
};
