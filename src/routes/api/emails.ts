export {};
const nodemailer = require("nodemailer")
const express = require("express");
const routerEmails = express.Router();
const moment = require("moment");
const msges = require("../assets/msges");
const client = require("../assets/client");


//? Get All Emails
routerEmails.get("/", (req, res) => {
    client.connect((err, client) => {
      if (err) throw err;
      console.log(err);
      const dbTarget = client.db(req.query.key).collection("emails");
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
  
//? Get Last campaign
routerEmails.get("/last", (req, res) => {
  client.connect((err, client) => {
    if (err) throw err;
    console.log(err);
    const dbTarget = client.db(req.query.key).collection("emails");
    try {
      dbTarget.find({}).limit(1).sort({date: -1}).toArray((err, data) => {
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
  routerEmails.get("/email-settings", (req, res) => {
    client.connect((err, client) => {
      if (err) throw err;
      console.log(err);
      const dbTarget = client.db(req.query.key).collection("settings");
      try {
        dbTarget.findOne({settingsName : "emailSettings"}, (err, data) => {
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
routerEmails.get("/count", (req, res) => {
  client.connect((err, client) => {
    if (err) throw err;
    console.log(err);
    const dbTarget = client.db(req.query.key).collection("emails");
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

        const dbTarget = client.db(req.query.key).collection("settings");
        try {
            dbTarget.updateOne({settingsName: "emailSettings"},{$set : req.body}, (err : any) => {
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
    const dbTarget = client.db(req.query.key).collection("settings");
    try {
      dbTarget.findOne({settingsName: "emailSettings"}, (err, data) => {
        if (err) throw err;

        if (data.username.includes("@") && data.pass.length !== 0) {
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
              console.log(error);
              throw error;
            } else {
                res.status(200).json(msges.success);
                console.log("Email sent: " + info.response);
  
                client.connect((err, client) => {
                  if (err) throw err;
                  console.log(err);
                  const dbTarget = client.db(req.query.key).collection("emails");
                  try {
                    dbTarget.insertOne(email);
                  } catch (err) {
                    console.log(err);
                  }
                });
            }
          });
        } else {
          res.status(200).json("Setup your email settings first"); 
        }
        client.close();
      });
    } catch (err) {
      console.log(err);
      res.status(403).json(msges.error);
    }
  });
});

module.exports = routerEmails;
