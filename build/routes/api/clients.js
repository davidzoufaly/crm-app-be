"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const routerClients = express.Router();
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const moment = require("moment");
const msges = require("../assets/msges");
const client = require("../assets/client");
const collection = "clients";
//? Get All Clients
routerClients.get("/", (req, res) => {
    console.log(req.query);
    client.connect((err, client) => {
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
            res.status(400).json({ msg: msges.error });
        }
    });
});
//? Delete multiple object
routerClients.delete("/", (req, res) => {
    const ids = req.body.map((e) => new ObjectId(e));
    client.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.query.key).collection(collection);
        try {
            dbTarget.deleteMany({ _id: { $in: ids } }, err => {
                if (err)
                    throw err;
                res.status(200).json({ msg: msges.success });
                client.close();
            });
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges.error });
        }
    });
});
//? Get from last week
routerClients.get("/last-week", (req, res) => {
    const today = new Date();
    const todayTimeStamp = today.getTime();
    const milsInWeek = 7 * 24 * 60 * 60 * 1000;
    const timeStampWeekAgo = todayTimeStamp - milsInWeek;
    client.connect((err, client) => {
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
            res.status(400).json({ msg: msges.error });
        }
    });
});
//? Number of clients
routerClients.get("/count", (req, res) => {
    client.connect((err, client) => {
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
            res.status(400).json({ msg: msges.error });
        }
    });
});
//? Get Single Client
routerClients.get("/:key/:id", (req, res) => {
    console.log(req.params);
    client.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.params.key).collection(collection);
        try {
            dbTarget.findOne({ _id: new ObjectId(req.params.id) }, (err, data) => {
                if (err)
                    throw err;
                res.status(200).json(data);
            });
            client.close();
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges.error });
        }
    });
});
//? Create Client
routerClients.post("/", (req, res) => {
    let reqObject = req.body;
    reqObject["Date added"] = moment().format('llll');
    reqObject._id = new ObjectId(reqObject._id);
    client.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.query.key).collection(collection);
        try {
            dbTarget.insertOne(reqObject);
            res.status(200).json({ msg: msges.success });
            client.close();
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges.error });
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
    client.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.params.key).collection(collection);
        try {
            dbTarget.updateOne({ _id: new ObjectId(id) }, { $set: reqObject });
            res.status(200).json({ msg: msges.success });
            client.close();
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges.error });
        }
    });
});
//? Client delete
routerClients.delete("/:key/:id", (req, res) => {
    const id = req.params.id;
    console.log(req.params);
    client.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.params.key).collection(collection);
        try {
            dbTarget.deleteOne({ _id: new ObjectId(id) });
            res.status(200).json({ msg: msges.success });
            client.close();
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges.error });
        }
    });
});
module.exports = routerClients;
