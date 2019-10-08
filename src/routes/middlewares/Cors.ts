import { Request, Response, NextFunction } from 'express';

const Cors = (req : Request, res : Response, next : NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
}

export default Cors;