"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cors = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS, PUT");
    next();
};
exports.default = Cors;
