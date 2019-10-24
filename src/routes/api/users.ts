import nodemailer from "nodemailer";
import { Router } from "express";
import { MongoClient, ObjectId } from "mongodb";
import moment from "moment";

//? LOCALHOST CONNECTION
const uri = `mongodb://localhost:27017/admin`;

const client = new MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
const db = "users";
const collection = "users";
const routerUsers = Router();

const msges = {
  success: "Success",
  error: "Error",
  exist: "Exist"
};

//? Register
routerUsers.post("/", (req, res) => {
  client.connect((err, client) => {
    if (err) throw err;
    console.log(err);
    const dbTarget = client.db(db).collection(collection);
    try {
        //check if user exists, if not insert him, else do nothing and return msg
      dbTarget.findOneAndUpdate(
        { username: req.body.username },
        { $setOnInsert: req.body },
        { upsert: true },
        (_, data) => {
          // no data came back -> user does not exist and was created
          if (data.value === null) {
            // continue to setup new user own DB
            const dbTarget = client.db(req.body.username);

            const defaultFields = [
              {
                fieldName: "First name",
                fieldType: "text",
                fieldPermanent: true,
                fieldFormVisible: null,
                fieldOptions: [],
                fieldInForm: false
              },
              {
                fieldName: "Last name",
                fieldType: "text",
                fieldPermanent: true,
                fieldFormVisible: null,
                fieldOptions: [],
                fieldInForm: false
              },
              {
                fieldName: "Email",
                fieldType: "text",
                fieldPermanent: true,
                fieldFormVisible: null,
                fieldOptions: [],
                fieldInForm: false
              },
              {
                fieldName: "Date added",
                fieldType: "text",
                fieldPermanent: true,
                fieldFormVisible: null,
                fieldOptions: [],
                fieldInForm: false
              },
              {
                fieldName: "Last modified",
                fieldType: "text",
                fieldPermanent: true,
                fieldFormVisible: null,
                fieldOptions: [],
                fieldInForm: false
              }
            ];

            Promise.all([
              dbTarget.createCollection("clients"),
              dbTarget.createCollection("emails"),
              dbTarget.collection("settings").insertOne({
                settingsName: "emailSettings",
                username: "",
                pass: ""
              }),
              dbTarget.collection("fields").insertMany(defaultFields)
            ])
              .then(() => {
                res.status(200).json({ msg: msges.success });
              })
              .catch(reason => {
                console.log(reason);
                res.status(400).send({ msg: msges.error });
              });
          } else {
            res.status(200).json({ msg: msges.exist });
          }
        }
      );
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: msges.error });
    }
  });
});

//create DB
// routerUsers.post("/new-db2", (req, res) => {
//     client.connect((err, client) => {
//         if (err) throw err;
//         console.log(err);
//         const dbTarget = client.db(req.body.id);

//         const defaultFields = [
//             {
//                 fieldName: "First name",
//                 fieldType: "text",
//                 fieldPermanent: true,
//                 fieldFormVisible: null,
//                 fieldOptions: [],
//                 fieldInForm: false
//             },
//             {
//                 fieldName: "Last name",
//                 fieldType: "text",
//                 fieldPermanent: true,
//                 fieldFormVisible: null,
//                 fieldOptions: [],
//                 fieldInForm: false
//             },
//             {
//                 fieldName: "Email",
//                 fieldType: "text",
//                 fieldPermanent: true,
//                 fieldFormVisible: null,
//                 fieldOptions: [],
//                 fieldInForm: false
//             },
//             {
//                 fieldName: "Date added",
//                 fieldType: "text",
//                 fieldPermanent: true,
//                 fieldFormVisible: null,
//                 fieldOptions: [],
//                 fieldInForm: false
//             },
//             {
//                 fieldName: "Last modified",
//                 fieldType: "text",
//                 fieldPermanent: true,
//                 fieldFormVisible: null,
//                 fieldOptions: [],
//                 fieldInForm: false
//             }
//         ]

//         Promise
//         .all([
//             dbTarget.createCollection("clients"),
//             dbTarget.createCollection("emails"),
//             dbTarget.collection("settings").insertOne({
//                 settingsName: "emailSettings",
//                 username: "",
//                 pass: ""
//             }),
//             dbTarget.collection("fields").insertMany(defaultFields)
//         ])
//         .then(() => {
//             return res.send({ success: true });
//         })
//         .catch((reason) => {
//             console.log(reason);
//             return res.status(400).send({ reason: 'unknown' });
//         });
//     });
// });

// login
routerUsers.post("/authenticate-user", (req, res) => {
  client.connect((err, client) => {
    if (err) throw err;
    console.log(err);
    const dbTarget = client.db(db).collection(collection);
    try {
      dbTarget.findOne({ username: req.body.username }, (err, data) => {
        data === null
          ? res.status(200).json({ msg: msges.error })
          : data.password === req.body.password
          ? res.status(200).json({ msg: msges.success })
          : res.status(200).json({ msg: msges.error });
        if (err) throw err;
      });
      client.close();
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: msges.error });
    }
  });
});

export default routerUsers;