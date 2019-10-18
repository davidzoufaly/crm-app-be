import { Request, Response, NextFunction } from 'express';

const Cors = (req : Request, res : Response, next : NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
}

export default Cors;