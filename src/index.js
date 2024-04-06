import app from "./app.js";
import { connectDB } from './db.js';
import { Server as SocketServer } from 'socket.io';
import http from 'http';
import sockets from './sockets.js';

connectDB();

const server = http.createServer(app);
const io = new SocketServer(server); // Aquí usamos el mismo servidor HTTP para WebSocket

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Servidor WebSocket en el puerto ${PORT}`);
});

sockets(io);