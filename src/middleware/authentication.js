const jwt = require("jsonwebtoken");
//const Presenter = require("../models/presenter.model");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  //console.log(authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(401).send({ msg: "authentication failed" });
  }

  token = req.header("Authorization").replace("Bearer ", "");
  console.log(token);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { presenter_id: payload.presenter_Id };
    next();
  } catch (e) {
    console.log(e);
    res.status(401).send({ msg: "authentication failed" });
  }
};
module.exports = auth;
