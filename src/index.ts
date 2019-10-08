import express from "express";
import Logger from "./routes/middlewares/Logger";
import Cors from './routes/middlewares/Cors';
import router from './routes/api/clients';

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
app.use(express.urlencoded({extended: false}))

// API Clients
app.use('/api/clients', router);

app.get("/", function(req, res) {
  res.send("This is backend of CRM-APP");
});

app.listen(8080, function() {
  console.log("CRM APP listening on port 8080!");
});
