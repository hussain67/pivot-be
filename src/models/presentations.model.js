const mongoose = require("mongoose");

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

module.exports = mongoose.model("Presentation", PresentationSchema);
