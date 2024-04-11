import mongoose from 'mongoose';

const timepvpSchema = new mongoose.Schema({
    time:{
        type: String,
        required: true,
        trim: true,
    },
    scramble:{
        type: String,
        required: true,
        trim: true,
    },
    winner:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true
    },
});

export default mongoose.model('Timepvp', timepvpSchema);