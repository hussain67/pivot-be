const Presenter = require("../models/presenters.model");
const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError, BadRequestError } = require("../errors");

const register = async (req, res, next) => {
  const presenter = new Presenter(req.body);

  try {
    await presenter.save();
    const token = await presenter.createJWT();
    res.status(StatusCodes.CREATED).json({ presenter, token });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new BadRequestError("Please provide email and password");
    }

    const presenter = await Presenter.findOne({ email });
    if (!presenter) {
      throw new UnauthenticatedError("Invalid credentials");
    }
    const isPasswordCorrect = await presenter.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid credentials");
    }

    const token = await presenter.createJWT();
    res.status(StatusCodes.OK).send({ presenter, token });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  const newTokens = req.presenter.tokens.filter(el => {
    return el.token !== req.token;
  });
  req.presenter.tokens = newTokens;
  try {
    await req.presenter.save();
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

const findPresenter = async (req, res, next) => {
  try {
    res.status(200).send(req.presenter);
  } catch (error) {
    next(error);
  }
};

const deletePresenter = async (req, res, next) => {
  try {
    await req.presenter.delete();
    res.send(req.presenter);
  } catch (error) {
    next(error);
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
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, findPresenter, deletePresenter, updatePresenter };
