//read and set environment variables
require("dotenv").config();

var keys = require("./keys.js")

var spotify = new spotify(keys.spotify);

spotify-this-song