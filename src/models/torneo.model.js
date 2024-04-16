import mongoose from "mongoose";

const torneoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    qty_participantes: {
        type: Number,
        required: true
    },
    rango: {
        type: Number,
        required: true
    },
    premio: {
        type: Number,
        required: true
    },
    juez: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},{timestamps: true});

export default mongoose.model('Torneo', torneoSchema)