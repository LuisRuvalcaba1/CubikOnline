import express from "express";
import morgan from "morgan";
import cors from "cors";
import { CLIENT } from "./config.js";

import authRoutes from './routes/auth.routes.js'
import timerRoutes from './routes/timer.routes.js'
import productRoutes from './routes/product.routes.js'
import storeRoutes from './routes/store.routes.js'
import timerPvPRoutes from './routes/timerpvp.routes.js'
import torneoRoutes from './routes/torneo.routes.js'
import tokenRoutes from './routes/token.routes.js'
import amigosRoutes from './routes/amigos.routes.js'
import encuestaRoutes from './routes/encuesta.routes.js'
import objetivesRoutes from './routes/objetives.routes.js'
import rankRoutes from './routes/rank.routes.js'
import cookieParser from "cookie-parser";
const app = express();

const corsOptions = {
    origin: CLIENT,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
    optionsSuccessStatus: 204,
    
};

app.use(cors(corsOptions));

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use('/api', authRoutes);
app.use('/api', objetivesRoutes);
app.use('/api', amigosRoutes);
app.use('/api', encuestaRoutes);
app.use('/api', timerRoutes);
app.use('/api', productRoutes);
app.use('/api', storeRoutes);
app.use('/api', timerPvPRoutes);
app.use('/api', torneoRoutes);
app.use('/api', rankRoutes);
app.use('/api', tokenRoutes);

export default app;