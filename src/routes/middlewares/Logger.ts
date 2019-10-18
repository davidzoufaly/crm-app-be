import { Request, Response, NextFunction } from 'express';
import moment from "moment";

const Logger = (req : Request, res : Response, next : NextFunction) => {
    console.log(`Logger se hlásí: ${req.protocol}://${req.get('host')}${req.originalUrl} metoda: ${req.method} ${moment().format()}`);
    next();
} 

export default Logger;