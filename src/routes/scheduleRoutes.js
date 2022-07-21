const express = require("express");
const router = express.Router();

const { createSchedule, getSchedule } = require("../controllers/scheduleController");

router.post("/", createSchedule);
router.get("/", getSchedule);

module.exports = router;
