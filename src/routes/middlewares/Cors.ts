const Cors = (_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS, PUT");

  next();
};

module.exports = Cors;
