

export function handleTournamentEvents(tournamentNS) {
  let participantes = [];
  let rounds = [];
  let winners = [];
  let scrambles = [];

  // Generar 5 scrambles iniciales
  for (let i = 0; i < 5; i++) {
    scrambles.push(generarNuevoScramble());
  }

  tournamentNS.on("connection", (socket) => {
    console.log("Usuario conectado al espacio de nombres de torneos");

    socket.on("user", (user) => {
      socket.userId = user;
      socket.emit("user", user);
      participantes.push(socket);
      socket.emit("participantes", participantes);
      console.log("Usuario conectado", socket.userId.username);
    });

    socket.on("join", (data) => {
      console.log("Usuario se ha unido al torneo", data);

      if (participantes.length >= 2) {
        const [user1, user2] = participantes.splice(0, 2);
        const pair = { user1, user2 };
        rounds.push(pair);

        user1.emit("scramble", scrambles[0]);
        user2.emit("scramble", scrambles[0]);
      }
    });

    socket.on("tiempo", (data) => {
      const { tiempo, scrambleIndex } = data;
      const pair = rounds.find(
        (pair) =>
          pair.user1.userId === socket.userId ||
          pair.user2.userId === socket.userId
      );

      if (!pair) {
        console.error("Pair not found");
        return;
      }

      // Guardar el tiempo del usuario en el par
      if (pair.user1.userId === socket.userId) {
        pair.user1.tiempos[scrambleIndex] = tiempo;
      } else {
        pair.user2.tiempos[scrambleIndex] = tiempo;
      }

      // Si ambos usuarios han enviado sus tiempos para el scramble actual, pasar al siguiente scramble
      if (
        pair.user1.tiempos[scrambleIndex] &&
        pair.user2.tiempos[scrambleIndex]
      ) {
        const nextScrambleIndex = scrambleIndex + 1;

        if (nextScrambleIndex < scrambles.length) {
          // Enviar el siguiente scramble a los participantes emparejados
          pair.user1.emit("scramble", scrambles[nextScrambleIndex]);
          pair.user2.emit("scramble", scrambles[nextScrambleIndex]);
        } else {
          // Si ya se han realizado los 5 scrambles, determinar al ganador
          const ganador =
            pair.user1.tiempos.reduce((a, b) => a + b, 0) <
            pair.user2.tiempos.reduce((a, b) => a + b, 0)
              ? pair.user1
              : pair.user2;
          const perdedor =
            pair.user1.tiempos.reduce((a, b) => a + b, 0) <
            pair.user2.tiempos.reduce((a, b) => a + b, 0)
              ? pair.user2
              : pair.user1;

          const winnerData = ganador.userId;
          const loserData = perdedor.userId;

          ganador.emit("resultado", {
            ganador: true,
            tiempos: ganador.tiempos,
            winner: winnerData,
            loser: loserData,
          });
          perdedor.emit("resultado", {
            ganador: false,
            tiempos: perdedor.tiempos,
            winner: winnerData,
            loser: loserData,
          });

          console.log(`Winner: ${ganador.userId}`);
          winners.push(ganador);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("Usuario desconectado del espacio de nombres de torneos");
    });
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
