const jwt = require("jsonwebtoken");
const Presenter = require("../models/presenters.model");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(401).send({ msg: "authentication failed" });
  }

  try {
    token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const presenter = await Presenter.findOne({ _id: decoded.id, "tokens.token": token });
    if (!presenter) {
      res.status(400).send();
    }
    req.presenter = presenter;
    req.token = token;
    next();
  } catch (e) {
    console.log(e);
    res.status(401).send({ msg: "authentication failed" });
  }
};
module.exports = auth;
