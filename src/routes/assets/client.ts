const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
require('dotenv').config()

//? ATLAS CONNECTION

const uri = `mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PW}@cluster0-g9fj3.mongodb.net/admin?retryWrites=true&w=majority`;

const client = new MongoClient(process.env.LOCALHOST || uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

module.exports = client;