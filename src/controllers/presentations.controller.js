const Presentation = require("../models/presentations.model");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const getPresentationWelcomeMessage = async (req, res) => {
  await res.status(200).send({ msg: "Welcome from controller" });
};

const postPresentation = async (req, res, next) => {
  try {
    if (!req.body.title) {
      throw new BadRequestError("Provide necessary field");
    }
    const response = await new Presentation({ ...req.body, createdBy: req.presenter._id }).save();
    res.status(201).send(response);
  } catch (error) {
    next(error);
  }
};

const getPresentationById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const presentation = await Presentation.findOne({ _id: id, createdBy: req.presenter._id });

    if (!presentation) {
      throw new NotFoundError("requested resources not found");
    }
    res.status(StatusCodes.OK).send(presentation);
  } catch (error) {
    next(error);
  }
};
const getPresentations = async (req, res, next) => {
  const id = req.presenter._id;
  try {
    const presentations = await Presentation.find({ createdBy: id });
    //const presentations = await req.presenter.populate("presentations").execPopulate();
    if (presentations.length === 0) {
      throw new NotFoundError(`No item found with id ${id}`);
    }
    res.status(StatusCodes.OK).send(presentations);
  } catch (error) {
    next(error);
  }
};

const deletePresentationById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const presentation = await Presentation.findOneAndDelete({ _id: id, createdBy: req.presenter._id });
    if (!presentation) {
      throw new NotFoundError(`No presentation found with id ${id}`);
    }
    res.status(StatusCodes.OK).send();
  } catch (error) {
    next(error);
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
