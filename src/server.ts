import express from "express";
import Logger from "./routes/middlewares/Logger";
import Cors from "./routes/middlewares/Cors";
import routerClients from "./routes/api/clients";
import routerFields from "./routes/api/fields";
import path from "path";
import routerEmails from "./routes/api/emails";
import fs from "fs";
import generateForm from "./generateForm";
import routerWebForm from "./routes/api/webform";

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

// API Clients
app.use("/api/clients", routerClients);
app.use("/api/fields", routerFields);
app.use("/api/emails", routerEmails);
app.use("/api/webform", routerWebForm);

app.use(express.static('src/data'))
app.use('/static', express.static('public'))

app.get("/", (req, res) => {
  res.send("This is backend of CRM-APP");
});

app.listen(8080, () => {
  console.log("CRM APP listening on port 8080!");
});
