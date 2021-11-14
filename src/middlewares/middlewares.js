const ErrorResponse = require("../classes/error-response");

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


module.exports = {
  asyncHandler,
  notFound,
  errorHandler,
};
