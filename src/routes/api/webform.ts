export {}
const express = require("express");
const routerWebForm = express.Router();
const fs = require("fs");
const msges = require("../assets/msges");
const client = require("../assets/client");
const generateForm = require("../../generateForm");

//? Generate form and download it
routerWebForm.get("/", (req, res) => {
  const key = req.query.key;
  
  client.connect((err, client) => {
    if (err) throw err;
    console.log(err);
    const dbTarget = client.db(req.query.key).collection("fields")
    try {
      dbTarget.find({}).toArray((err, data) => {
        if (err) throw err;
        const host = `${req.protocol}://${req.get('host')}`;
        fs.writeFile(`./src/data/crm-form-${key}.js`, generateForm(data, key, host), function(err) {
          res.status(200).download(`./src/data/crm-form-${key}.js`);
          client.close();
        })
      })
    } catch(err) {
      console.log(err);
      res.status(400).json({msg: msges.error})
    }
  })
})

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

module.exports = routerWebForm;
