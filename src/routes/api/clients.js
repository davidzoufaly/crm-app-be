"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var express_1 = require("express");
var mongodb_1 = require("mongodb");
var moment_1 = require("moment");
var msges_1 = require("../assets/msges");
var client_1 = require("../assets/client");
//? ATLAS CONNECTION
// const username = "RW";
// const password = "vjODZjlKTSIFKISV";
// const uri = `mongodb+srv://${username}:${password}@cluster0-g9fj3.mongodb.net/admin?retryWrites=true&w=majority`;
var collection = "clients";
var routerClients = express_1.Router();
//? Get All Clients
routerClients.get("/", function (req, res) {
    console.log(req.query);
    client_1["default"].connect(function (err, client) {
        if (err)
            throw err;
        console.log(err);
        var dbTarget = client.db(req.query.key).collection(collection);
        try {
            dbTarget.find({}).toArray(function (err, data) {
                console.log(data);
                if (err)
                    throw err;
                res.status(200).json(data);
                client.close();
            });
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1["default"].error });
        }
    });
});
//? Delete multiple object
routerClients["delete"]("/", function (req, res) {
    var ids = req.body.map(function (e) { return new mongodb_1.ObjectId(e); });
    client_1["default"].connect(function (err, client) {
        if (err)
            throw err;
        console.log(err);
        var dbTarget = client.db(req.query.key).collection(collection);
        try {
            dbTarget.deleteMany({ _id: { $in: ids } }, function (err) {
                if (err)
                    throw err;
                res.status(200).json({ msg: msges_1["default"].success });
                client.close();
            });
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1["default"].error });
        }
    });
});
//? Get from last week
routerClients.get("/last-week", function (req, res) {
    var today = new Date();
    var todayTimeStamp = today.getTime();
    var milsInWeek = 7 * 24 * 60 * 60 * 1000;
    var timeStampWeekAgo = todayTimeStamp - milsInWeek;
    client_1["default"].connect(function (err, client) {
        if (err)
            throw err;
        console.log(err);
        var dbTarget = client.db(req.query.key).collection(collection);
        try {
            dbTarget.find({}).toArray(function (err, data) {
                var oneWeekOldClients = data.map(function (client) {
                    var _a;
                    return __assign(__assign({}, client), (_a = {}, _a["Date added"] = new Date(client["Date added"]).getTime(), _a));
                }).filter(function (client) { return timeStampWeekAgo - client["Date added"] < 0; }).length;
                if (err)
                    throw err;
                res.status(200).json(oneWeekOldClients);
                client.close();
            });
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1["default"].error });
        }
    });
});
//? Number of clients
routerClients.get("/count", function (req, res) {
    client_1["default"].connect(function (err, client) {
        if (err)
            throw err;
        console.log(err);
        var dbTarget = client.db(req.query.key).collection(collection);
        try {
            dbTarget.countDocuments({}, function (err, data) {
                if (err)
                    throw err;
                res.status(200).json(data);
                client.close();
            });
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1["default"].error });
        }
    });
});
//? Get Single Client
routerClients.get("/:key/:id", function (req, res) {
    console.log(req.params);
    client_1["default"].connect(function (err, client) {
        if (err)
            throw err;
        console.log(err);
        var dbTarget = client.db(req.params.key).collection(collection);
        try {
            dbTarget.findOne({ _id: new mongodb_1.ObjectId(req.params.id) }, function (err, data) {
                if (err)
                    throw err;
                res.status(200).json(data);
            });
            client.close();
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1["default"].error });
        }
    });
});
//? Create Client
routerClients.post("/", function (req, res) {
    var reqObject = req.body;
    reqObject["Date added"] = moment_1["default"]().format('llll');
    reqObject._id = new mongodb_1.ObjectId(reqObject._id);
    client_1["default"].connect(function (err, client) {
        if (err)
            throw err;
        console.log(err);
        var dbTarget = client.db(req.query.key).collection(collection);
        try {
            dbTarget.insertOne(reqObject);
            res.status(200).json({ msg: msges_1["default"].success });
            client.close();
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1["default"].error });
        }
    });
});
//? Update Client
routerClients.put("/:key/:id", function (req, res) {
    var id = req.params.id;
    console.log(req.params);
    var reqObject = req.body;
    // remove id from req -> cant be passed to DB
    delete reqObject["_id"];
    client_1["default"].connect(function (err, client) {
        if (err)
            throw err;
        console.log(err);
        var dbTarget = client.db(req.params.key).collection(collection);
        try {
            dbTarget.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: reqObject });
            res.status(200).json({ msg: msges_1["default"].success });
            client.close();
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1["default"].error });
        }
    });
});
//? Client delete
routerClients["delete"]("/:key/:id", function (req, res) {
    var id = req.params.id;
    console.log(req.params);
    client_1["default"].connect(function (err, client) {
        if (err)
            throw err;
        console.log(err);
        var dbTarget = client.db(req.params.key).collection(collection);
        try {
            dbTarget.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            res.status(200).json({ msg: msges_1["default"].success });
            client.close();
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1["default"].error });
        }
    });
});
exports["default"] = routerClients;
