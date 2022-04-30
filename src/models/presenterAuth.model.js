const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const presenterSchema = mongoose.Schema({
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
presenterSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

presenterSchema.methods.createJWT = function () {
  const token = jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, { expiresIn: "30d" });
  return token;
};

presenterSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

const Presenter = mongoose.model("Presenter", presenterSchema);
module.exports = Presenter;
