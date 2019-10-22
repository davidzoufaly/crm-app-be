import { Router } from "express";
import { MongoClient, ObjectId } from "mongodb";
import moment from "moment";
import fs from "fs";
import generateForm from "../../generateForm";

//? LOCALHOST CONNECTION
const uri = `mongodb://localhost:27017/admin`;

const client = new MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
const db = "crm-app";
const collection = "fields";
const routerFields = Router();

const msges = {
  success: "Success",
  error: "Error"
};

//? Get All Fields
routerFields.get("/", (req, res) => {
  client.connect((err, client) => {
    if (err) throw err;
    console.log(err);
    const dbTarget = client.db(db).collection(collection);
    try {
      dbTarget.find({}).toArray((err, data) => {
        if (err) throw err;
        res.status(200).json(data);
        client.close();
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: msges.error });
    }
  });
});

//? Number of fields
routerFields.get("/count", (req, res) => {
  client.connect((err, client) => {
    if (err) throw err;
    console.log(err);
    const dbTarget = client.db(db).collection(collection);
    try {
      dbTarget.countDocuments({}, (err, data) => {
        if (err) throw err;
        res.status(200).json({ data });
        client.close();
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: msges.error });
    }
  });
});

//? Get Single Field
routerFields.get("/:id", (req, res) => {
  const id = req.params.id;
  client.connect((err, client) => {
    if (err) throw err;
    console.log(err);
    const dbTarget = client.db(db).collection(collection);
    try {
      dbTarget.findOne({ _id: new ObjectId(id) }, (err, data) => {
        if (err) throw err;
        res.status(200).json(data);
      });
      client.close();
      console.log(client.isConnected());
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: msges.error });
    }
  });
});

//? Save Field
routerFields.post("/", (req, res) => {
  let fieldObject = req.body;
  fieldObject.fieldPermanent = false;
  fieldObject.dateAdded = moment().format("llll");

  client.connect((err, client) => {
    if (err) throw err;
    console.log(err);
    const dbTarget = client.db(db).collection(collection);
    try {
      dbTarget.insertOne(fieldObject);
      res.status(200).json({ msg: msges.success });
      client.close();
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: msges.error });
    }
  });
});

//? Update multiple fields
//? generate crm-form.js on BE
//? download it on FE if query download is true
routerFields.put("/", (req, res) => {

  fs.writeFile("./src/data/crm-form.js", generateForm(req.body), function(err) {
    if (err) throw err;
    console.log("form generated");

    client.connect((err, client) => {
      if (err) throw err;
      console.log(err);
      const dbTarget = client.db(db).collection(collection);
      try {
        req.body.forEach(
          ({
            _id,
            fieldName,
            fieldType,
            fieldPermanent,
            fieldOptions,
            fieldInForm,
            fieldFormVisible,
            order
          }: any) => {
            dbTarget.updateOne(
              { _id: new ObjectId(_id) },
              {
                $set: {
                  fieldName,
                  fieldType,
                  fieldPermanent,
                  fieldOptions,
                  fieldInForm,
                  fieldFormVisible,
                  order
                }
              }
            );
          }
        );

        res.status(200).json({ msg: msges.success });

        client.close();
      } catch (err) {
        console.log(err);
        res.status(400).json({ msg: msges.error });
      }
    });
  });
});

//? Update Field
routerFields.put("/:id", (req, res) => {
  const id = req.params.id;

  client.connect((err, client) => {
    if (err) throw err;
    console.log(err);
    const dbTarget = client.db(db).collection(collection);
    try {
      dbTarget.updateOne({ _id: new ObjectId(id) }, { $set: req.body });
      res.status(200).json({ msg: msges.success });
      client.close();
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: msges.error });
    }
  });
});

//? Delete Field
routerFields.delete("/:id", (req, res) => {
  const id = req.params.id;

  client.connect((err, client) => {
    if (err) throw err;
    console.log(err);
    const dbTarget = client.db(db).collection(collection);
    try {
      dbTarget.deleteOne({ _id: new ObjectId(id) });
      res.status(200).json({ msg: msges.success });
      client.close();
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: msges.error });
    }
  });
});

export default routerFields;
