const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { createTokenUser, attachCookiesToResponse, checkPermissions } = require("../utils");

const getAllUsers = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      throw new UnauthenticatedError("Not authorized to access this route");
    }
    const users = await User.find({ role: "user" }).select("-password");
    res.status(StatusCodes.OK).json({ users });
  } catch (error) {
    next(error);
  }
};
const getSingleUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select("-password");
    if (!user) {
      throw new BadRequestError("Invalid credentials");
    }
    checkPermissions(req.user, user._id);
    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    next(error);
  }
};

//Return an existing user
const showUser = async (req, res, next) => {
  //console.log(req.user);
  try {
    res.status(StatusCodes.OK).json({ user: req.user });
  } catch (error) {
    next(error);
  }
};
// Delete an user
const deleteUser = async (req, res, next) => {
  const { userId } = req.user;

  try {
    const user = await User.findOneAndDelete({ _id: userId });
    if (!user) {
      throw new NotFoundError(`No user found with id ${userId}`);
    }
    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  const { userId } = req.user;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new NotFoundError(`No user found with id ${userId}`);
  }

  try {
    updates.forEach(update => (user[update] = req.body[update]));
    user.save();
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    next(error);
  }
};

/*
const updateUser = async (req, res, next) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new BadRequestError("Name and email are required");
  }

  try {
    const user = await User.findOne({ _id: req.user.userId });
    user.name = name;
    user.email = email;
    await user.save();
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser });
  } catch (error) {
    next(error);
  }
};
const updateUserPassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new BadRequestError("Both Values are required");
  }
  const user = await User.findOne({ _id: req.user.userId });
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  user.password = newPassword;
  await user.save();

  try {
    res.status(StatusCodes.OK).json({ msg: "Success! password updated" });
  } catch (error) {
    next(error);
  }
};
*/

module.exports = {
  getAllUsers,
  getSingleUser,
  showUser,
  deleteUser,
  updateUser
  //updateUserPassword
};
