import mongoose from 'mongoose';
import { DB } from './config.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('>>> DB is connected');
  } catch (error) {
    console.error('Error connecting to the database', error);
  }
};