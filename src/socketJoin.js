export function handleJoinTournament(joinNS) {
  let participantes = [];
  let juezID = [];
  let scrambles = [];
  let n_p;
  let currentRound = 0;
  let roundParticipants = [];
  const participantesData = {};

  joinNS.on("connection", (socket) => {
    console.log("Conectado al espacio de nombres de torneos");

    socket.on("n_participantes", (n) => {
      socket.n_p = n;
      n_p = n;
      socket.emit("n_participantes", n);
      console.log(`n_participantes: ${socket.n_p}`);
      console.log(typeof socket.n_p);
    });

    socket.on("juez", (juez) => {
      socket.juezID = juez;
      juezID.push(socket);
      console.log(juezID.length);
      console.log(`Juez connected: ${socket.juezID}`);
    });

    socket.on("user", (user) => {
      socket.userId = user;
      socket.emit("user", user);
      participantes.push(socket);
      console.log(`User connected: ${socket.userId}`);
      console.log(
        "Participantes:",
        participantes.map((s) => s.userId)
      );

      console.log(participantes.length);
      console.log("Usuarios faltantes", n_p - participantes.length);
      if (participantes.length === n_p) {
        const groups = groupParticipants(participantes, 2);
        groups.forEach((group) => {
          const scramble = generarNuevoScramble();
          group.forEach((participant) => {
            participant.emit(
              "paired",
              group.map((p) => p.userId)
            );
            participant.emit("scramble", scramble);
          });
        });

        currentRound++;
      }
    });

    socket.on("roundComplete", () => {
      if (currentRound < 5) {
        const scramble = scrambles[currentRound];
        const groups = groupParticipants(participantes, 2);
        groups.forEach((group) => {
          group.forEach((participant) => {
            participant.emit(
              "paired",
              group.map((p) => p.userId)
            );
            participant.emit("scramble", scramble);
          });
        });
        currentRound++;
      } else {
        console.log("Torneo completado");
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
      participantes = participantes.filter(
        (client) => client.userId !== socket.userId
      );
      juezID = juezID.filter((client) => client.juezID !== socket.juezID);
    });

    socket.on("times", (message) => {
      const time = JSON.parse(message);
      const userId = socket.userId;
      console.log(`Tiempo de ${userId} : `, time);

      if (!participantesData[userId]) {
        participantesData[userId] = { tiempos: [] };
      }

      const pair = roundParticipants.find(
        (pair) => pair.user1.userId === userId || pair.user2.userId === userId
      );

      if (!pair) {
        console.error("Pair not found");
        return;
      }

      pair.user1.tiempos = pair.user1.tiempos || [];
      pair.user2.tiempos = pair.user2.tiempos || [];

      if (pair.user1.userId === socket.userId) {
        pair.user1.tiempos.push(time);
        console.log(pair.user1.tiempos);
      } else {
        pair.user2.tiempos.push(time);
        console.log(pair.user2.tiempos);
      }

      if (pair.user1.tiempos.length === 5 && pair.user2.tiempos.length === 5) {
        const tiempos1 = pair.user1.tiempos.map(convertTimeToMilliseconds);
        const tiempos2 = pair.user2.tiempos.map(convertTimeToMilliseconds);

        const promedio1 = tiempos1.reduce((a, b) => a + b, 0) / tiempos1.length;
        const promedio2 = tiempos2.reduce((a, b) => a + b, 0) / tiempos2.length;

        console.log(`Promedio de ${pair.user1.userId}: ${promedio1}`);
        console.log(`Promedio de ${pair.user2.userId}: ${promedio2}`);

        const ganador = promedio1 < promedio2 ? pair.user1 : pair.user2;
        const perdedor = promedio1 < promedio2 ? pair.user2 : pair.user1;

        ganador.emit("resultado", {
          ganador: true,
          promedio: promedio1,
          promedioOponente: promedio2,
        });
        perdedor.emit("resultado", {
          ganador: false,
          promedio: promedio2,
          promedioOponente: promedio1,
        });

        console.log(`Winner: ${ganador.userId}`);
      }
    });

    socket.on("nextScramble", () => {
      const userId = socket.userId;
      const participanteData = participantesData[userId];

      if (!participanteData) {
        console.error("Datos del participante no encontrados");
        return;
      }

      // Generar un nuevo scramble y enviarlo al usuario
      const nuevoScramble = generarNuevoScramble();
      socket.emit("scramble", nuevoScramble);
    });
  });

  function groupParticipants(participantes, groupSize) {
    const groups = [];
    let groupIndex = 0;

    while (participantes.length >= groupSize) {
      const group = participantes.splice(0, groupSize);
      groups.push(group);

      console.log(
        `Grupo ${groupIndex}:`,
        group.map((s) => s.userId)
      );

      // Agregar cada par de participantes a roundParticipants
      if (groupSize === 2) {
        const [user1, user2] = group;
        roundParticipants.push({ user1, user2 });
        console.log(`Par ${groupIndex}:`, {
          user1: user1.userId,
          user2: user2.userId,
        });
      }

      groupIndex++;
    }

    console.log(
      "Grupos formados:",
      groups.map((g) => g.map((s) => s.userId))
    );
    console.log(
      "roundParticipants:",
      roundParticipants.map((p) => ({
        user1: p.user1.userId,
        user2: p.user2.userId,
      }))
    );

    return groups;
  }

  function convertTimeToMilliseconds(timeString) {
    const [minutes, seconds, milliseconds] = timeString.split(":").map(Number);
    return minutes * 60 * 1000 + seconds * 1000 + milliseconds;
  }
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
