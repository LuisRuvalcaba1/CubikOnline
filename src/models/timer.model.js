import mongoose from "mongoose";

const timerSchema = new mongoose.Schema({
    time:{
        type: String,
        required: true,
        trim: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        trim: true,
    },
    scramble:{
        type: String,
        required: true,
        trim: true,
    },
    session:{
        type: Number,
        required: true,
        trim: true,
    }
});

export default mongoose.model("TimerModel", timerSchema)