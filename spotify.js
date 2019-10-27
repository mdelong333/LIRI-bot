//read and set environment variables
require("dotenv").config();

//require keys file
var keys = require("./keys");

//require spotify package
var Spotify = require ('node-spotify-api');

//variable to hold spotify keys
var spotify = new Spotify(keys.spotify);

//require fs package
var fs = require("fs-extra");

//function to run spotify query
function spotifyThisSong(query) {
    var song = query;

    spotify.search({type: "track", query: song}, function(err, data){
        if (err) {
            return console.log(`Error occurred: ${err}`)
        };
        console.log(song);
        console.log(song.artist.name);

        console.log("---------------\n")
    });

    if (song === "") {
        song = "The Sign Ace of Base"
    };
};

module.exports = spotifyThisSong;