const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
    //unique: true
  },
  presentationId: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
    // unique: true
  },
  userId: {
    type: String,
    required: true
    //select: false
  }
});

const ScheduleSchema = new mongoose.Schema({
  scheduleTitle: {
    type: String,
    required: true
  },
  items: [ItemSchema]
});

const Schedule = mongoose.model("Schedule", ScheduleSchema);

module.exports = Schedule;
