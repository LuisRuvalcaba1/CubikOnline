export function handleJoinTournament(joinNS) {
  let participantes = [];
  let juezID = [];
  let n_p;
  let ganadores = [];
  let roundParticipants = [];
  let participantesData = {};
  let usuariosData = {};
  let juecesViendoTiempos = [];
  let grupoActual = null;
  let tiemposPorGrupo = {};
  let groups = [];

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
    });

    socket.on("juez", (juez) => {
      socket.juezId = juez;
      juezID.push(juez); // Agregar solo el ID del juez a juezID
      console.log(juezID.length);
      console.log(`Juez connected: ${socket.juezId}`);
      console.log("Jueces:", juezID);
    });

    socket.on("unirseGrupo", ({ juezId, grupoIndex }) => {
      const juezSocket = joinNS.sockets.get(juezId); // Obtener el objeto de socket del juez utilizando el ID
      if (juezSocket) {
        const grupo = groups[grupoIndex];
        if (grupo) {
          grupo.juez = juezId;
          console.log(`Juez ${juezId} unido al grupo ${grupoIndex}`);
          juezSocket.emit("grupo", { juez: juezId, users: grupo.users.map(u => u.userId), grupoId: grupoIndex });
        } else {
          console.log(`Grupo ${grupoIndex} no encontrado`);
        }
      } else {
        console.log(`Juez ${juezId} no encontrado`);
      }
    });

    socket.on("user", (user) => {
      if (participantes.length >= n_p) {
        console.log(
          `El torneo ya tiene ${n_p} participantes. No se permiten más conexiones.`
        );
        socket.emit("torneo_lleno");
        return;
      }

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
        groups = groupParticipants(participantes, [juezID]); // Actualiza groups aquí
        grupoActual = groups[0];
        socket.emit("grupoActualizado", grupoActual);
    
        groups.forEach((group, index) => {
          const { juez, users } = group;
          const scramble = generarNuevoScramble();
          if (Array.isArray(users)) {
            users.forEach((participantId) => { // Modificado
            const participantSocket = joinNS.sockets.get(participantId); // Obtener el objeto de socket del participante
            if (participantSocket) {
              participantSocket.emit("paired", {
                juez: juez || "Juez no disponible",
                users: users,
              });
              participantSocket.emit("scramble", scramble);
              participantSocket.emit("grupoId", index);
            }
          });
          if (juez) {
            const juezSocket = joinNS.sockets.get(juez); // Obtener el objeto de socket del juez
            if (juezSocket) {
              juezSocket.emit("grupo", {
                juez: juez,
                users: users,
                grupoId: index,
              });
            }
          }
        }else{
          console.error('users no está definido o no es un array');
        }
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
      const juezEnGrupo = juecesViendoTiempos.find(
        (juez) => juez.userId === socket.userId
      );

      if (juezEnGrupo) {
        const tiemposGrupo = tiemposGrupo[grupoId] || {};
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

    socket.on("siguienteGrupo", () => {
      const grupoActualIndex = groups.findIndex((g) => g === grupoActual);
      const siguienteGrupo = groups[grupoActualIndex + 1];

      if (siguienteGrupo) {
        grupoActual = siguienteGrupo; // Actualizar grupoActual en el servidor
        socket.emit("cambiarGrupo", siguienteGrupo);
        socket.emit("unirseGrupo", {
          juezId: juezID[0].juezID,
          grupoIndex: grupoActualIndex + 1,
        });
        socket.emit("grupoActualizado", siguienteGrupo); // Emitir evento con el nuevo grupo actual
      } else {
        // Todos los grupos han terminado, pasamos a la siguiente ronda
        const ganadores = roundParticipants.map((grupo) => {
          const indiceGanador = grupo.promedios.indexOf(
            Math.min(...grupo.promedios)
          );
          return grupo.users[indiceGanador];
        });

        if (ganadores.length > 1) {
          const nuevosGrupos = groupParticipants(ganadores, 2, juezID[0]);
          groups = nuevosGrupos;
          grupoActual = nuevosGrupos[0];

          nuevosGrupos.forEach(([juez, grupo], index) => {
            const scramble = generarNuevoScramble();
            grupo.forEach((participante) => {
              participante.emit("nuevaRonda", {
                oponentes: [juez.userId, ...grupo.map((p) => p.userId)],
                scramble,
                grupoId: index,
              });
            });
          });
        } else {
          // Solo queda un ganador, el torneo ha terminado
          socket.emit("torneoTerminado", ganadores[0].userId);
          navigate("/", { state: { ganador: ganadores[0].userId } });
        }
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
      const grupoId = socket.grupoId;

      if (grupoId !== grupoActual) {
        console.log("El usuario no está en el grupo actual");
        return;
      }

      const grupo = roundParticipants.find((g) => g.grupoId === grupoId);

      if (!grupo) {
        console.error("Grupo no encontrado");
        return;
      }

      let userRole = null;
      if (grupo.user1.userId === userId) {
        userRole = "user1";
      } else if (grupo.user2.userId === userId) {
        userRole = "user2";
      }

      if (!userRole) {
        console.error("Usuario no encontrado en el grupo");
        return;
      }

      const tiempo = convertTimeToMilliseconds(time);
      const promedioKey = userRole === "user1" ? "promedio1" : "promedio2";
      const tiemposKey = userRole === "user1" ? "tiempos1" : "tiempos2";

      if (!grupo[tiemposKey]) {
        grupo[tiemposKey] = [];
      }

      grupo[tiemposKey].push(tiempo);
      grupo[promedioKey] =
        grupo[tiemposKey].reduce((a, b) => a + b, 0) / grupo[tiemposKey].length;

      console.log(`Tiempo de ${userId} (${userRole}):`, time);
      console.log(`Promedio de ${userId}:`, grupo[promedioKey]);

      const tiemposPorGrupo = {
        [grupoId]: {
          user1: {
            userId: grupo.user1.userId,
            tiempos: grupo.tiempos1 || [],
            promedio: grupo.promedio1 || 0,
          },
          user2: {
            userId: grupo.user2.userId,
            tiempos: grupo.tiempos2 || [],
            promedio: grupo.promedio2 || 0,
          },
        },
      };

      juezID.forEach((juez) => {
        juez.emit("tiemposUsuarios", tiemposPorGrupo);
      });

      if (
        grupo.tiempos1 &&
        grupo.tiempos2 &&
        grupo.tiempos1.length === 5 &&
        grupo.tiempos2.length === 5
      ) {
        const ganador = grupo.promedio1 < grupo.promedio2 ? grupo.user1 : grupo.user2;
        const promedioGanador = grupo.promedio1 < grupo.promedio2 ? grupo.promedio1 : grupo.promedio2;
    
        juezID.forEach((juez) => {
          juez.emit("ganadorRonda", { userId: ganador.userId, promedio: promedioGanador });
        });
      }
    });

    socket.on("marcarGanador", ({ grupo, ganador }) => {
      const grupoId = grupo.join("-");
      const juezEnGrupo = juecesViendoTiempos.find(
        (juez) => juez.juezID === socket.juezID
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

  function groupParticipants(participantes, juezID) {
    const groups = [];
    let groupIndex = 0;
  
    while (participantes.length > 0) {
      const [user1, user2] = participantes.splice(0, 2);
      const juezId = juezID[0]; // Obtener el ID del primer juez en juezID
      const group = [juezId || null, [user1.userId, user2.userId]];
      groups.push(group);
  
      console.log(
        `Grupo ${groupIndex}:`,
        { juez: juezId || "Sin juez", users: [user1.userId, user2.userId] }
      );
  
      roundParticipants.push({
        juez: juezId || null,
        users: [user1, user2], // Modificado
        promedios: [0, 0],
        grupoId: groupIndex,
      });
  
      groupIndex++;
    }
  
    console.log(
      "Grupos formados:",
      groups.map((g) => [g[0] || "Sin juez", ...g[1].map((s) => s.userId)])
    );
  
    return groups;
  }

  function convertTimeToMilliseconds(timeString) {
    const [minutes, seconds, milliseconds] = timeString.split(":").map(Number);
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
