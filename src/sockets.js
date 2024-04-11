import {Server as WebSocketServer} from 'socket.io';

export function initializeWebSocket(httpServer){

    const io = new WebSocketServer(httpServer, {
        cors: {
            origin: 'http://localhost:5173'
        }
    });
    
    let waitingClients = []; // Lista de clientes esperando ser emparejados
    let matchedPairs = []; // Lista de pares emparejados
    
    io.on('connection', (socket) => {
        socket.on('user', (user) => {
            socket.userId = user;
            socket.emit('user', user);
        })
    
        // Agregar nuevo cliente a la lista de clientes esperando
        waitingClients.push(socket);
        console.log(`User connected: ${socket.userId}`);
    
        // Emparejar a los usuarios si hay al menos dos esperando
        if (waitingClients.length >= 2) {
            const [user1, user2] = waitingClients.splice(0, 2); // Tomar los primeros dos clientes
            const pair = { user1, user2 };
            matchedPairs.push(pair);
            user1.emit('paired', user2.userId);
            user2.emit('paired', user1.userId);
    
            // Generar el scramble y enviarlo a ambos clientes emparejados
            const scramble = generarNuevoScramble();
            user1.emit('scramble', scramble);
            user2.emit('scramble', scramble);
            console.log(scramble)
        }
    
        // Manejar el evento de desconexión
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.userId}`);
            // Eliminar al cliente desconectado de la lista de clientes esperando o de los pares emparejados
            waitingClients = waitingClients.filter(client => client.userId !== socket.userId);
            matchedPairs = matchedPairs.filter(pair => pair.user1.userId !== socket.userId && pair.user2.userId !== socket.userId);
        });
    
        socket.on('message', (data) => {
            console.log(data);
            const message = JSON.parse(data);
            console.log("Tiempo: ", message.time);
    
            const pair = matchedPairs.find(pair => pair.user1.userId === socket.userId || pair.user2.userId === socket.userId);
            if (!pair) {
                console.error('Pair not found');
                return;
            }
    
            // Guardar el tiempo del usuario en el par
            if (pair.user1.userId === socket.userId) {
                pair.user1.tiempo = message.time;
            } else {
                pair.user2.tiempo = message.time;
            }
    
            // Si ambos usuarios han enviado sus tiempos, ordenar los tiempos y determinar al ganador
            if (pair.user1.tiempo && pair.user2.tiempo) {
                const tiempos = [pair.user1.tiempo, pair.user2.tiempo];
                tiempos.sort();
    
                const ganador = pair.user1.tiempo === tiempos[0] ? pair.user1 : pair.user2;
                const perdedor = pair.user1.tiempo === tiempos[0] ? pair.user2 : pair.user1;
                ganador.emit('resultado', { ganador: true, tiempo: ganador.tiempo });
                perdedor.emit('resultado', { ganador: false, tiempo: perdedor.tiempo });
                console.log(`Winner: ${ganador.userId}`);
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
}