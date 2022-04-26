const Presenter = require("../models/presenterAuth.model");

const register = async (req, res) => {
  console.log(req.body);
  const user = new Presenter(req.body);

  try {
    await user.save().then(presenter => {
      console.log(user);
      res.status(201).send(presenter);
    });
  } catch (e) {
    console.log(e);
  }
};

const logIn = async (req, res) => {
  //console.log(req.body);
};

module.exports = { register, logIn };
