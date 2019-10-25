import { Router } from "express";
import { MongoClient } from "mongodb";
import fs from "fs";
import generateForm from "../../generateForm";

//? ATLAS CONNECTION
// const username = "RW";
// const password = "vjODZjlKTSIFKISV";
// const uri = `mongodb+srv://${username}:${password}@cluster0-g9fj3.mongodb.net/admin?retryWrites=true&w=majority`;

//? LOCALHOST CONNECTION
const uri = `mongodb://localhost:27017/admin`;

const client = new MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
const db = "crm-app";
const collection = "settings";
const routerWebForm = Router();
const msges = {
  success: "Success",
  error: "Error"
};


//? Generate form and download it
routerWebForm.get("/", (req, res) => {
  client.connect((err, client) => {
    const dbTarget = client.db(req.query.key).collection("fields")
    try {
      dbTarget.find({}).toArray((err, data) => {
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
