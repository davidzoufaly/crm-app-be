"use strict";
exports.__esModule = true;
var express_1 = require("express");
var mongodb_1 = require("mongodb");
var moment_1 = require("moment");
var msges_1 = require("../assets/msges");
var client_1 = require("../assets/client");
var collection = "fields";
var routerFields = express_1.Router();
//? Get All Fields
routerFields.get("/", function (req, res) {
    client_1["default"].connect(function (err, client) {
        if (err)
            throw err;
        console.log(err);
        var dbTarget = client.db(req.query.key).collection(collection);
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
//? Number of fields
routerFields.get("/count", function (req, res) {
    client_1["default"].connect(function (err, client) {
        if (err)
            throw err;
        console.log(err);
        var dbTarget = client.db(req.query.key).collection(collection);
        try {
            dbTarget.find({}).toArray(function (err, data) {
                if (err)
                    throw err;
                var permanent = data.filter(function (e) { return e.fieldPermanent; }).length;
                var custom = data.filter(function (e) { return !e.fieldPermanent; }).length;
                res.status(200).json({ permanent: permanent, custom: custom });
                client.close();
            });
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1["default"].error });
        }
    });
});
//? Get Single Field
routerFields.get("/:id", function (req, res) {
    var id = req.params.id;
    client_1["default"].connect(function (err, client) {
        if (err)
            throw err;
        console.log(err);
        var dbTarget = client.db(req.query.key).collection(collection);
        try {
            dbTarget.findOne({ _id: new mongodb_1.ObjectId(id) }, function (err, data) {
                if (err)
                    throw err;
                res.status(200).json(data);
            });
            client.close();
            console.log(client.isConnected());
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1["default"].error });
        }
    });
});
//? Create Field
routerFields.post("/", function (req, res) {
    var fieldObject = req.body;
    fieldObject.fieldPermanent = false;
    fieldObject._id = new mongodb_1.ObjectId(fieldObject._id);
    fieldObject.dateAdded = moment_1["default"]().format("llll");
    client_1["default"].connect(function (err, client) {
        if (err)
            throw err;
        console.log(err);
        var dbTarget = client.db(req.query.key).collection(collection);
        try {
            dbTarget.insertOne(fieldObject);
            res.status(200).json({ msg: msges_1["default"].success });
            client.close();
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1["default"].error });
        }
    });
});
//? Update multiple fields
//? generate crm-form.js on BE
routerFields.put("/", function (req, res) {
    client_1["default"].connect(function (err, client) {
        if (err)
            throw err;
        console.log(err);
        var dbTarget = client.db(req.query.key).collection(collection);
        try {
            req.body.forEach(function (_a) {
                var _id = _a._id, fieldName = _a.fieldName, fieldType = _a.fieldType, fieldPermanent = _a.fieldPermanent, fieldOptions = _a.fieldOptions, fieldInForm = _a.fieldInForm, fieldFormVisible = _a.fieldFormVisible, order = _a.order;
                dbTarget.updateOne({ _id: new mongodb_1.ObjectId(_id) }, {
                    $set: {
                        fieldName: fieldName,
                        fieldType: fieldType,
                        fieldPermanent: fieldPermanent,
                        fieldOptions: fieldOptions,
                        fieldInForm: fieldInForm,
                        fieldFormVisible: fieldFormVisible,
                        order: order
                    }
                });
            });
            res.status(200).json({ msg: msges_1["default"].success });
            client.close();
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1["default"].error });
        }
    });
});
//? Update Field
routerFields.put("/:id", function (req, res) {
    var id = req.params.id;
    client_1["default"].connect(function (err, client) {
        if (err)
            throw err;
        console.log(err);
        var dbTarget = client.db(req.query.key).collection(collection);
        try {
            dbTarget.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: req.body });
            res.status(200).json({ msg: msges_1["default"].success });
            client.close();
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1["default"].error });
        }
    });
});
//? Delete Field
routerFields["delete"]("/:id", function (req, res) {
    var id = req.params.id;
    client_1["default"].connect(function (err, client) {
        if (err)
            throw err;
        console.log(err);
        var dbTarget = client.db(req.query.key).collection(collection);
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
exports["default"] = routerFields;
