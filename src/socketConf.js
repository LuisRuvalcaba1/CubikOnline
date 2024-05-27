export function handleConfrontationEvents(confrontationNS) {
  let waitingClients = [];
  let matchedPairs = [];
  let revanchaPairs = [];

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
        const [user1, user2] = waitingClients.splice(0, 2); // Tomar los primeros dos clientes
        const pair = { user1, user2 };
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
        handleUserEvents(user1, pair, matchedPairs, revanchaPairs);
        handleUserEvents(user2, pair, matchedPairs, revanchaPairs);
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
      revanchaPairs = revanchaPairs.filter(
        (pair) =>
          pair.user1.userId !== socket.userId &&
          pair.user2.userId !== socket.userId
      );
    });
  });
}

function handleUserEvents(socket, pair, matchedPairs, revanchaPairs) {
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

      // Eliminar el par de la lista de pares emparejados
      matchedPairs = matchedPairs.filter(
        (p) =>
          p.user1.userId !== ganador.userId && p.user2.userId !== ganador.userId
      );
    }
  });

  socket.on("respuestaRevancha", (respuesta) => {
    const pair = revanchaPairs.find(
      (p) =>
        p.user1.userId === socket.userId || p.user2.userId === socket.userId
    );
  
    if (pair) {
      const otherUser =
        pair.user1.userId === socket.userId ? pair.user2 : pair.user1;
      otherUser.emit("respuestaRevancha", respuesta);
  
      if (respuesta) {
        // Iniciar la revancha
        revanchaPairs = revanchaPairs.filter((p) => p !== pair);
        const scramble = generarNuevoScramble();
        pair.user1.emit("revancha", scramble);
        pair.user2.emit("revancha", scramble);
  
        handleUserEvents(pair.user1, pair, matchedPairs, revanchaPairs);
        handleUserEvents(pair.user2, pair, matchedPairs, revanchaPairs);
      } else {
        // Eliminar el par del arreglo revanchaPairs
        revanchaPairs = revanchaPairs.filter((p) => p !== pair);
      }
    }
  });

  // Manejar evento de solicitud de revancha
  socket.on("solicitarRevancha", () => {
    const pair = matchedPairs.find(
      (p) =>
        p.user1.userId === socket.userId || p.user2.userId === socket.userId
    );

    if (pair) {
      revanchaPairs.push(pair);
      const otherUser =
        pair.user1.userId === socket.userId ? pair.user2 : pair.user1;
      otherUser.emit("solicitarRevancha");
    }
  });

  // Manejar evento de aceptación de revancha
  socket.on("aceptarRevancha", () => {
    const pair = revanchaPairs.find(
      (p) =>
        p.user1.userId === socket.userId || p.user2.userId === socket.userId
    );

    if (pair) {
      revanchaPairs = revanchaPairs.filter((p) => p !== pair);
      const scramble = generarNuevoScramble();
      pair.user1.emit("revancha", scramble);
      pair.user2.emit("revancha", scramble);

      handleUserEvents(pair.user1, pair, matchedPairs, revanchaPairs);
      handleUserEvents(pair.user2, pair, matchedPairs, revanchaPairs);
    }
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