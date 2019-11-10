export {};
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const express = require("express");
const routerFields = express.Router();
const moment = require("moment");
const msges = require("../assets/msges");
const client = require("../assets/client");

const collection = "fields";

//? Get All Fields
routerFields.get("/", (req, res) => {
  client.connect((err, client) => {
    if (err) throw err;
    console.log(err);
    const dbTarget = client.db(req.query.key).collection(collection);
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
    const dbTarget = client.db(req.query.key).collection(collection);
    try {
      dbTarget.find({}).toArray((err, data) => {
        if (err) throw err;
        const permanent = data.filter(e => e.fieldPermanent).length;
        const custom = data.filter(e => !e.fieldPermanent).length;
        res.status(200).json({permanent, custom});
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
    const dbTarget = client.db(req.query.key).collection(collection);
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

//? Create Field
routerFields.post("/", (req, res) => {
  let fieldObject = req.body;
  fieldObject.fieldPermanent = false;
  fieldObject._id = new ObjectId(fieldObject._id);
  fieldObject.dateAdded = moment().format("llll");

  client.connect((err, client) => {
    if (err) throw err;
    console.log(err);
    const dbTarget = client.db(req.query.key).collection(collection);
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
routerFields.put("/", (req, res) => {
    client.connect((err, client) => {
      if (err) throw err;
      console.log(err);
      const dbTarget = client.db(req.query.key).collection(collection);
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

//? Update Field
routerFields.put("/:id", (req, res) => {
  const id = req.params.id;

  client.connect((err, client) => {
    if (err) throw err;
    console.log(err);
    const dbTarget = client.db(req.query.key).collection(collection);
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
    const dbTarget = client.db(req.query.key).collection(collection);
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

module.exports = routerFields;
