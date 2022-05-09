const Presentation = require("../models/presentations.model");

const postPresentation = async (req, res) => {
  try {
    const response = await new Presentation({ ...req.body, createdBy: req.presenter._id }).save();
    res.status(201).send(response);
  } catch (e) {
    res.status(400).send(e);
  }
};

const getPresentationWelcomeMessage = async (req, res) => {
  await res.status(200).send({ msg: "Welcome from controller" });
};

const getPresentationById = async (req, res) => {
  const { id } = req.params;
  try {
    const presentation = await Presentation.findOne({ _id: id, createdBy: req.presenter._id });
    if (!presentation) {
      res.status(404).send();
    }
    res.status(200).send(presentation);
  } catch (e) {
    res.status(500).send();
  }
};
const getPresentations = async (req, res) => {
  try {
    const presentations = await Presentation.find({ createdBy: req.presenter._id });
    //await req.presenter.populate("presentations").execPopulate();

    res.status(200).send(presentations);
  } catch (e) {
    res.status(404).send(e);
  }
};

module.exports = { postPresentation, getPresentationById, getPresentationWelcomeMessage, getPresentations };
