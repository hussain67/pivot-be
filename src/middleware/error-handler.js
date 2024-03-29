const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || 500,
    msg: err.message || "Something went wrong, try again latter "
  };
  //console.log(err.message);

  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map(item => {
        return item;
      })
      .join(", ");
    customError.statusCode = 400;
  }
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field please choose another value`;
    customError.statusCode = 400;
  }
  if (err.name === "CastError") {
    customError.msg = `No item found with id ${err.value}`;
    customError.statusCode = 404;
  }
  if (err.name === "JsonWebTokenError" && err.message === "jwt malformed") {
    (customError.statusCode = 401), (customError.msg = "Authentication failed");
  }
  //console.log(customError.statusCode, customError.msg);
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
