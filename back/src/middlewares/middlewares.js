const ErrorResponse = require("../classes/error-response");
const { Client } = require("pg");

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const notFound = (req, _res, next) => {
  next(new ErrorResponse(`Not found - ${req.originalUrl}`, 404));
};

const errorHandler = (err, _req, res, _next) => {
  console.log("Ошибка", {
    message: err.message,
    stack: err.stack,
  });
  res.status(err.code || 500).json({
    message: err.message,
  });
};

const connectionHandler = async (req, res, next) => {
  const client = new Client({
    port: 5432,
    host: "localhost",
    database: "myPracticeDb",
    user: req.headers.login,
    password: req.headers.password,
  });
  req.client = client;
  next();
};

module.exports = {
  asyncHandler,
  notFound,
  errorHandler,
  connectionHandler,
};
