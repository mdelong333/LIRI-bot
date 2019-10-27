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
        spotifyThisSong(userInput);
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

function spotifyThisSong() {

    if (!userInput) {
        userInput = "The Sign Ace of Base"
    };

    spotify.search({type: 'track', query: userInput, limit: 5}, function(err, data){
        if (err) {
            return console.log(`Error occurred: ${err}`)
        };
    
        console.log(`
        ---------------------------\n
        Artist: ${data.tracks.items[0].artists[0].name}
        Song Title: ${data.tracks.items[0].name}
        Album: ${data.tracks.items[0].album.name}
        Play on Spotify: ${data.tracks.items[0].external_urls.spotify}\n
        ---------------------------\n`)
        
    });

};
