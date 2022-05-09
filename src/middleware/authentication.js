const jwt = require("jsonwebtoken");
const Presenter = require("../models/presenters.model");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const presenter = await Presenter.findOne({ _id: decoded.id, "tokens.token": token });
    if (!presenter) {
      throw new Error();
    }
    req.presenter = presenter;
    req.token = token;

    next();
  } catch (err) {
    res.status(401).send({ error: "authentication failed" });
  }
};
module.exports = auth;
