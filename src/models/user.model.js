import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: 
    {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: 
    {
        type: String,
        required: true,
        trim: true,
    },
    email: 
    {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    torneos:
    {
        type: Array,
        required: false,
    },
    confrontaciones:
    {
        type: Array,
        required: false,
    },
    points:
    {
        type: Number,
        required: false,
    },
    role: 
    {
        type: String,
        required: true,
        default: 'user'
    }

},{timestamps: true})

export default mongoose.model('User', userSchema)