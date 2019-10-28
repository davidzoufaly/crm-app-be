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
const collection = "fields";
const routerFields = express_1.Router();
//? Get All Fields
routerFields.get("/", (req, res) => {
    client_1.default.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.query.key).collection(collection);
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
//? Number of fields
routerFields.get("/count", (req, res) => {
    client_1.default.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.query.key).collection(collection);
        try {
            dbTarget.find({}).toArray((err, data) => {
                if (err)
                    throw err;
                const permanent = data.filter(e => e.fieldPermanent).length;
                const custom = data.filter(e => !e.fieldPermanent).length;
                res.status(200).json({ permanent, custom });
                client.close();
            });
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1.default.error });
        }
    });
});
//? Get Single Field
routerFields.get("/:id", (req, res) => {
    const id = req.params.id;
    client_1.default.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.query.key).collection(collection);
        try {
            dbTarget.findOne({ _id: new mongodb_1.ObjectId(id) }, (err, data) => {
                if (err)
                    throw err;
                res.status(200).json(data);
            });
            client.close();
            console.log(client.isConnected());
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1.default.error });
        }
    });
});
//? Create Field
routerFields.post("/", (req, res) => {
    let fieldObject = req.body;
    fieldObject.fieldPermanent = false;
    fieldObject._id = new mongodb_1.ObjectId(fieldObject._id);
    fieldObject.dateAdded = moment_1.default().format("llll");
    client_1.default.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.query.key).collection(collection);
        try {
            dbTarget.insertOne(fieldObject);
            res.status(200).json({ msg: msges_1.default.success });
            client.close();
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1.default.error });
        }
    });
});
//? Update multiple fields
//? generate crm-form.js on BE
routerFields.put("/", (req, res) => {
    client_1.default.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.query.key).collection(collection);
        try {
            req.body.forEach(({ _id, fieldName, fieldType, fieldPermanent, fieldOptions, fieldInForm, fieldFormVisible, order }) => {
                dbTarget.updateOne({ _id: new mongodb_1.ObjectId(_id) }, {
                    $set: {
                        fieldName,
                        fieldType,
                        fieldPermanent,
                        fieldOptions,
                        fieldInForm,
                        fieldFormVisible,
                        order
                    }
                });
            });
            res.status(200).json({ msg: msges_1.default.success });
            client.close();
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1.default.error });
        }
    });
});
//? Update Field
routerFields.put("/:id", (req, res) => {
    const id = req.params.id;
    client_1.default.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.query.key).collection(collection);
        try {
            dbTarget.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: req.body });
            res.status(200).json({ msg: msges_1.default.success });
            client.close();
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1.default.error });
        }
    });
});
//? Delete Field
routerFields.delete("/:id", (req, res) => {
    const id = req.params.id;
    client_1.default.connect((err, client) => {
        if (err)
            throw err;
        console.log(err);
        const dbTarget = client.db(req.query.key).collection(collection);
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
exports.default = routerFields;
