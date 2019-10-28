"use strict";
exports.__esModule = true;
var mongodb_1 = require("mongodb");
require('dotenv').config();
//? ATLAS CONNECTION
// const uri = `mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PW}@cluster0-g9fj3.mongodb.net/admin?retryWrites=true&w=majority`;
var client = new mongodb_1.MongoClient(process.env.LOCALHOST, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});
exports["default"] = client;
