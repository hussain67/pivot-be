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

module.exports = { postPresentation, getPresentationById, getPresentationWelcomeMessage };
/*
exports.postPresentation = (req, res, next) => {
  const { presentationId, slides } = req.body;
  const sessionId = Math.random().toString(36).slice(-4);

  const presentation = new Presentation({ presentationId, slides, sessionId });
  presentation
    .save()
    .then(() => {
      res.status(200).send({ sessionId });
    })
    .catch((err) => next(err));
};

exports.getPresentation = (req, res, next) => {
  const { sessionId } = req.params;
  return Presentation.findOne({ sessionId })
    .then((presentation) => {
      if (presentation === null) {
        return Promise.reject({ status: 404, msg: "sessionId not found" });
      }
      res.status(200).send({ presentation });
    })
    .catch((err) => next(err));
};
*/
