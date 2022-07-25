const Schedule = require("../models/scheduleModel");

const createSchedule = async (req, res, next) => {
  const { title, id, time } = req.body;
  const { userId } = req.user;
  try {
    let existingSchedule;
    existingSchedule = await Schedule.findOne({ scheduleTitle: "presentationSchedule" });

    if (!existingSchedule) {
      existingSchedule = await new Schedule({ scheduleTitle: "presentationSchedule" });
    }
    const item = { title, presentationId: id, time, userId };
    existingSchedule.items.push(item);
    const schedule = await existingSchedule.save();
    if (schedule) {
      res.status(200).json({ schedule: item });
    }
  } catch (error) {
    next(error);
  }
};

const getScheduleParticipant = async (req, res, next) => {
  try {
    const response = await Schedule.findOne();

    if (response) {
      res.status(200).json(response.items);
    }
  } catch (error) {
    console.log(error);
  }
};
const getSchedulePresenter = async (req, res, next) => {
  try {
    const response = await Schedule.findOne();
    if (response && response.items.length > 0) {
      const ownSchedule = response.items.filter(item => {
        return item.userId === req.user.userId;
      });
      console.log(ownSchedule);
      res.status(200).json(ownSchedule);
    }
  } catch (error) {
    console.log(error);
  }
};
const deleteScheduleById = async (req, res, next) => {
  const { itemId } = req.params;
  console.log(itemId);
  try {
    const schedule = await Schedule.findOne();
    await schedule.items.id(itemId).remove();
    await schedule.save();
    res.status(200).json({ status: "success" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createSchedule, getScheduleParticipant, getSchedulePresenter, deleteScheduleById };
