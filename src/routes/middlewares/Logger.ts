const moment = require("moment");

const Logger = (req, _, next) => {
    console.log(`Logger se hlásí: ${req.protocol}://${req.get('host')}${req.originalUrl} metoda: ${req.method} ${moment().format()}`);
    next();
} 

module.exports = Logger;