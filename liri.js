//read and set environment variables
require("dotenv").config();

var wrap = require('word-wrap');

//require keys file
var keys = require("./keys.js");

//require axios
var axios = require("axios");

//variables for spotify package and keys
var Spotify = require ('node-spotify-api');
var spotify = new Spotify(keys.spotify);

//omdb key
var omdb = (keys.omdb);

//Variables for user input
var command = process.argv[2];
var userInput = process.argv.slice(3).join(" ");


//switch case for commands
switch (command) {
    case "spotify-this-song":
        spotifyThisSong(userInput);
    break;

    case "concert-this":
        concertThis(userInput);
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
        
        console.log(wrap(`
        
        ---------------------------\n
        Artist: ${data.tracks.items[0].artists[0].name}
        Song Title: ${data.tracks.items[0].name}
        Album: ${data.tracks.items[0].album.name}
        Play on Spotify: ${data.tracks.items[0].external_urls.spotify}\n
        ---------------------------\n`));
        
    });

};

function concertThis() {

};

function movieThis() {
    axios.get("http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=" + omdb.id).then(
        function(response) {
            
            console.log(wrap(`
            
            ---------------------------\n
            Title: ${response.data.Title}
            Release Date: ${response.data.Released}
            IMDB rating: ${response.data.imdbRating}
            Rotten Tomatoes rating: ${response.data.Ratings[1].Value}
            Country of Origin: ${response.data.Country}
            Language: ${response.data.Language}
            Plot: ${response.data.Plot}
            Actors: ${response.data.Actors}
            ---------------------------\n
            `)); 
        })
        .catch(function(error) {
            if (error.response) {
                console.log(`
                Data: ${error.response.data}
                Status: ${error.response.status}
                Status: ${error.response.headers}
                `)
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log(`Error: ${error.message}`);
            }
            console.log(error.config);
        });
};