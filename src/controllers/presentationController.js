const Presentation = require("../models/presentationModel");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;
const getPresentationWelcomeMessage = async (req, res) => {
  await res.status(200).send({ msg: "Welcome from controller" });
};

const createPresentation = async (req, res, next) => {
  console.log(req.user);
  try {
    if (!req.body.title) {
      throw new BadRequestError("Provide necessary field");
    }
    const presentation = await new Presentation({ ...req.body, createdBy: req.user.userId }).save();
    console.log(presentation);
    res.status(201).json(presentation);
  } catch (error) {
    next(error);
  }
};

const getPresentationById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const presentations = await Presentation.findOne({ _id: id, createdBy: req.user.userId });

    if (!presentations) {
      throw new NotFoundError("requested resources not found");
    }
    res.status(StatusCodes.OK).send(presentations);
  } catch (error) {
    next(error);
  }
};
const getPresentations = async (req, res, next) => {
  const id = req.user.userId;

  try {
    const presentations = await Presentation.find({ createdBy: id });
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
    const presentation = await Presentation.findOneAndDelete({ _id: id, createdBy: req.user.userId });
    if (!presentation) {
      throw new NotFoundError(`No presentation found with id ${id}`);
    }
    res.status(StatusCodes.OK).json(presentation);
  } catch (error) {
    next(error);
  }
};
const updatePresentationById = async (req, res, next) => {
  console.log(req.params);
  const updates = Object.keys(req.body);
  const allowableUpdates = ["title"];
  const isValidOperation = updates.every(update => {
    return allowableUpdates.includes(update);
  });
  if (!isValidOperation) {
    throw new BadRequestError("Invalid updates");
  }
  try {
    const presentation = await Presentation.findOne({ _id: req.params.id, createdBy: req.user.userId });
    if (!presentation) {
      throw new NotFoundError(`No item found with id ${req.params.id}`);
    }
    updates.forEach(update => {
      return (presentation[update] = req.body[update]);
    });
    await presentation.save();
    res.status(200).send(presentation);
  } catch (error) {
    next(error);
  }
};
const uploadSlideImage = async (req, res) => {
  //console.log(req.files.image);
  const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
    use_filename: true,
    folder: "pivot"
  });
  console.log(result);
  res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

const createSlide = async (req, res, next) => {
  const { id } = req.params;
  console.log(req.body);
  try {
    if (!req.body.slideTitle || !req.body.slideBody) {
      throw new BadRequestError("Provide necessary field");
    }
    const presentation = await Presentation.findOne({ _id: req.params.id, createdBy: req.user.userId });

    const count = presentation.slides.push({ ...req.body });
    const slideId = presentation.slides[count - 1]._id;
    const response = await presentation.save();
    res.status(201).send(slideId);
  } catch (error) {
    next(error);
  }
};
const fetchAllSlides = async (req, res, next) => {
  try {
    const presentation = await Presentation.findOne({ _id: req.params.id, createdBy: req.user.userId });
    res.status(200).send(presentation.slides);
  } catch (error) {
    next(error);
  }
};
module.exports = { createPresentation, getPresentationById, getPresentationWelcomeMessage, getPresentations, deletePresentationById, updatePresentationById, createSlide, fetchAllSlides, uploadSlideImage };
