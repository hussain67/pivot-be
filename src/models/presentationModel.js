const mongoose = require("mongoose");
const SlideSchema = new mongoose.Schema({
  slideTitle: {
    type: String,
    required: true,
    unique: true
  },
  slideBody: {
    type: String,
    require: true
  },
  slideImage: {
    type: "string"
  }
});

const PresentationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for presentation"],
      unique: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"]
    },

    slides: [SlideSchema]
  },
  { timestamps: true }
);

const Presentation = mongoose.model("Presentation", PresentationSchema);
module.exports = Presentation;
