exports.handleInvalidUrlErrors = (req, res) => {
  res.status(404).send({ msg: `Can't find ${req.originalUrl} on this server!` });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (res.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};
exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
};
