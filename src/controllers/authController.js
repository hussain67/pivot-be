const User = require("../models/userModel");

const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError, BadRequestError } = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils");

const register = async (req, res, next) => {
  // console.log(req.body);
  const { name, email, password } = req.body;

  try {
    // first registered user is an admin
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? "admin" : "user";

    const user = await User.create({ name, email, password, role });
    if (!user) {
      throw new BadRequestError("Invalid credentials");
    }
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ req, res, user: tokenUser });
    res.status(StatusCodes.CREATED).json({ user: { name: user.name } });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  //console.log(req.body);
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
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ req, res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: { name: user.name } });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now())
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out" });
};

module.exports = { register, login, logout };
