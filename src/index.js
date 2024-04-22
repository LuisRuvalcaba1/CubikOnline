import http from 'http';
import app from './app.js';
import { connectDB } from './db.js';
import {initializeWebSocket as socket} from './sockets.js';
import {PORT} from './config.js';  

connectDB();

const server = http.createServer(app);
const httpServer = server.listen(PORT);
socket(httpServer)


console.log('Server on port ', PORT);
