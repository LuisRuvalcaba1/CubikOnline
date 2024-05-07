import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: 
    {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    firstName:
    {
        type: String,
        required: true,
        trim: true,
    },
    lastName:
    {
        type: String,
        required: true,
        trim: true,
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
    },
    status: 
    {
        type: String,
        required: true,
        default: 'active'
    },
    rank:
    {
        type: Number,
        required: true,
    }

},{timestamps: true})

export default mongoose.model('User', userSchema)