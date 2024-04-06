import Timepvp from './timepvp.model.js';

function sockets(io) {
    io.on('connection', (socket) => {
        console.log('Usuario conectado:', socket.id);

        socket.on('tiempo', async (data) => {
            // Guardar el tiempo recibido en la base de datos
            const { tiempo, usuario } = data;
            try {
                await Timepvp.create({ time: tiempo, user: usuario });
                console.log('Tiempo guardado en la base de datos:', tiempo);
            } catch (error) {
                console.error('Error al guardar el tiempo:', error);
            }

            // Obtener los tiempos de todos los usuarios
            const tiempos = await Timepvp.find();

            // Calcular el menor tiempo y emitirlo a todos los usuarios
            const menorTiempo = calcularMenorTiempo(tiempos);
            io.emit('menorTiempo', menorTiempo);
        });

        socket.on('disconnect', () => {
            console.log('Usuario desconectado:', socket.id);
        });
    });
}

function calcularMenorTiempo(tiempos) {
    // Aquí implementa la lógica para calcular el menor tiempo
    // Puedes ordenar los tiempos y devolver el primero
    // Por ejemplo:
    const tiemposOrdenados = tiempos.sort((a, b) => a.time.localeCompare(b.time));
    return tiemposOrdenados[0];
}

export default sockets;