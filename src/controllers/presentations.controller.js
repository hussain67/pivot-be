const Presentation = require("../models/presentations.model");

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
