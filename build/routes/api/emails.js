"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const express_1 = require("express");
const moment_1 = __importDefault(require("moment"));
const msges_1 = __importDefault(require("../assets/msges"));
const client_1 = __importDefault(require("../assets/client"));
const routerEmails = express_1.Router();
//? Get All Emails
routerEmails.get("/", (req, res) => {
    client_1.default.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.query.key).collection("emails");
        try {
            dbTarget.find({}).toArray((err, data) => {
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
//? Get Last campaign
routerEmails.get("/last", (req, res) => {
    client_1.default.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.query.key).collection("emails");
        try {
            dbTarget.find({}).limit(1).sort({ date: -1 }).toArray((err, data) => {
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
//? Get email settings
routerEmails.get("/email-settings", (req, res) => {
    client_1.default.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.query.key).collection("settings");
        try {
            dbTarget.findOne({ settingsName: "emailSettings" }, (err, data) => {
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
//? Number of emails
routerEmails.get("/count", (req, res) => {
    client_1.default.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.query.key).collection("emails");
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
//? Save email settings
routerEmails.post("/", (req, res) => {
    client_1.default.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.query.key).collection("settings");
        try {
            dbTarget.updateOne({ settingsName: "emailSettings" }, { $set: req.body }, (err) => {
                if (err)
                    throw err;
                res.status(200).json(msges_1.default.success);
            });
        }
        catch (err) {
            console.log(err);
        }
    });
});
//? Save and send Email
routerEmails.post("/send", (req, res) => {
    const email = req.body;
    email.date = moment_1.default().format("llll");
    client_1.default.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.query.key).collection("settings");
        try {
            dbTarget.findOne({ settingsName: "emailSettings" }, (err, data) => {
                if (err)
                    throw err;
                if (data.username.includes("@") && data.pass.length !== 0) {
                    const transporter = nodemailer_1.default.createTransport({
                        service: "gmail",
                        auth: {
                            user: data.username,
                            pass: data.pass
                        }
                    });
                    const mailOptions = {
                        from: data.username,
                        to: email.to,
                        subject: email.subject,
                        text: email.message
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                            throw error;
                        }
                        else {
                            res.status(200).json(msges_1.default.success);
                            console.log("Email sent: " + info.response);
                            client.connect((err, client) => {
                                if (err)
                                    throw err;
                                console.log(err);
                                const dbTarget = client.db(req.query.key).collection("emails");
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
            res.status(403).json(msges_1.default.error);
        }
    });
});
exports.default = routerEmails;
