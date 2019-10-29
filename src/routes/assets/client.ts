const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
require('dotenv').config()

//? ATLAS CONNECTION
const uri = `mongodb+srv://RW:mongodb://localhost:27017/admin@cluster0-g9fj3.mongodb.net/admin?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

module.exports = client;