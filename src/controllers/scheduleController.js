const Schedule = require("../models/scheduleModel");

const createSchedule = async (req, res, next) => {
  console.log(req.body);
  try {
    let schedule = await Schedule.findOne({ title: "presentationSchedule" });
    if (schedule) {
      schedule.items.push({ ...req.body });
    }

    const result = await schedule.save();

    console.log(result);
    res.status(200).json("From controller");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getSchedule = async (req, res, next) => {
  try {
    const response = await Schedule.findOne({ title: "presentationSchedule" });
    if (response) {
      res.status(200).json(response.items);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createSchedule, getSchedule };
