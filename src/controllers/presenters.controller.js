const { findOne } = require("../models/presenters.model");
const Presenter = require("../models/presenters.model");

const register = async (req, res) => {
  const presenter = new Presenter(req.body);

  try {
    await presenter.save().then(presenter => {
      res.status(201).send(presenter);
    });
  } catch (e) {
    console.log(e);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  let presenter = await Presenter.findOne({ email });
  try {
    if (!presenter) {
      res.status(401).send({ msg: "No user exists for this email" });
    }
    const isPasswordCorrect = await presenter.comparePassword(password);
    if (isPasswordCorrect) {
      const token = presenter.createJWT();
      res.status(200).json({ presenter: { name: presenter.name }, token });
    }
    if (!isPasswordCorrect) {
      res.status(401).send("Please use correct password");
    }
  } catch (e) {
    console.log(e);
  }
};

const logout = async (req, res) => {
  const newTokens = req.presenter.tokens.filter(el => {
    return el.token !== req.token;
  });
  req.presenter.tokens = newTokens;
  try {
    await req.presenter.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
};

const findPresenter = async (req, res) => {
  try {
    res.status(200).send(req.presenter);
  } catch (e) {
    console.log(e);
  }
};

module.exports = { register, login, logout, findPresenter };
