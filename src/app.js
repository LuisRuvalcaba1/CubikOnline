import express from "express";
import morgan from "morgan";
import cors from "cors";

import authRoutes from './routes/auth.routes.js'
import timerRoutes from './routes/timer.routes.js'
import productRoutes from './routes/product.routes.js'
import storeRoutes from './routes/store.routes.js'
import timerPvPRoutes from './routes/timerpvp.routes.js'
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
app.use('/api', timerRoutes);
app.use('/api', productRoutes);
app.use('/api', storeRoutes);
app.use('/api', timerPvPRoutes);

export default app;