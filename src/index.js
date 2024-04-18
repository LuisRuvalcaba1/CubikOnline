import http from 'http';
import app from './app.js';
import { connectDB } from './db.js';
import {initializeWebSocket as socket} from './sockets.js';
import {conSocket} from './socketCon.js';


connectDB();

const server = http.createServer(app);
const httpServer = server.listen(4000);
socket(httpServer)
conSocket(httpServer)


console.log('Server on port 4000');
