const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async url => {
  return mongoose.connect(url, {});
};

module.exports = connectDB;
