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
const db = "crm-app";
const routerEmails = Router();

const msges = {
  success: "Success",
  error: "Error"
};

//? Get All Emails
routerEmails.get("/", (_, res) => {
    client.connect((err, client) => {
      if (err) throw err;
      console.log(err);
      const dbTarget = client.db(db).collection("emails");
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

  //? Get email settings
  routerEmails.get("/email-settings", (_, res) => {
    client.connect((err, client) => {
      if (err) throw err;
      console.log(err);
      const dbTarget = client.db(db).collection("emailSettings");
      try {
        dbTarget.findOne({}, (err, data) => {
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

//? Number of emails
routerEmails.get("/count", (_, res) => {
  client.connect((err, client) => {
    if (err) throw err;
    console.log(err);
    const dbTarget = client.db(db).collection("emails");
    try {
      dbTarget.countDocuments({}, (err, data) => {
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

//? Save email settings
routerEmails.post("/" , (req, res) => {
    client.connect((err, client) => {
        if (err) throw err;
        console.log(err);

        const dbTarget = client.db(db).collection("emailSettings");
        try {
            dbTarget.updateOne({},{$set : req.body}, (err : any) => {
                if (err) throw err;
                res.status(200).json(msges.success)
            })
        }
        catch (err) {
            console.log(err);
        }
    })
})

//? Save and send Email
routerEmails.post("/send", (req, res) => {
  const email = req.body;
  email.date = moment().format("llll");

 client.connect((err, client) => {
    if (err) throw err;
    console.log(err);
    const dbTarget = client.db(db).collection("emails");
    try {
      dbTarget.insertOne(email);
    } catch (err) {
      console.log(err);
    }
  });

 client.connect((err, client) => {
    if (err) throw err;
    console.log(err);
    const dbTarget = client.db(db).collection("emailSettings");
    try {
      dbTarget.findOne({}, (err, data) => {
        if (err) throw err;
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: data.username,
            pass: data.pass
          }
        });

        const mailOptions = {
          from: data.username,
          to: email.to,
          subject: email.subject,
          text: email.message
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            throw error;
          } else {
              res.status(200).json({msg: msges.success});
              console.log("Email sent: " + info.response);
          }
        });
        client.close();
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: msges.error });
    }
  });
});

export default routerEmails;
