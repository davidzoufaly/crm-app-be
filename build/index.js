"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
// Init middleware
// app.use(Logger);
app.get('/', function (req, res) {
    res.send('Hellooo World!');
});
app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});
