"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongodb_1 = require("mongodb");
const moment_1 = __importDefault(require("moment"));
const msges_1 = __importDefault(require("../assets/msges"));
const client_1 = __importDefault(require("../assets/client"));
//? ATLAS CONNECTION
// const username = "RW";
// const password = "vjODZjlKTSIFKISV";
// const uri = `mongodb+srv://${username}:${password}@cluster0-g9fj3.mongodb.net/admin?retryWrites=true&w=majority`;
const collection = "clients";
const routerClients = express_1.Router();
//? Get All Clients
routerClients.get("/", (req, res) => {
    console.log(req.query);
    client_1.default.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.query.key).collection(collection);
        try {
            dbTarget.find({}).toArray((err, data) => {
                console.log(data);
                if (err)
                    throw err;
                res.status(200).json(data);
                client.close();
            });
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1.default.error });
        }
    });
});
//? Delete multiple object
routerClients.delete("/", (req, res) => {
    const ids = req.body.map((e) => new mongodb_1.ObjectId(e));
    client_1.default.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.query.key).collection(collection);
        try {
            dbTarget.deleteMany({ _id: { $in: ids } }, err => {
                if (err)
                    throw err;
                res.status(200).json({ msg: msges_1.default.success });
                client.close();
            });
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1.default.error });
        }
    });
});
//? Get from last week
routerClients.get("/last-week", (req, res) => {
    const today = new Date();
    const todayTimeStamp = today.getTime();
    const milsInWeek = 7 * 24 * 60 * 60 * 1000;
    const timeStampWeekAgo = todayTimeStamp - milsInWeek;
    client_1.default.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.query.key).collection(collection);
        try {
            dbTarget.find({}).toArray((err, data) => {
                const oneWeekOldClients = data.map((client) => {
                    return Object.assign(Object.assign({}, client), { ["Date added"]: new Date(client["Date added"]).getTime() });
                }).filter(client => timeStampWeekAgo - client["Date added"] < 0).length;
                if (err)
                    throw err;
                res.status(200).json(oneWeekOldClients);
                client.close();
            });
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1.default.error });
        }
    });
});
//? Number of clients
routerClients.get("/count", (req, res) => {
    client_1.default.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.query.key).collection(collection);
        try {
            dbTarget.countDocuments({}, (err, data) => {
                if (err)
                    throw err;
                res.status(200).json(data);
                client.close();
            });
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1.default.error });
        }
    });
});
//? Get Single Client
routerClients.get("/:key/:id", (req, res) => {
    console.log(req.params);
    client_1.default.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.params.key).collection(collection);
        try {
            dbTarget.findOne({ _id: new mongodb_1.ObjectId(req.params.id) }, (err, data) => {
                if (err)
                    throw err;
                res.status(200).json(data);
            });
            client.close();
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1.default.error });
        }
    });
});
//? Create Client
routerClients.post("/", (req, res) => {
    let reqObject = req.body;
    reqObject["Date added"] = moment_1.default().format('llll');
    reqObject._id = new mongodb_1.ObjectId(reqObject._id);
    client_1.default.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.query.key).collection(collection);
        try {
            dbTarget.insertOne(reqObject);
            res.status(200).json({ msg: msges_1.default.success });
            client.close();
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1.default.error });
        }
    });
});
//? Update Client
routerClients.put("/:key/:id", (req, res) => {
    const id = req.params.id;
    console.log(req.params);
    let reqObject = req.body;
    // remove id from req -> cant be passed to DB
    delete reqObject["_id"];
    client_1.default.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.params.key).collection(collection);
        try {
            dbTarget.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: reqObject });
            res.status(200).json({ msg: msges_1.default.success });
            client.close();
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1.default.error });
        }
    });
});
//? Client delete
routerClients.delete("/:key/:id", (req, res) => {
    const id = req.params.id;
    console.log(req.params);
    client_1.default.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.params.key).collection(collection);
        try {
            dbTarget.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            res.status(200).json({ msg: msges_1.default.success });
            client.close();
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1.default.error });
        }
    });
});
exports.default = routerClients;
