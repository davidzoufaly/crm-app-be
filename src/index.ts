import express from "express";
import Logger from "./Logger";
import router from './routes/api/clients';

const app = express();

// Init middleware
app.use(Logger);

// Body Preser Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}))

// API Clients
app.use('/api/clients', router);

app.get("/", function(req, res) {
  res.send("This is backend of CRM-APP");
});

app.listen(8080, function() {
  console.log("CRM APP listening on port 8080!");
});
