const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Presenter = require("../models/presenters.model");
const Presentation = require("../models/presentations.model");

const presenterOneId = new mongoose.Types.ObjectId();
const presenterOne = {
  _id: presenterOneId,
  name: "msh1",
  email: "msh1@example.com",
  password: "msh123451",
  tokens: [{ token: jwt.sign({ _id: presenterOneId }, process.env.JWT_SECRET) }]
};
const presenterTwoId = new mongoose.Types.ObjectId();
const presenterTwo = {
  _id: presenterTwoId,
  name: "msh2",
  email: "msh2@example.com",
  password: "msh223451",
  tokens: [{ token: jwt.sign({ _id: presenterTwoId }, process.env.JWT_SECRET) }]
};
const presenterThreeId = new mongoose.Types.ObjectId();
const presenterThree = {
  _id: presenterThreeId,
  name: "msh3",
  email: "msh3@example.com",
  password: "msh3234513",
  tokens: [{ token: jwt.sign({ _id: presenterThreeId }, process.env.JWT_SECRET) }]
};
const presentationOne = {
  _id: new mongoose.Types.ObjectId(),
  title: "Chemical reaction 1",
  createdBy: presenterOne._id
};
const presentationTwo = {
  _id: new mongoose.Types.ObjectId(),
  title: "Chemical reaction 2",
  createdBy: presenterTwo._id
};
const presentationThree = {
  _id: new mongoose.Types.ObjectId(),
  title: "Chemical reaction 3",
  createdBy: presenterTwo._id
};
const setupDatabase = async () => {
  await Presenter.deleteMany();
  await Presentation.deleteMany();
  await new Presenter(presenterOne).save();
  await new Presenter(presenterTwo).save();
  await new Presenter(presenterThree).save();
  await new Presentation(presentationOne).save();
  await new Presentation(presentationTwo).save();
  await new Presentation(presentationThree).save();
};

module.exports = {
  presenterOneId,
  presenterOne,
  presenterTwo,
  presenterTwoId,
  presentationOne,
  presentationTwo,
  presenterThree,
  presenterThreeId,
  setupDatabase
};
