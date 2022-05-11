const Presenter = require("../models/presenters.model");
const register = async (req, res, next) => {
  const presenter = new Presenter(req.body);

  try {
    await presenter.save();
    const token = await presenter.createJWT();
    res.status(201).send({ presenter, token });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const presenter = await Presenter.findByCredentials(email, password);
    const token = await presenter.createJWT();
    res.status(200).send({ presenter, token });
  } catch (error) {
    next(error);
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
    res.status(401).send(e);
  }
};

const deletePresenter = async (req, res) => {
  try {
    await req.presenter.delete();
    res.send(req.presenter);
  } catch (e) {
    res.status(500).send();
  }
};

const updatePresenter = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowableUpdates = ["name", "email", "password"];
  const isValidOperation = updates.every(update => allowableUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    updates.forEach(update => {
      req.presenter[update] = req.body[update];
    });

    await req.presenter.save();
    res.status(200).send(req.presenter);
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports = { register, login, logout, findPresenter, deletePresenter, updatePresenter };
