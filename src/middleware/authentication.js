const jwt = require("jsonwebtoken");
const Presenter = require("../models/presenters.model");
const { UnauthenticatedError } = require("../errors");
const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  try {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthenticatedError("Authentication invalid");
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const presenter = await Presenter.findOne({ _id: decoded._id, "tokens.token": token });

    if (!presenter) {
      throw new UnauthenticatedError("Authentication invalid");
    }
    req.token = token;
    req.presenter = presenter;

    next();
  } catch (error) {
    next(error);
  }
};
module.exports = auth;
