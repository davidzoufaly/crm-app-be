import express from "express";
import Logger from "./routes/middlewares/Logger";
import Cors from "./routes/middlewares/Cors";
import routerClients from "./routes/api/clients";
import routerFields from "./routes/api/fields";
import routerEmails from "./routes/api/emails";
import fs from "fs";
import generateForm from "./generateForm";

/*TODO: FIXNOUT .close() 
the options [servers] is not supported
the options [caseTranslate] is not supported
the options [dbName] is not supported
null
*/

const app = express();

// Init middleware
app.use(Logger);
app.use(Cors);

// Body Preser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//create
app.post("/file-create", (req, res) => {
  console.log(req.query.download);
  fs.writeFile("./src/data/crm-form.js", generateForm(req.body), function(err) {
    if (err) throw err;
    console.log("Saved!");
    res.download("./src/data/crm-form.js");
  });
});

//download
app.get("/file-download", (_, res) => {
  res.download("demofile.txt");
});

// API Clients
app.use("/api/clients", routerClients);
app.use("/api/fields", routerFields);
app.use("/api/emails", routerEmails);

app.get("/", (req, res) => {
  res.send("This is backend of CRM-APP");
});

app.listen(8080, () => {
  console.log("CRM APP listening on port 8080!");
});
