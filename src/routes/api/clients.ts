import { Router } from "express";
import { MongoClient, ObjectId } from "mongodb";
import moment from "moment";

//TODO: Ondstranit alerty v consoli

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
const collection = "clients";
const routerClients = Router();
client.isConnected;
const msges = {
  success: "Success",
  error: "Error"
};

//? Get All Clients
routerClients.get("/", (_, res) => {
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

//? Delete multiple object
routerClients.delete("/", (req, res) => {
  const ids = req.body.map((e: string) => new ObjectId(e));

  client.connect((err, client) => {
    if (err) throw err;
    console.log(err);
    const dbTarget = client.db(db).collection(collection);
    try {
      dbTarget.deleteMany({ _id: { $in: ids } }, err => {
        if (err) throw err;
        res.status(200).json({ msg: msges.success });
        client.close();
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: msges.error });
    }
  });
});

//? Number of clients
routerClients.get("/count", (req, res) => {
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

//? Get Single Client
routerClients.get("/:id", (req, res) => {
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
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: msges.error });
    }
  });
});

//? Create Client
routerClients.post("/", (req, res) => {
  let reqObject = req.body;
  reqObject._id = new ObjectId(reqObject._id);

  client.connect((err, client) => {
    if (err) throw err;
    console.log(err);
    const dbTarget = client.db(db).collection(collection);
    try {
      dbTarget.insertOne(reqObject);
      res.status(200).json({ msg: msges.success });
      client.close();
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: msges.error });
    }
  });
});

//? Update Client
routerClients.put("/:id", (req, res) => {
  const id = req.params.id;

  let reqObject = req.body;
  // remove id from req -> cant be passed to DB
  delete reqObject["_id"];

  client.connect((err, client) => {
    if (err) throw err;
    console.log(err);
    const dbTarget = client.db(db).collection(collection);
    try {
      dbTarget.updateOne({ _id: new ObjectId(id) }, { $set: reqObject });
      res.status(200).json({ msg: msges.success });
      client.close();
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: msges.error });
    }
  });
});

//? Client delete
routerClients.delete("/:id", (req, res) => {
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

export default routerClients;
