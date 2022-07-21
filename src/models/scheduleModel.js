const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
    unique: true
  }
});

const ScheduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  items: [ItemSchema]
});

const Schedule = mongoose.model("Schedule", ScheduleSchema);

module.exports = Schedule;
