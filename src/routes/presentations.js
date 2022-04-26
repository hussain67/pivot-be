const express = require("express");
const router = express.Router();
const {
  postPresentation,
  getPresentation,
} = require("../controllers/presentations.controller");

router.post("/", postPresentation);
router.get("/:sessionId", getPresentation);

module.exports = router;
