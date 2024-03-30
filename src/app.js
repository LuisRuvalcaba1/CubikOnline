import express from "express";
import morgan from "morgan";
import cors from "cors";
import {Server as SocketServer} from 'socket.io';
import http from 'http';

import authRoutes from './routes/auth.routes.js'
import timerRoutes from './routes/timer.routes.js'
import productRoutes from './routes/product.routes.js'
import storeRoutes from './routes/store.routes.js'
import cookieParser from "cookie-parser";
const app = express();
const server = http.createServer(app);

const io = new SocketServer(server)



app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

io.on('connection', socket => {
    console.log('Client connected')

    socket.on('message', (data)=> {
        console.log(data)
    })
})
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use('/api', authRoutes);
app.use('/api', timerRoutes);
app.use('/api', productRoutes);
app.use('/api', storeRoutes);


export default app;