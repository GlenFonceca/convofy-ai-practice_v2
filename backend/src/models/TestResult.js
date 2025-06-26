import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  transcript: {
    type: String,
    required: true,
  },
  evaluation: {
    fluency: Number,
    grammar: Number,
    vocabulary: Number,
    pronunciation: Number,
    overall_score: Number,
    suggestions: [String],
  },
  durationInSeconds: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const TestResult = mongoose.model("TestResult", testResultSchema);

export default TestResult;
