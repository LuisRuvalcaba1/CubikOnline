export function handleConfrontationEvents(confrontationNS) {
  let waitingClients = [];
  let matchedPairs = [];

  confrontationNS.on("connection", (socket) => {
    console.log("Nueva conexión en el namespace de confrontación");

    // Manejar evento de usuario conectado
    socket.on("user", (user) => {
      socket.userId = user;
      socket.emit("user", user);

      // Agregar nuevo cliente a la lista de clientes esperando
      waitingClients.push(socket);

      console.log(`User connected: ${socket.userId}`);
      console.log(waitingClients.length);
      // Emparejar a los usuarios si hay al menos dos esperando
      if (waitingClients.length >= 2) {
        const [user1, user2] = waitingClients.splice(0, 2);
        const pair = { user1, user2, isRevancha: false }; // Agregamos la propiedad isRevancha
        matchedPairs.push(pair);
        user1.emit("paired");
        user2.emit("paired");

        //Enviar el id del contrincante a cada usuario
        user1.emit("contrincante", user2.userId);
        user2.emit("contrincante", user1.userId);

        const scramble = generarNuevoScramble();
        user1.emit("scramble", scramble);
        user2.emit("scramble", scramble);

        // Suscribir eventos después de emparejar
        handleUserEvents(user1, pair, matchedPairs);
        handleUserEvents(user2, pair, matchedPairs);
      }
    });

    // Manejar evento de desconexión
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
      // Eliminar al cliente desconectado de la lista de clientes esperando o de los pares emparejados
      waitingClients = waitingClients.filter(
        (client) => client.userId !== socket.userId
      );
      matchedPairs = matchedPairs.filter(
        (pair) =>
          pair.user1.userId !== socket.userId &&
          pair.user2.userId !== socket.userId
      );
   
    });
  });
}

function handleUserEvents(socket, pair, matchedPairs) {
  // Manejar evento de revancha
  socket.on("revancha", (data) => {
    if (pair.isRevancha) {
      const message = JSON.parse(data);
      console.log("Tiempo de revancha: ", message.time);

      if (pair.user1.userId === socket.userId) {
        pair.user1.tiempoRevancha = message.time;
      } else {
        pair.user2.tiempoRevancha = message.time;
      }

      // Si ambos usuarios han enviado sus tiempos de revancha, ordenar los tiempos y determinar al ganador
      if (pair.user1.tiempoRevancha && pair.user2.tiempoRevancha) {
        const tiemposRevancha = [pair.user1.tiempoRevancha, pair.user2.tiempoRevancha];
        tiemposRevancha.sort();

        const ganadorRevancha =
          pair.user1.tiempoRevancha === tiemposRevancha[0] ? pair.user1 : pair.user2;
        const perdedorRevancha =
          pair.user1.tiempoRevancha === tiemposRevancha[0] ? pair.user2 : pair.user1;

        const winnerData = ganadorRevancha.userId;
        const loserData = perdedorRevancha.userId;

        ganadorRevancha.emit("resultado", {
          ganador: true,
          tiempo: ganadorRevancha.tiempoRevancha,
          winner: winnerData,
          loser: loserData,
        });
        perdedorRevancha.emit("resultado", {
          ganador: false,
          tiempo: perdedorRevancha.tiempoRevancha,
          winner: winnerData,
          loser: loserData,
        });
        console.log(`Winner de revancha: ${ganadorRevancha.userId}`);

        // Reiniciar isRevancha para futuras confrontaciones
        pair.isRevancha = false;

        matchedPairs = matchedPairs.filter(
          (p) =>
            p.user1.userId !== ganadorRevancha.userId &&
            p.user2.userId !== ganadorRevancha.userId
        );
      }
    }
  });

  // Manejar evento de mensaje (tiempo de resolución)
  socket.on("message", (data) => {
    console.log(data);
    const message = JSON.parse(data);
    console.log("Tiempo: ", message.time);

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

      const ganador =
        pair.user1.tiempo === tiempos[0] ? pair.user1 : pair.user2;
      const perdedor =
        pair.user1.tiempo === tiempos[0] ? pair.user2 : pair.user1;

      const winnerData = ganador.userId;
      const loserData = perdedor.userId;

      ganador.emit("resultado", {
        ganador: true,
        tiempo: ganador.tiempo,
        winner: winnerData,
        loser: loserData,
      });
      perdedor.emit("resultado", {
        ganador: false,
        tiempo: perdedor.tiempo,
        winner: winnerData,
        loser: loserData,
      });
      console.log(`Winner: ${ganador.userId}`);

      matchedPairs = matchedPairs.filter(
        (p) =>
          p.user1.userId !== ganador.userId && p.user2.userId !== ganador.userId
      );
    }
  });

  // Manejar evento de solicitud de revancha
  socket.on("solicitarRevancha", () => {
    pair.isRevancha = true;
    socket.broadcast.to(pair.user1.userId).emit("revancha");
    socket.broadcast.to(pair.user2.userId).emit("revancha");
  });
}

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