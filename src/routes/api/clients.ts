import { Router } from "express";
import { Request, Response } from "express";
import { MongoClient, ObjectId } from "mongodb";

//TODO: REFACTORING NA JEDNO PŘIPOJENÍ A VNOŘENÍ ROUTER IN?

//? ATLAS CONNECTION
// const username = "RW";
// const password = "vjODZjlKTSIFKISV";
// const uri = `mongodb+srv://${username}:${password}@cluster0-g9fj3.mongodb.net/admin?retryWrites=true&w=majority`;

//? LOCALHOST CONNECTION
const uri = `mongodb://localhost:27017/admin`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = "crm-app";
const collection = "clients";
const router = Router();

const msges = {
  success: "Success",
  error: "Error"
};

//? Get All Clients
router.get("/", (req, res) => {
  client.connect(err => {
    if (err) throw err;
    console.log(err);
    const dbTarget = client.db(db).collection(collection);
    try {
      dbTarget.find({}).toArray((error, data) => {
        if (err) throw error;
        res.send(data);
        client.close();
      });
    } catch (err) {
      console.log(err);
    }
  });
});

//? Get Single Client
router.get("/:id", (req, res) => {
  const id = req.params.id;
  client.connect(err => {
    if (err) throw err;
    console.log(err);
    const dbTarget = client.db(db).collection(collection);
    try {
      dbTarget.findOne({ _id: new ObjectId(id) }, (error, data) => {
        if (err) throw error;
        res.send(data);
        client.close();
      });
    } catch (err) {
      console.log(err);
    }
  });
});

//? Create Client
router.post("/", (req, res) => {
  interface newClientOptions {
    name: string;
    age: number;
    address: string;
  }

  const newClient: newClientOptions = {
    name: req.body.name,
    age: req.body.age,
    address: req.body.address
  };

  client.connect(err => {
    if (err) throw err;
    console.log(err);
    const dbTarget = client.db(db).collection(collection);
    try {
      dbTarget.insertOne(newClient);
      res.status(200).json({ msg: msges.success });
      client.close();
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: msges.error });
    }
  });
});

//? Update Client
router.put("/:id", (req, res) => {
  const id = req.params.id;

  interface changeClientOptions {
    name: string;
    age: number;
    address: string;
  }

  //? Update changed fields, other fields will be kept with old data.
  const $set: changeClientOptions = {
    name: req.body.name,
    age: req.body.age,
    address: req.body.address
  };

  client.connect(err => {
    if (err) throw err;
    console.log(err);
    const dbTarget = client.db(db).collection(collection);
    try {
      dbTarget.updateOne({ _id: new ObjectId(id) }, { $set });
      res.status(200).json({ msg: msges.success });
      client.close();
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: msges.error });
    }
  });
});

//? Client member
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  client.connect(err => {
    if (err) throw err;
    console.log(err);
    const dbTarget = client.db(db).collection(collection);
    try {
      dbTarget.remove({ _id: new ObjectId(id) });
      res.status(200).json({ msg: msges.success });
      client.close();
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: msges.error });
    }
  });
});

export default router;
