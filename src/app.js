import express from "express";
import morgan from "morgan";
import cors from "cors";


import authRoutes from './routes/auth.routes.js'
import taskRoutes from './routes/task.routes.js'
import timerRoutes from './routes/timer.routes.js'
import cookieParser from "cookie-parser";
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use('/api', authRoutes);
app.use('/api', taskRoutes);
app.use('/api', timerRoutes);

export default app;