import mongoose from "mongoose";

const rankSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rank: {
      type: Number,
      required: true,
    },
    avg_time: {
      type: String,
      required: true,
      trim: true,
    },
  },{ timestamps: true }
);

export default mongoose.model("Rank", rankSchema);