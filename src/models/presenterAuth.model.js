const mongoose = require("mongoose");
const PresenterSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Please provide name"],
    minLength: [2, "Name must be atleast 2 character long"],
    maxlength: [50, "Name length shoul dnot more than 30 character"]
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
    trim: true,
    match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please provide valid email"]
  },
  password: {
    type: String,
    trim: true,
    required: [true, "Please provide password"],
    minLength: [6, "Password must be atleast 6 character long"]
  }
});
const Presenter = mongoose.model("User", PresenterSchema);
module.exports = Presenter;
