"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const generateForm_1 = __importDefault(require("../../generateForm"));
const msges_1 = __importDefault(require("../assets/msges"));
const client_1 = __importDefault(require("../assets/client"));
const routerWebForm = express_1.Router();
//? Generate form and download it
routerWebForm.get("/", (req, res) => {
    client_1.default.connect((err, client) => {
        const dbTarget = client.db(req.query.key).collection("fields");
        try {
            dbTarget.find({}).toArray((err, data) => {
                if (err)
                    throw err;
                fs_1.default.writeFile(`./src/data/crm-form-${req.query.key}.js`, generateForm_1.default(data), function (err) {
                    res.status(200).download(`./src/data/crm-form-${req.query.key}.js`);
                    client.close();
                });
            });
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ msg: msges_1.default.error });
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
exports.default = routerWebForm;
