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
  tokens: [{ token: jwt.sign({ id: presenterOneId.toString() }, process.env.JWT_SECRET) }]
};
const presenterTwoId = new mongoose.Types.ObjectId();
const presenterTwo = {
  _id: presenterTwoId,
  name: "msh2",
  email: "msh2@example.com",
  password: "msh223451",
  tokens: [{ token: jwt.sign({ id: presenterTwoId.toString() }, process.env.JWT_SECRET) }]
};
const presentationOne = {
  _id: new mongoose.Types.ObjectId(),
  title: "Chemical reaction 1",
  createdBy: presenterOneId
};
const presentationTwo = {
  _id: new mongoose.Types.ObjectId(),
  title: "Chemical reaction 2",
  createdBy: presenterTwoId
};
const presentationThree = {
  _id: new mongoose.Types.ObjectId(),
  title: "Chemical reaction 3",
  createdBy: presenterTwoId
};
const setupDatabase = async () => {
  await Presenter.deleteMany();
  await Presentation.deleteMany();
  await new Presenter(presenterOne).save();
  await new Presenter(presenterTwo).save();
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
  setupDatabase
};
