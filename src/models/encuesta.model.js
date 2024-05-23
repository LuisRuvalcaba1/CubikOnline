import mongoose from "mongoose";

const encuestaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
        required: true,
    },
    statusCube: {
      type: Number,
      required: true,
      default: 0,
    },
    phaseCube: {
      type: Number,
      required: true,
      default: 0,
    },
    timeCube: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Encuesta", encuestaSchema);
