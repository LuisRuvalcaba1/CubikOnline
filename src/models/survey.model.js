import mongoose from "mongoose";

const surveySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  situation: {
    type: String,
    required: true,
  },
  hardestStep: {
    type: String,
    required: true,
  },
  solveTime: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Survey", surveySchema);