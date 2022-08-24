const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Presentation = require("../models/presentationModel");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "msh1",
  email: "msh1@example.com",
  password: "msh123451",
  tokens: [{ token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET) }]
};
const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "msh2",
  email: "msh2@example.com",
  password: "msh223451",
  tokens: [{ token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET) }]
};
const userThreeId = new mongoose.Types.ObjectId();
const userThree = {
  _id: userThreeId,
  name: "msh3",
  email: "msh3@example.com",
  password: "msh3234513",
  tokens: [{ token: jwt.sign({ _id: userThreeId }, process.env.JWT_SECRET) }]
};
const presentationOne = {
  _id: new mongoose.Types.ObjectId(),
  title: "Chemical reaction 1",
  createdBy: userOne._id,
  slides: [{ slideTitle: "Slide One" }]
};
const presentationTwo = {
  _id: new mongoose.Types.ObjectId(),
  title: "Chemical reaction 2",
  createdBy: userTwo._id,
  slides: [{ slideTitle: "Slide Two" }]
};
const presentationThree = {
  _id: new mongoose.Types.ObjectId(),
  title: "Chemical reaction 3",
  createdBy: userTwo._id,
  slides: [{ slideTitle: "Slide Three" }]
};
const setupDatabase = async () => {
  await User.deleteMany();
  await Presentation.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new User(userThree).save();
  await new Presentation(presentationOne).save();
  await new Presentation(presentationTwo).save();
  await new Presentation(presentationThree).save();
};

module.exports = {
  userOneId,
  userOne,
  userTwo,
  userTwoId,
  presentationOne,
  presentationTwo,
  userThree,
  userThreeId,
  setupDatabase
};
