const invalideUrlMiddleware = async (req, res) => {
  res.status(404).send({ msg: `Can't find ${req.originalUrl} on this server!` });
};

module.exports = invalideUrlMiddleware;
