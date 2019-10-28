import { Router } from "express";
import fs from "fs";
import generateForm from "../../generateForm";
import msges from "../assets/msges";
import client from "../assets/client";

const routerWebForm = Router();

//? Generate form and download it
routerWebForm.get("/", (req, res) => {
  client.connect((err, client) => {
    const dbTarget = client.db(req.query.key).collection("fields")
    try {
      dbTarget.find({}).toArray((err, data) => {
        if (err) throw err;
        fs.writeFile(`./src/data/crm-form-${req.query.key}.js`, generateForm(data), function(err) {
          res.status(200).download(`./src/data/crm-form-${req.query.key}.js`);
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

export default routerWebForm;
