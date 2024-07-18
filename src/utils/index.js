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
    album_id,
}) => ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    albumId: album_id,
});

const mapDBAlbumsToModel = ({ id, name, year, songs }) => ({
    id,
    name,
    year,
    songs: songs,
});

module.exports = {
    mapDBSongsToModel,
    mapDBSongsToModelDetail,
    mapDBAlbumsToModel,
};
