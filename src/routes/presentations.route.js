const express = require("express");
const router = express.Router();
const { postPresentation, getPresentationWelcomeMessage, getPresentationById, getPresentations, deletePresentationById, updatePresentationById, createSlide, fetchAllSlides } = require("../controllers/presentations.controller");

router.post("/", postPresentation);
router.get("/welcome", getPresentationWelcomeMessage);
router.get("/", getPresentations);
router.get("/:id", getPresentationById);
router.delete("/:id", deletePresentationById);
router.patch("/:id", updatePresentationById);
router.post("/:id/slides", createSlide);
router.get("/:id/slides", fetchAllSlides);

module.exports = router;
