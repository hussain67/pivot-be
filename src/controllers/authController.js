const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError, BadRequestError } = require("../errors");

const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // first registered user is an admin
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? "admin" : "user";

    const user = await User.create({ name, email, password, role });
    if (!user) {
      throw new BadRequestError("Invalid credentials");
    }

    const token = jwt.sign({ userId: user._id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });

    res.status(StatusCodes.CREATED).json({ user: { name: user.name, id: user._id }, token });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError("Invalid credentials");
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid credentials");
    }

    const { name, _id, role } = user;
    const token = jwt.sign({ name, userId: _id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });

    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "user logged out" });
};

module.exports = { register, login, logout };
