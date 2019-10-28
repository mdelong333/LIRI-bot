//read and set environment variables
require("dotenv").config();

var wrap = require('word-wrap');

//require keys file
var keys = require("./keys.js");

//require axios
var axios = require("axios");

//require moment
var moment = require("moment");

//require fs
var fs = require("fs-extra");

//variables for spotify package and keys
var Spotify = require ('node-spotify-api');
var spotify = new Spotify(keys.spotify);

//omdb key
var omdb = (keys.omdb);

//bandsintown key
var bandsInTown = (keys.bandsInTown);

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

    default: console.log(wrap(`

    Invalid input - enter one of the following commands:
    
    spotify-this-song to search songs on spotify 
    concert-this to search upcoming concerts by a specific artist
    movie-this to search movies on omdb
    do-what-it-says to use commands from random.txt`));

};

function spotifyThisSong() {

    if (!userInput) {
        userInput = "The Sign Ace of Base"
    };

    spotify.search({type: 'track', query: userInput, limit: 5}, function(err, data){
        if (err) {
            return console.log(`Error occurred: ${err}`)
        };

        for (var s = 0; s < data.tracks.items.length; s++)
        console.log(wrap(`
        
        ---------------------------\n
        Artist: ${data.tracks.items[s].artists[0].name}
        Song Title: ${data.tracks.items[s].name}
        Album: ${data.tracks.items[s].album.name}
        Play on Spotify: ${data.tracks.items[s].external_urls.spotify}\n
        ---------------------------\n`));
        
    });

};

function concertThis() {

    if (!userInput) {
        userInput = "Surf Curse";
    }
    axios.get("https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=" + bandsInTown.id).then(

        function(response) {

            for (var i = 0; i < response.data.length; i++) {

                console.log(wrap(`
                
                ${userInput}
                \n---------------------------
                Venue: ${response.data[i].venue.name}
                Location: ${response.data[i].venue.city}, ${response.data[i].venue.region}
                Date: ${moment(response.data[i].datetime, 'YYYY-MM-DDTHH:mm:ss').format('MM/DD/YYYY, h:mm A')}
                ---------------------------\n
                `));

            };

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

function movieThis() {

    if (!userInput) {
        userInput = "Apostle";
        console.log(wrap(`
        
        ---------------------------\n
        If you haven't watched "Apostle", then you should: http://www.imdb.com/title/tt6217306/
        
        It's on Netflix!`));
    };

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

function doThis() {

    fs.readFile("random.txt", "utf8", function(err, data) {

        if (err) {
            return console.log(err);
        };

        //put data from random.txt into an array and use split to separate command from search terms
        var dataArr = data.split(",");


        command = dataArr[0];
        userInput = dataArr[1];
        console.log(command);
        console.log(userInput);
        
        if (dataArr[0] === "spotify-this-song") {

            spotifyThisSong(userInput);

        } else if (dataArr[0] === "concert-this") {

            concertThis(userInput);

        } else if (dataArr[0] === "movie-this") {

            movieThis(userInput);

        }

    })
}