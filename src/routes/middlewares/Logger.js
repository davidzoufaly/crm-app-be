"use strict";
exports.__esModule = true;
var moment_1 = require("moment");
var Logger = function (req, res, next) {
    console.log("Logger se hl\u00E1s\u00ED: " + req.protocol + "://" + req.get('host') + req.originalUrl + " metoda: " + req.method + " " + moment_1["default"]().format());
    next();
};
exports["default"] = Logger;
