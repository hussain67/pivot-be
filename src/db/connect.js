const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.MONGO_URI;
//console.log(url);

const connectDB = async () => {
  return mongoose.connect(url, {
   
  });
};

module.exports = connectDB;
