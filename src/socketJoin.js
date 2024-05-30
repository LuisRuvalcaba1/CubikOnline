export function handleJoinTournament(joinNS) {
  let participantes = [];
  let juezID = [];
  let n_p;
  let ganadores = [];
  let roundParticipants = [];
  let participantesData = {};
  let usuariosData = {};
  let juecesViendoTiempos = [];

  function reiniciarTorneo() {
    participantes = [];
    juezID = [];
    n_p = undefined;
    ganadores = [];
    roundParticipants = [];
    participantesData = {};
    usuariosData = {};
  }

  joinNS.on("connection", (socket) => {
    console.log("Conectado al espacio de nombres de torneos");

    socket.on("tiemposVistos", (grupo) => {
      const juezEnGrupo = juecesViendoTiempos.find(
        (juez) => juez.userId === socket.userId
      );

      if (juezEnGrupo) {
        const grupoId = grupo.join("-");
        juecesViendoTiempos.push({ grupoId, juezId: socket.userId });

        const tiemposGrupo = tiemposPorGrupo[grupoId] || {};

        juezEnGrupo.emit("tiemposVistos", tiemposGrupo);
      } else {
        console.log("El juez no está en este grupo");
      }
    });

    socket.on("reiniciarTorneo", () => {
      reiniciarTorneo();
      console.log("Torneo reiniciado");
    });

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
      // Borra los datos anteriores del usuario
      usuariosData[user] = [];

      socket.userId = user;
      socket.emit("user", user);
      participantes.push(socket); // Agrega el socket a participantes
      console.log(`User connected: ${socket.userId}`);
      console.log(
        "Participantes:",
        participantes.map((s) => s.userId)
      );

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
      }
    });

    socket.on("finalRound", () => {
      if (ganadores.length > 1) {
        const nuevosGrupos = groupParticipants(ganadores, 2);
        nuevosGrupos.forEach((grupo) => {
          const scramble = generarNuevoScramble();
          grupo.forEach((participante) => {
            participante.emit("nuevaRonda", {
              oponentes: grupo.map((p) => p.userId),
              scramble,
            });
            participante.emit("paired"); // Emitir el evento "paired"
          });
        });
        reiniciarRonda(nuevosGrupos);
        ganadores = []; // Reiniciar la lista de ganadores
      }
    });

    socket.on("marcarGanador", ({ grupo, ganador }) => {
      const grupoId = grupo.join("-");
      const juezEnGrupo = juecesGrupo.find(
        (juez) => juez.userId === socket.userId
      );

      if (juezEnGrupo) {
        const tiemposGrupo = tiemposPorGrupo[grupoId] || {};
        const usuarioGanador = Object.entries(tiemposGrupo).find(
          ([userId]) => userId === ganador
        );

        if (usuarioGanador) {
          const [userId, datosUsuario] = usuarioGanador;
          console.log(`Ganador del grupo ${grupoId}: ${userId}`);
          ganadores.push({ userId, datosUsuario });
        } else {
          console.log("Usuario ganador no encontrado");
        }

        // Emitir un evento al cliente para indicar que se registró el ganador
        juezEnGrupo.emit("ganadorRegistrado", grupoId);
      } else {
        console.log("El juez no está en este grupo");
      }
    });

    socket.on("getTiemposUsuarios", () => {
      juezID.forEach((juez) => {
        juez.emit("tiemposUsuarios", participantesData);
      });
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

      if (!usuariosData[userId]) {
        usuariosData[userId] = []; // Inicializar con un arreglo vacío
      }

      usuariosData[userId].push(time); // Agregar el tiempo al arreglo
      console.log(usuariosData[userId]);

      const pair = roundParticipants.find(
        (pair) => pair.user1.userId === userId || pair.user2.userId === userId
      );

      if (!pair) {
        console.error("Pair not found");
        return;
      }

      if (pair.user1.userId === socket.userId) {
        pair.user1.tiempos = usuariosData[userId];
      } else {
        pair.user2.tiempos = usuariosData[userId];
      }

      const tiemposPorGrupo = {};

      // Agrupar los tiempos de los usuarios por grupo
      roundParticipants.forEach((pair) => {
        const grupoId = `${pair.user1.userId}-${pair.user2.userId}`;
        const juezViendoTiempos = juecesViendoTiempos.find(
          (juez) => juez.grupoId === grupoId && juez.juezId === socket.userId
        );

        if (!juezViendoTiempos) {
          console.log("El juez no ha visto los tiempos de este grupo");
          return;
        } else {
          tiemposPorGrupo[grupoId] = {
            user1: {
              userId: pair.user1.userId,
              tiempos: pair.user1.tiempos || [],
            },
            user2: {
              userId: pair.user2.userId,
              tiempos: pair.user2.tiempos || [],
            },
          };

          if (usuariosData[userId].length === 5) {
            if (
              pair.user1 &&
              pair.user2 &&
              Array.isArray(pair.user1.tiempos) &&
              Array.isArray(pair.user2.tiempos) &&
              pair.user1.tiempos.length === 5 &&
              pair.user2.tiempos.length === 5
            ) {
              const tiempos1 = pair.user1.tiempos.map(
                convertTimeToMilliseconds
              );
              const tiempos2 = pair.user2.tiempos.map(
                convertTimeToMilliseconds
              );

              const promedio1 =
                tiempos1.reduce((a, b) => a + b, 0) / tiempos1.length;
              const promedio2 =
                tiempos2.reduce((a, b) => a + b, 0) / tiempos2.length;

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

              if (!ganadores.includes(ganador)) {
                ganadores.push(ganador);
                console.log(`Winner: ${ganador.userId}`);
                console.log(
                  "Ganadores:",
                  ganadores.map((s) => s.userId)
                );
              }

              usuariosData[pair.user1.userId] = [];
              usuariosData[pair.user2.userId] = [];
            }
          }
        }
      });

      juezID.forEach((juez) => {
        juez.emit("tiemposUsuarios", tiemposPorGrupo);
      });

      socket.on("nextScramble", () => {
        const userId = socket.userId;
        const participanteData = usuariosData[userId];

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

        if (groupSize === 2) {
          const [user1, user2] = group;
          roundParticipants.push({ user1, user2, promedio1: 0, promedio2: 0 }); // Agregar las nuevas propiedades
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

      juezID.forEach((juez) => {
        juez.emit(
          "grupos",
          groups.map((g) => g.map((s) => s.userId))
        );
      });

      return groups;
    }

    function convertTimeToMilliseconds(timeString) {
      const [minutes, seconds, milliseconds] = timeString
        .split(":")
        .map(Number);
      return minutes * 60 * 1000 + seconds * 1000 + milliseconds;
    }

    function reiniciarRonda(nuevosGrupos) {
      roundParticipants = [];
      participantesData = {};
      ganadores = [];
      console.log("participantesData reiniciado:", participantesData);

      nuevosGrupos.forEach((grupo, index) => {
        if (grupo.length === 2) {
          const [user1, user2] = grupo;
          participantesData[user1.userId] = [];
          participantesData[user2.userId] = [];
          roundParticipants.push({ user1, user2, promedio1: 0, promedio2: 0 }); // Reiniciar los promedios
          console.log(`Par ${index}:`, {
            user1: user1.userId,
            user2: user2.userId,
          });
        }
      });
      console.log(
        "roundParticipants:",
        roundParticipants.map((p) => ({
          user1: p.user1.userId,
          user2: p.user2.userId,
        }))
      );
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
