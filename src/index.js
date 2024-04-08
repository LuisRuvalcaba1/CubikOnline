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

let waitingClients = []; // Lista de clientes esperando ser emparejados
let matchedPairs = []; // Lista de pares emparejados

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    // Agregar nuevo cliente a la lista de clientes esperando
    waitingClients.push(socket);

    // Emparejar a los usuarios si hay al menos dos esperando
    if (waitingClients.length >= 2) {
        const [user1, user2] = waitingClients.splice(0, 2); // Tomar los primeros dos clientes
        const pair = { user1, user2 };
        matchedPairs.push(pair);
        user1.emit('paired', user2.id);
        user2.emit('paired', user1.id);
        
        // Generar el scramble y enviarlo a ambos clientes emparejados
        const scramble = generarNuevoScramble();
        user1.emit('scramble', scramble);
        user2.emit('scramble', scramble);
    }

    // Manejar el evento de desconexión
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        // Eliminar al cliente desconectado de la lista de clientes esperando o de los pares emparejados
        waitingClients = waitingClients.filter(client => client.id !== socket.id);
        matchedPairs = matchedPairs.filter(pair => pair.user1.id !== socket.id && pair.user2.id !== socket.id);
    });

    // Manejar el evento de mensaje
    socket.on('message', (data) => {
        // Reenviar el mensaje al otro usuario emparejado
        const pair = matchedPairs.find(pair => pair.user1.id === socket.id || pair.user2.id === socket.id);
        if (pair) {
            const receiver = pair.user1.id === socket.id ? pair.user2 : pair.user1;
            receiver.emit('message', data);
        }
    });
});

function generarNuevoScramble() {
    const movimientos = ["R", "L", "U", "D", "F", "B"];
    const modificadores = ["", "'", "2"];

    let nuevoScramble = "";
    let ultimoMovimiento = "";

    for (let i = 0; i < 20; i++) {
        let movimientoAleatorio =
            movimientos[Math.floor(Math.random() * movimientos.length)];
        let modificadorAleatorio =
            modificadores[Math.floor(Math.random() * modificadores.length)];

        while (movimientoAleatorio === ultimoMovimiento) {
            movimientoAleatorio =
                movimientos[Math.floor(Math.random() * movimientos.length)];
        }

        nuevoScramble += movimientoAleatorio + modificadorAleatorio + " ";
        ultimoMovimiento = movimientoAleatorio;
    }

    return nuevoScramble.trim();
}


console.log('Server on port 4000');

