"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Logger = require("./routes/middlewares/Logger");
const Cors = require("./routes/middlewares/Cors");
const routerClients = require("./routes/api/clients");
const routerFields = require("./routes/api/fields");
const routerEmails = require("./routes/api/emails");
const routerWebForm = require("./routes/api/webform");
const routerUsers = require("./routes/api/users");
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
app.use("/api/users", routerUsers);
app.use(express.static('src/data'));
app.use('/static', express.static('public'));
app.get("/", (req, res) => {
    res.send("This is backend of lightweight CRM-APP");
});
app.listen(process.env.PORT || 8080, () => {
    console.log(`CRM APP listening on port ${process.env.PORT || "8080"}!`);
});
