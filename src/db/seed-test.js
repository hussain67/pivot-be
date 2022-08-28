const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Presentation = require("../models/presentationModel");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "msh1",
  email: "msh1@example.com",
  password: "msh123451"
};
const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "msh2",
  email: "msh2@example.com",
  password: "msh223451"
};
const userThreeId = new mongoose.Types.ObjectId();
const userThree = {
  _id: userThreeId,
  name: "msh3",
  email: "msh3@example.com",
  password: "msh3234513"
};
const presentationOne = {
  _id: new mongoose.Types.ObjectId(),
  title: "Chemical reaction 1",
  createdBy: userOne._id,
  slides: [{ slideTitle: "Slide One", slideBody: "Slide one body " }]
};
const presentationTwo = {
  _id: new mongoose.Types.ObjectId(),
  title: "Chemical reaction 2",
  createdBy: userOne._id,
  slides: [{ slideTitle: "Slide Two", slideBody: "Slide two body " }]
};
const presentationThree = {
  _id: new mongoose.Types.ObjectId(),
  title: "Chemical reaction 3",
  createdBy: userTwo._id,
  slides: [{ slideTitle: "Slide three", slideBody: "Slide three body" }]
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
  presentationThree,
  userThree,
  userThreeId,
  setupDatabase
};
