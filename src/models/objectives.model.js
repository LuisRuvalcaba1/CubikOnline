import mongoose from "mongoose";

const objectivesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    objective: {
      type: Number,
      required: true,
    },
    qty_times: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Objectives", objectivesSchema);
