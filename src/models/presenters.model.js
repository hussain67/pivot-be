const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Presentation = require("./presentations.model");
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
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

presenterSchema.virtual("presentations", {
  ref: "Presentation",
  localField: "_id",
  foreignField: "createdBy"
});

presenterSchema.statics.findByCredentials = async (email, password) => {
  const presenter = await Presenter.findOne({ email });
  if (!presenter) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(password, presenter.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return presenter;
};

presenterSchema.methods.toJSON = function () {
  const presenterObject = this.toObject();
  delete presenterObject.password;
  delete presenterObject.tokens;
  return presenterObject;
};

presenterSchema.methods.createJWT = async function () {
  const token = jwt.sign(
    { _id: this._id.toString() },

    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
  this.tokens = this.tokens.concat({ token });
  //console.log(this.tokens);
  await this.save();
  return token;
};

presenterSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};
presenterSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

presenterSchema.pre("delete", async function (next) {
  await Presentation.deleteMany({ createdBy: this._id });
  next();
});
const Presenter = mongoose.model("Presenter", presenterSchema);
module.exports = Presenter;
