//read and set environment variables
require("dotenv").config();

exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};

exports.omdb = {
    id: process.env.OMDB_apikey
};

exports.bandsInTown = {
    id: process.env.app_id
};
