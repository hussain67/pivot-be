const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
//const bcrypt = require("bcryptjs");
const passportLocalMongoose = require("passport-local-mongoose");

const PresenterSchema = new mongoose.Schema({
  name: String,
  email: String
});
/*
const PresenterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name must be atleast 3 character long"],
      maxlength: 50
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: 
      unique: true
    },

    
    password: {
      type: String,
      required: [true, "Password is required"]
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
*/
PresenterSchema.plugin(passportLocalMongoose);
/*
PresenterSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(3);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

PresenterSchema.methods.comparePassword = async function (candidatePassword, password) {
  try {
    //console.log(this.password, candidatePassword);
    const isOk = bcrypt.compareSync(candidatePassword, password);
    console.log(isOk);
    return isOk;
  } catch (error) {
    console.log(error);
  }
};*/
/*
PresenterSchema.methods.comparePassword = async function (canditatePassword) {
  console.log(canditatePassword, this.password);
  try {
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch;
  } catch (error) {
    console.log(error);
  }
};
*/

PresenterSchema.methods.createJWT = async function () {
  const token = jwt.sign({ presenterId: this._id, name: this.name }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};
/*
PresenterSchema.pre("delete", async function (next) {
  await Presentation.deleteMany({ createdBy: this._id });
  next();
});
*/
const Presenter = mongoose.model("presenter", PresenterSchema);
module.exports = Presenter;
