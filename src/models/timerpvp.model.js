import mongoose from 'mongoose';

const timepvpSchema = new mongoose.Schema({
    winner:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true
    },
    loser:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true
    },
});

export default mongoose.model('Timepvp', timepvpSchema);