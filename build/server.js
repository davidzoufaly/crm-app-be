"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Logger_1 = __importDefault(require("./routes/middlewares/Logger"));
const Cors_1 = __importDefault(require("./routes/middlewares/Cors"));
const clients_1 = __importDefault(require("./routes/api/clients"));
const fields_1 = __importDefault(require("./routes/api/fields"));
const emails_1 = __importDefault(require("./routes/api/emails"));
const webform_1 = __importDefault(require("./routes/api/webform"));
const Users_1 = __importDefault(require("./routes/api/Users"));
const app = express_1.default();
// Init middleware
app.use(Logger_1.default);
app.use(Cors_1.default);
// Body Preser Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// API Clients
app.use("/api/clients", clients_1.default);
app.use("/api/fields", fields_1.default);
app.use("/api/emails", emails_1.default);
app.use("/api/webform", webform_1.default);
app.use("/api/users", Users_1.default);
app.use(express_1.default.static('src/data'));
app.use('/static', express_1.default.static('public'));
app.get("/", (req, res) => {
    res.send("This is backend of CRM-APP");
});
app.listen(process.env.PORT || 8080, () => {
    console.log(`CRM APP listening on port ${process.env.PORT || "8080"}!`);
});
