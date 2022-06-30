const express = require("express");
const router = express.Router();
const { createPresentation, getPresentationWelcomeMessage, getPresentationById, getPresentations, deletePresentationById, updatePresentationById, createSlide, fetchAllSlides, uploadSlideImage, getSlideById, deleteSlideById, updateSlideById } = require("../controllers/presentationController");

router.post("/", createPresentation);
router.get("/welcome", getPresentationWelcomeMessage);
router.get("/", getPresentations);
router.get("/:id", getPresentationById);
router.delete("/:id", deletePresentationById);
router.patch("/:id", updatePresentationById);

router.post("/uploads", uploadSlideImage);
router.post("/:id/slides", createSlide);
router.get("/:id/slides", fetchAllSlides);
router.get("/:presentationId/slides/:slideId", getSlideById);
router.delete("/:presentationId/slides/:slideId", deleteSlideById);
router.patch("/:presentationId/slides/:slideId", updateSlideById);
//router.get("/slides/:slideId", getSlideById);

module.exports = router;
