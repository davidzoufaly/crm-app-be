"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger = function (req, res, next) {
    console.log(req.protocol + "://" + req.get('host') + req.originalUrl);
    next();
};
module.exports = Logger;
