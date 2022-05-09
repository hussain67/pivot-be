const mongoose = require("mongoose");

/*
const ResponseSchema = new mongoose.Schema({
  username: String,
  answer: { type: String, enum: ["A", "B", "C", "D", "E", "F"] },
});

const QuestionSchema = new mongoose.Schema({
  hasQuestion: Boolean,
  numAnswers: Number,
  correctAnswer: { type: String, enum: ["A", "B", "C", "D", "E", "F"] },
});

const SlideSchema = new mongoose.Schema({
  slideImageUrl: { type: String, required: true },
  slideId: { type: String, required: true },
  question: QuestionSchema,
  responses: [ResponseSchema],
});

const PresentationSchema = new mongoose.Schema({
  presentationId: { type: String, required: true },
  sessionId: String,
  slides: [SlideSchema],
});
*/

const SlideSchema = new mongoose.Schema({
  slideTitle: { type: String, required: true }
  //slideImageUrl: { type: String, required: true },

  //slideId: { type: String, required: true },
  //question: QuestionSchema,
});

const PresentationSchema = new mongoose.Schema({
  title: { type: String, required: true },

  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "Presenter",
    required: [true, "Please provide presenter"]
  }
  //slides: [SlideSchema]
});

const Presentation = mongoose.model("Presentation", PresentationSchema);
module.exports = Presentation;
