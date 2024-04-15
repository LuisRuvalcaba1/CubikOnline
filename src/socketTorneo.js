import {Server as WebSocketServer} from 'socket.io';

export function tournamentSocket(httpServer){

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

        
    })
}
