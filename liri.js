//read and set environment variables
require("dotenv").config();

var spotifyThisSong = require("./spotify");

//require keys file
var keys = require("./keys.js");

//Variables for user input
var command = process.argv[2];
var query = process.argv.slice(3).join(" ");

spotifyThisSong(query);