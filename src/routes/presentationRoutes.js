const express = require("express");
const router = express.Router();
const { createPresentation, getPresentationWelcomeMessage, getPresentationById, getPresentations, deletePresentationById, updatePresentationById, createSlide, fetchAllSlides, uploadSlideImage } = require("../controllers/presentationController");

router.post("/", createPresentation);
router.get("/welcome", getPresentationWelcomeMessage);
router.get("/", getPresentations);
router.get("/:id", getPresentationById);
router.delete("/:id", deletePresentationById);
router.patch("/:id", updatePresentationById);

router.post("/uploads", uploadSlideImage);
router.post("/:id/slides", createSlide);
router.get("/:id/slides", fetchAllSlides);

module.exports = router;
