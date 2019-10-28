"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const Logger = (req, res, next) => {
    console.log(`Logger se hlásí: ${req.protocol}://${req.get('host')}${req.originalUrl} metoda: ${req.method} ${moment_1.default().format()}`);
    next();
};
exports.default = Logger;
