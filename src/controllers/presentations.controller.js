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

const deletePresentationById = async (req, res) => {
  const { id } = req.params;
  try {
    await Presentation.deleteOne({ _id: id, createdBy: req.presenter._id });
    res.status(200).send();
  } catch (e) {
    res.status(404).send(e);
  }
};
const updatePresentationById = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowableUpdates = ["title", "createdBy"];
  const isValidOperation = updates.every(update => {
    return allowableUpdates.includes(update);
  });
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }
  try {
    const presentation = await Presentation.findOne({ _id: req.params.id, createdBy: req.presenter._id });
    //console.log(presentation);

    updates.forEach(update => {
      return (presentation[update] = req.body[update]);
    });
    await presentation.save();
    res.status(200).send(presentation);
  } catch (e) {
    res.status(404).send();
  }
};
module.exports = { postPresentation, getPresentationById, getPresentationWelcomeMessage, getPresentations, deletePresentationById, updatePresentationById };
