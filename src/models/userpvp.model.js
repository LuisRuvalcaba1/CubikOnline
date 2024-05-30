import mongoose from "mongoose";

const userpvpSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userPvP: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: "0",
    },
    qty_pvp: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserPvP", userpvpSchema);