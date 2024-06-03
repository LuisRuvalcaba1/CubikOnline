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
  let participantSockets = {};

  function reiniciarTorneo() {
    participantes = [];
    juezID = [];
    n_p = undefined;
    ganadores = [];
    roundParticipants = [];
    participantesData = {};
    usuariosData = {};
    juecesViendoTiempos = [];
    grupoActual = null;
    tiemposPorGrupo = {};
    groups = [];
    participantSockets = {};
    console.log("Torneo reiniciado");
  }

  function reiniciarTiempos() {
    tiemposPorGrupo = {};
    roundParticipants.forEach((grupo) => {
      grupo.tiempos1 = [];
      grupo.tiempos2 = [];
      grupo.promedio1 = 0;
      grupo.promedio2 = 0;
    });
    console.log("Tiempos reiniciados");
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

    socket.on("ganadorRonda", ({ ganador, promedioGanador, grupoId }) => {
      const grupo = groups.find((g) => g.grupoId === grupoId);
    
      if (grupo) {
        const perdedores = grupo.users.filter((userId) => userId !== ganador);
        perdedores.forEach((perdedor) => {
          const perdedorSocket = participantSockets[perdedor];
          if (perdedorSocket) {
            perdedorSocket.emit("redirigir", "/");
          }
        });
    
        ganadores.push({ userId: ganador, promedio: promedioGanador });
        console.log(`Ganador de la ronda (Grupo ${grupoId}):`, ganador);
    
        if (ganadores.length === groups.length) {
          reiniciarTiempos();
    
          if (ganadores.length > 1) {
            const nuevosGrupos = groupParticipants(
              ganadores.map((g) => ({ userId: g.userId })),
              juezID[0]
            );
            groups = nuevosGrupos;
            reiniciarRonda(nuevosGrupos);
    
            nuevosGrupos.forEach((grupo, index) => {
              const scramble = generarNuevoScramble();
              grupo.users.forEach((userId) => {
                const participante = participantSockets[userId];
                if (participante) {
                  participante.emit("nuevaRonda", {
                    oponentes: grupo.users,
                    scramble,
                    grupoId: index,
                  });
                }
              });
            });
    
            ganadores = [];
          } else {
            const ganadorAbsoluto = ganadores[0];
            console.log("Ganador absoluto:", ganadorAbsoluto.userId);
            joinNS.emit("torneoTerminado", ganadorAbsoluto.userId);
            reiniciarTorneo();
          }
        }
      }
    });

    socket.on("n_participantes", (n) => {
      socket.n_p = n;
      n_p = n;
      socket.emit("n_participantes", n);
      console.log(`n_participantes: ${socket.n_p}`);
    });

    socket.on("juez", (juez) => {
      socket.juezId = juez;
      juezID.push(socket); // Almacenar el objeto de socket del juez en juezID
      console.log(juezID.length);
      console.log(`Juez connected: ${socket.juezId}`);
      console.log(
        "Jueces:",
        juezID.map((j) => j.juezId)
      );
    });

    socket.on("unirseGrupo", ({ juezId, grupoIndex }) => {
      const juezSocket = joinNS.sockets.get(juezId); // Obtener el objeto de socket del juez utilizando el ID
      if (juezSocket) {
        const grupo = groups[grupoIndex];
        if (grupo) {
          grupo.juez = juezId;
          console.log(`Juez ${juezId} unido al grupo ${grupoIndex}`);
          juezSocket.emit("grupo", {
            juez: juezId,
            users: grupo.users,
            grupoId: grupoIndex,
          });
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
      participantSockets[user] = socket;
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
        groups = groupParticipants(participantes, juezID[0]); // Actualiza groups aquí
        grupoActual = groups[0];
        socket.emit("grupoActualizado", grupoActual);

        juezID.forEach((juezSocket) => {
          if (juezSocket) {
            juezSocket.emit("grupos", groups);
            console.log(`Grupos enviados al juez ${juezSocket.juezId}`);
          }
        });
        groups.forEach((group, index) => {
          const { juez, users } = group;
          const scramble = generarNuevoScramble();
          users.forEach((participantId) => {
            const participantSocket = participantSockets[participantId];
            if (participantSocket) {
              console.log("Enviando scramble a", participantId);
              participantSocket.emit("paired", {
                juez: juez || "Juez no disponible",
                users: users,
                grupoId: index,
              });
              participantSocket.emit("scramble", scramble);
              participantSocket.emit("grupoId", index);
            } else {
              console.log("Participante no encontrado");
            }
          });
          if (juez) {
            const juezSocket = joinNS.sockets.get(juez);
            if (juezSocket) {
              juezSocket.emit("grupo", {
                juez: juez,
                users: users,
                grupoId: index,
              });
            }
          }
        });
      }
    });

    socket.on("finalRound", () => {
      if (ganadores.length > 1) {
        const nuevosGrupos = groupParticipants(ganadores, juezID[0]);
        nuevosGrupos.forEach((grupo, index) => {
          const scramble = generarNuevoScramble();
          grupo.users.forEach((userId) => {
            const participante = participantSockets[userId];
            if (participante) {
              participante.emit("nuevaRonda", {
                oponentes: grupo.users,
                scramble,
                grupoId: index,
              });
              participante.emit("paired");
            }
          });
        });
        reiniciarRonda(nuevosGrupos);
        ganadores = [];
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

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
      delete participantSockets[socket.userId];
      participantes = participantes.filter(
        (client) => client.userId !== socket.userId
      );
      juezID = juezID.filter((client) => client.juezID !== socket.juezID);
    });

    socket.on("times", (message) => {
      const { time, grupoId } = JSON.parse(message);
      const userId = socket.userId;
    
      if (grupoId === undefined) {
        console.log("El usuario no está en ningún grupo");
        return;
      }
    
      const grupo = roundParticipants.find((g) => g.grupoId === grupoId);
    
      if (!grupo) {
        console.error("Grupo no encontrado");
        return;
      }
    
      const userIndex = grupo.users.indexOf(userId);
    
      if (userIndex === -1) {
        console.error("Usuario no encontrado en el grupo");
        return;
      }
    
      const tiemposKey = `tiempos${userIndex + 1}`;
      const promedioKey = `promedio${userIndex + 1}`;
    
      if (!grupo[tiemposKey]) {
        grupo[tiemposKey] = [];
      }
    
      const tiempo = convertTimeToMilliseconds(time);
      grupo[tiemposKey].push(tiempo);
      grupo[promedioKey] = grupo[tiemposKey].reduce((a, b) => a + b, 0) / grupo[tiemposKey].length;
    
      console.log(`Tiempo de ${userId} (user${userIndex + 1}):`, time);
      console.log(`Promedio de ${userId}:`, grupo[promedioKey]);
    
      const tiemposPorGrupo = {
        [grupoId]: grupo.users.reduce((obj, userId, index) => {
          obj[`user${index + 1}`] = {
            userId,
            tiempos: grupo[`tiempos${index + 1}`] || [],
            promedio: grupo[`promedio${index + 1}`] || 0,
          };
          return obj;
        }, {}),
      };
    
      const juezId = grupo.juez;
      const juezSocket = juezID.find((j) => j.juezId === juezId);
      if (juezSocket) {
        juezSocket.emit("tiemposUsuarios", tiemposPorGrupo);
        //console.log(`Tiempos enviados al juez ${juezId}:`, tiemposPorGrupo);
      }
    
    
      if (grupo.users.every((_, index) => grupo[`tiempos${index + 1}`]?.length === 5)) {
        const promedios = grupo.users.map((_, index) => grupo[`promedio${index + 1}`]);
        const ganadorIndex = promedios.indexOf(Math.min(...promedios));
        const ganador = grupo.users[ganadorIndex];
        const promedioGanador = promedios[ganadorIndex];
    
        socket.emit("ganadorRonda", {
          ganador,
          promedioGanador,
          grupoId,
        });
    
        ganadores.push({ userId: ganador, promedio: promedioGanador });
        console.log(`Ganador de la ronda (Grupo ${grupoId}):`, ganador);
    
        if (ganadores.length === groups.length) {
          reiniciarTiempos();
    
          if (ganadores.length > 1) {
            const nuevosGrupos = groupParticipants(
              ganadores.map((g) => ({ userId: g.userId })),
              juezID ? juezID[0] : null
            );
            groups = nuevosGrupos;
            reiniciarRonda(nuevosGrupos);
    
            nuevosGrupos.forEach((grupo, index) => {
              const scramble = generarNuevoScramble();
              grupo.users.forEach((userId) => {
                const participante = participantSockets[userId];
                if (participante) {
                  participante.emit("nuevaRonda", {
                    oponentes: grupo.users,
                    scramble,
                    grupoId: index,
                  });
                }
              });
            });
    
            ganadores = [];
          } else {
            const ganadorAbsoluto = ganadores[0];
            console.log("Ganador absoluto:", ganadorAbsoluto.userId);
            joinNS.emit("torneoTerminado", ganadorAbsoluto.userId);
            reiniciarTorneo();
          }
        }
      }
    });

    socket.on("nextScramble", () => {
      const userId = socket.userId;
      const participanteData = usuariosData[userId];

      if (!participanteData) {
        console.error("Datos del participante no encontrados");
        return;
      }

      const nuevoScramble = generarNuevoScramble();
      socket.emit("scramble", nuevoScramble);
    });
  });

  function groupParticipants(participantes, juezID) {
    const groups = [];
    const numParticipants = participantes.length;
    const numGroups = Math.floor(numParticipants / 2);
  
    for (let i = 0; i < numGroups; i++) {
      const user1 = participantes[i * 2];
      const user2 = participantes[i * 2 + 1];
      const juezId = juezID ? juezID.juezId : null;
      const group = {
        juez: juezId,
        users: [user1.userId, user2.userId],
        grupoId: i,
      };
      groups.push(group);
  
      console.log(`Grupo ${i}:`, {
        juez: juezId || "Sin juez",
        users: [user1.userId, user2.userId],
      });
  
      roundParticipants.push({
        juez: juezId,
        users: [user1.userId, user2.userId],
        promedios: [0, 0],
        grupoId: i,
      });
    }
  
    console.log(
      "Grupos formados:",
      groups.map((g) => ({ juez: g.juez || "Sin juez", users: g.users }))
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
    console.log("participantesData reiniciado:", participantesData);
  
    nuevosGrupos.forEach((grupo, index) => {
      const { juez, users } = grupo;
      participantesData[users[0]] = [];
      participantesData[users[1]] = [];
  
      roundParticipants.push({
        juez,
        users,
        promedios: [0, 0],
        grupoId: index,
      });
  
      console.log(`Grupo ${index}:`, {
        juez: juez || "Sin juez",
        users,
      });
    });
  
    console.log(
      "roundParticipants:",
      roundParticipants.map((p) => ({
        juez: p.juez,
        users: p.users,
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
