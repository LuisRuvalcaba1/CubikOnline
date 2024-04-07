import http from 'http';
import app from './app.js';
import { connectDB } from './db.js';
import { Server as WebSocketServer } from 'socket.io';


connectDB();

const server = http.createServer(app);
const httpServer = server.listen(4000);
const io = new WebSocketServer(httpServer, {
    cors: {
        origin: 'http://localhost:5173'
    }
});
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('message', (data) => {
        socket.broadcast.emit("received", data)
    });
});


console.log('Server on port 4000');

