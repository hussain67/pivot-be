const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const PresenterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: 3,
      maxlength: 50
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please provide a valid email"],
      unique: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

PresenterSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
PresenterSchema.methods.createJWT = async function () {
  const token = jwt.sign({ presenterId: this._id, name: this.name }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};
PresenterSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};
PresenterSchema.pre("delete", async function (next) {
  await Presentation.deleteMany({ createdBy: this._id });
  next();
});

const Presenter = mongoose.model("presenter", PresenterSchema);
module.exports = Presenter;
