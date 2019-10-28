"use strict";
exports.__esModule = true;
var express_1 = require("express");
var fs_1 = require("fs");
var generateForm_1 = require("../../generateForm");
var msges_1 = require("../assets/msges");
var client_1 = require("../assets/client");
var routerWebForm = express_1.Router();
//? Generate form and download it
routerWebForm.get("/", function (req, res) {
    client_1["default"].connect(function (err, client) {
        var dbTarget = client.db(req.query.key).collection("fields");
        try {
            dbTarget.find({}).toArray(function (err, data) {
                if (err)
                    throw err;
                fs_1["default"].writeFile("./src/data/crm-form-" + req.query.key + ".js", generateForm_1["default"](data), function (err) {
                    res.status(200).download("./src/data/crm-form-" + req.query.key + ".js");
                    client.close();
                });
            });
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1["default"].error });
        }
    });
});
//? NOT USED - Update WebForm settings
// routerWebForm.put("/", (req, res) => {
//   client.connect((err, client) => {
//     if (err) throw err;
//     console.log(err);
//     const dbTarget = client.db(db).collection(collection);
//     try {
//       dbTarget.updateOne({settingsName: "webFormSettings"}, { $set: req.body }, (err, data) => {
//         if (err) throw err;
//         res.status(200).json({ data });
//         client.close();
//       });
//     } catch (err) {
//       console.log(err);
//       res.status(400).json({ msg: msges.error });
//     }
//   });
// });
exports["default"] = routerWebForm;
