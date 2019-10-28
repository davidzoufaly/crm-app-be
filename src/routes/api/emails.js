"use strict";
exports.__esModule = true;
var nodemailer_1 = require("nodemailer");
var express_1 = require("express");
var moment_1 = require("moment");
var msges_1 = require("../assets/msges");
var client_1 = require("../assets/client");
var routerEmails = express_1.Router();
//? Get All Emails
routerEmails.get("/", function (req, res) {
    client_1["default"].connect(function (err, client) {
        if (err)
            throw err;
        console.log(err);
        var dbTarget = client.db(req.query.key).collection("emails");
        try {
            dbTarget.find({}).toArray(function (err, data) {
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
//? Get Last campaign
routerEmails.get("/last", function (req, res) {
    client_1["default"].connect(function (err, client) {
        if (err)
            throw err;
        console.log(err);
        var dbTarget = client.db(req.query.key).collection("emails");
        try {
            dbTarget.find({}).limit(1).sort({ date: -1 }).toArray(function (err, data) {
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
//? Get email settings
routerEmails.get("/email-settings", function (req, res) {
    client_1["default"].connect(function (err, client) {
        if (err)
            throw err;
        console.log(err);
        var dbTarget = client.db(req.query.key).collection("settings");
        try {
            dbTarget.findOne({ settingsName: "emailSettings" }, function (err, data) {
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
//? Number of emails
routerEmails.get("/count", function (req, res) {
    client_1["default"].connect(function (err, client) {
        if (err)
            throw err;
        console.log(err);
        var dbTarget = client.db(req.query.key).collection("emails");
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
//? Save email settings
routerEmails.post("/", function (req, res) {
    client_1["default"].connect(function (err, client) {
        if (err)
            throw err;
        console.log(err);
        var dbTarget = client.db(req.query.key).collection("settings");
        try {
            dbTarget.updateOne({ settingsName: "emailSettings" }, { $set: req.body }, function (err) {
                if (err)
                    throw err;
                res.status(200).json(msges_1["default"].success);
            });
        }
        catch (err) {
            console.log(err);
        }
    });
});
//? Save and send Email
routerEmails.post("/send", function (req, res) {
    var email = req.body;
    email.date = moment_1["default"]().format("llll");
    client_1["default"].connect(function (err, client) {
        if (err)
            throw err;
        console.log(err);
        var dbTarget = client.db(req.query.key).collection("settings");
        try {
            dbTarget.findOne({ settingsName: "emailSettings" }, function (err, data) {
                if (err)
                    throw err;
                if (data.username.includes("@") && data.pass.length !== 0) {
                    var transporter = nodemailer_1["default"].createTransport({
                        service: "gmail",
                        auth: {
                            user: data.username,
                            pass: data.pass
                        }
                    });
                    var mailOptions = {
                        from: data.username,
                        to: email.to,
                        subject: email.subject,
                        text: email.message
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                            throw error;
                        }
                        else {
                            res.status(200).json(msges_1["default"].success);
                            console.log("Email sent: " + info.response);
                            client.connect(function (err, client) {
                                if (err)
                                    throw err;
                                console.log(err);
                                var dbTarget = client.db(req.query.key).collection("emails");
                                try {
                                    dbTarget.insertOne(email);
                                }
                                catch (err) {
                                    console.log(err);
                                }
                            });
                        }
                    });
                }
                else {
                    res.status(200).json("Setup your email settings first");
                }
                client.close();
            });
        }
        catch (err) {
            console.log(err);
            res.status(403).json(msges_1["default"].error);
        }
    });
});
exports["default"] = routerEmails;
