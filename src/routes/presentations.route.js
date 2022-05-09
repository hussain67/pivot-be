const express = require("express");
const router = express.Router();
const { postPresentation, getPresentationWelcomeMessage, getPresentationById } = require("../controllers/presentations.controller");

router.post("/", postPresentation);
router.get("/welcome", getPresentationWelcomeMessage);
//router.get("/", getPresentations);
router.get("/:id", getPresentationById);

module.exports = router;
