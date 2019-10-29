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
    
    spotify-this-song to search songs on spotify, returns up to 5 relevant results
    concert-this to search upcoming concerts by a specific artist
    movie-this to search movies on omdb
    do-what-it-says to use commands from random.txt`));

};

function spotifyThisSong() {

    if (!userInput) {
        userInput = "The Sign Ace of Base"
    };

    spotify.search({type: 'track', query: userInput, limit: 1}, function(err, data){
        if (err) {
            return console.log(`Error occurred: ${err}`)
        };

        var search = data.tracks.items
        
        for (var s = 0; s < search.length; s++) {
        
            console.log(wrap(`
            
            ---------------------------\n
            Artist: ${search[s].artists[0].name}
            Song Title: ${search[s].name}
            Album: ${search[s].album.name}
            Play on Spotify: ${search[s].external_urls.spotify}\n
            ---------------------------\n`));

            fs.appendFile("log.txt", `---------------------------\nArtist: ${search[s].artists[0].name}\nSong Title: ${search[s].name}\nAlbum: ${search[s].album.name}\nPlay on Spotify: ${search[s].external_urls.spotify}\n---------------------------\n`, "utf8", function(err) {
                if (err) {
                    return console.log(err);
                };
        
                console.log("Content added!");
        
            });

        };

    });

};

function concertThis() {
    
    if (!userInput) {
        userInput = "Surf Curse";
    }
    axios.get("https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=" + bandsInTown.id).then(

        function(response) {

            for (var i = 0; i < response.data.length; i++) {

                var venue = response.data[i].venue.name;
                var city = response.data[i].venue.city;
                var region = response.data[i].venue.region;
                var country = response.data[i].venue.country;
                var date = response.data[i].datetime;

                console.log(wrap(`
                
                ${userInput}
                \n---------------------------
                Venue: ${venue}
                Location: ${city}, ${region} ${country}
                Date: ${moment(date, 'YYYY-MM-DDTHH:mm:ss').format('MM/DD/YYYY, h:mm A')}
                ---------------------------\n
                `));

                fs.appendFile("log.txt", `---------------------------\n${userInput}\nVenue: ${venue}\nLocation: ${city}, ${region} ${country}\nDate: ${date} \n---------------------------\n`, "utf8", function(err) {
                    if (err) {
                        return console.log(err);
                    };
            
                    console.log("Content added!");
            
                });

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

            var title = response.data.Title;
            var releaseDate = response.data.Released;
            var imdbRating = response.data.imdbRating;
            var rtRating = response.data.Ratings[1].Value;
            var country = response.data.Country;
            var language = response.data.Language;
            var plot = response.data.Plot;
            var actors = response.data.Actors;
            
            console.log(wrap(`
            
            ---------------------------\n
            Title: ${title}
            Release Date: ${releaseDate}
            IMDB rating: ${imdbRating}
            Rotten Tomatoes rating: ${rtRating}
            Country of Origin: ${country}
            Language: ${language}
            Plot: ${plot}
            Actors: ${actors}
            ---------------------------\n
            `)); 

            fs.appendFile("log.txt", `---------------------------\nTitle: ${title}\nRelease Date: ${releaseDate}\nIMDB Rating: ${imdbRating}\nRotten Tomatoes rating: ${rtRating}\nCountry of Origin: ${country}\nLanguage: ${language}\nPlot: ${plot}\nActors: ${actors}\n---------------------------\n`, "utf8", function(err) {
                if (err) {
                    return console.log(err);
                };
        
                console.log("Content added!");
        
            });
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
        
        if (dataArr[0] === "spotify-this-song") {

            spotifyThisSong(userInput);

        } else if (dataArr[0] === "concert-this") {
            //not working whyyyy
            concertThis(userInput);

        } else if (dataArr[0] === "movie-this") {

            movieThis(userInput);

        };

    });

};

