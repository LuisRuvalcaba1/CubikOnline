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
        console.log(scramble)
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
        console.log(`Message from ${socket.id}: ${data}`);
    
        // Buscar el par al que pertenece el cliente que envió el mensaje
        const pair = matchedPairs.find(pair => pair.user1.id === socket.id || pair.user2.id === socket.id);
        if (pair) {
   
            if (!pair.tiempos) {
                pair.tiempos = [];
            }
            pair.tiempos.push(JSON.parse(data));
    
            if (pair.tiempos.length === 2) {
                const tiempoUsuario1 = pair.tiempos[0].tiempo;
                const tiempoUsuario2 = pair.tiempos[1].tiempo;
    
                if (tiempoUsuario1 < tiempoUsuario2) {
                    console.log('Ganador:', pair.user1.id);
                    console.log('Perdedor:', pair.user2.id);
                } else if (tiempoUsuario1 > tiempoUsuario2) {
                    console.log('Ganador:', pair.user2.id);
                    console.log('Perdedor:', pair.user1.id);
                } else {
                    console.log('Empate');
                }
    
                // Reiniciar el juego
                pair.tiempos = [];
            }
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
