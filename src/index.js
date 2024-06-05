import http from 'http';
import app from './app.js';
import { connectDB } from './db.js';
import {initializeWebSocket as socket} from './sockets.js';
const PORT = process.env.PORT || 4000;
//const HOST = process.env.HOST || '0.0.0.0';
connectDB();

const server = http.createServer(app);
const httpServer = server.listen(PORT );
socket(httpServer)


console.log('Server on port', PORT);
