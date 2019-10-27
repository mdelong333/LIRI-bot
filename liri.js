//read and set environment variables
require("dotenv").config();

//require keys file
var keys = require("./keys.js");

//variables for spotify package and keys
var Spotify = require ('node-spotify-api');
var spotify = new Spotify(keys.spotify);

//Variables for user input
var command = process.argv[2];
var userInput = process.argv.slice(3).join(" ");


//switch case for commands
switch (command) {
    case "spotify-this-song":
        spotifyThisSong();
    break;

    case "concert-this":
        concertThis();
    break;

    case "movie-this":
        movieThis();
    break;

    case "do-what-it-says":
        doThis();
    break;

    default: console.log("invalid input");

};


