const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");
const { createSchedule, getScheduleParticipant, getSchedulePresenter, deleteScheduleById } = require("../controllers/scheduleController");

router.post("/", authenticateUser, createSchedule);

router.get("/presenter", authenticateUser, getSchedulePresenter);
router.get("/participant", getScheduleParticipant);
router.delete("/:itemId", deleteScheduleById);

module.exports = router;
