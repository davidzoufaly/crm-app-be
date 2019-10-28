"use strict";
exports.__esModule = true;
var express_1 = require("express");
var generate_unique_id_1 = require("generate-unique-id");
var msges_1 = require("../assets/msges");
var client_1 = require("../assets/client");
var db = "users";
var collection = "users";
var routerUsers = express_1.Router();
//? Register user and create him DB
routerUsers.post("/", function (req, res) {
    var user = req.body;
    user["Date Added"] = new Date();
    user.Api_KEY = generate_unique_id_1["default"]({
        length: 32
    }).toUpperCase();
    client_1["default"].connect(function (err, client) {
        if (err)
            throw err;
        console.log(err);
        var dbTarget = client.db(db).collection(collection);
        try {
            //check if user exists, if not insert him, else do nothing and return msg
            dbTarget.findOneAndUpdate({ username: user.username }, { $setOnInsert: user }, { upsert: true }, function (_, data) {
                // no data came back -> user does not exist and was created
                if (data.value === null) {
                    // continue to setup new user own DB
                    var dbTarget_1 = client.db(user.Api_KEY);
                    var defaultFields = [
                        {
                            fieldName: "First name",
                            fieldType: "text",
                            fieldPermanent: true,
                            fieldFormVisible: null,
                            fieldOptions: [],
                            fieldInForm: false
                        },
                        {
                            fieldName: "Last name",
                            fieldType: "text",
                            fieldPermanent: true,
                            fieldFormVisible: null,
                            fieldOptions: [],
                            fieldInForm: false
                        },
                        {
                            fieldName: "Email",
                            fieldType: "text",
                            fieldPermanent: true,
                            fieldFormVisible: null,
                            fieldOptions: [],
                            fieldInForm: false
                        },
                        {
                            fieldName: "Date added",
                            fieldType: "text",
                            fieldPermanent: true,
                            fieldFormVisible: null,
                            fieldOptions: [],
                            fieldInForm: false
                        },
                        {
                            fieldName: "Last modified",
                            fieldType: "text",
                            fieldPermanent: true,
                            fieldFormVisible: null,
                            fieldOptions: [],
                            fieldInForm: false
                        }
                    ];
                    Promise.all([
                        dbTarget_1.createCollection("clients"),
                        dbTarget_1.createCollection("emails"),
                        dbTarget_1.collection("settings").insertOne({
                            settingsName: "emailSettings",
                            username: "",
                            pass: ""
                        }),
                        dbTarget_1.collection("fields").insertMany(defaultFields)
                    ])
                        .then(function () {
                        res.status(200).json({ msg: msges_1["default"].success });
                    })["catch"](function (reason) {
                        console.log(reason);
                        res.status(400).send({ msg: msges_1["default"].error });
                    });
                }
                else {
                    res.status(200).json({ msg: msges_1["default"].exist });
                }
            });
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1["default"].error });
        }
    });
});
//? Login user
routerUsers.post("/authenticate-user", function (req, res) {
    client_1["default"].connect(function (err, client) {
        if (err)
            throw err;
        console.log(err);
        var dbTarget = client.db(db).collection(collection);
        try {
            dbTarget.findOne({ username: req.body.username }, function (err, data) {
                data === null
                    ? res.status(200).json({ msg: msges_1["default"].error })
                    : data.password === req.body.password
                        ? res.status(200).json({ msg: msges_1["default"].success, key: data.Api_KEY })
                        : res.status(200).json({ msg: msges_1["default"].error });
                if (err)
                    throw err;
            });
            client.close();
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1["default"].error });
        }
    });
});
exports["default"] = routerUsers;
