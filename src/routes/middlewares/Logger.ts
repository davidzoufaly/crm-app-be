import { Request, Response, NextFunction } from 'express';

const Logger = (req : Request, res : Response, next : NextFunction) => {
    console.log(`Logger se hlásí: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
} 

export default Logger;