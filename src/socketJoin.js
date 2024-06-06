export function handleJoinTournament(joinNS) {
  let participantes = [];
  let juezSocket = {};
  let juezData = {};
  let jueces = [];
  let ganadores = [];
  let roundParticipants = [];
  let usuariosData = {};
  let juecesViendoTiempos = [];
  let grupoActual = null;
  let tiemposPorGrupo = {};
  let groups = [];
  let participantSockets = {};
  let torneoData = {};

  function reiniciarTorneo() {
    participantes = [];
    //juezID = [];
    ganadores = [];
    roundParticipants = [];
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
    for (const torneoId in torneoData) {
      const torneo = torneoData[torneoId];
      torneo.groups.forEach((grupo) => {
        console.log("Grupo antes de reiniciar:", grupo);
        grupo.tiempos1 = [];
        grupo.tiempos2 = [];
        grupo.promedio1 = 0;
        grupo.promedio2 = 0;
      });
    }
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

    socket.on(
      "ganadorRonda",
      ({ ganador, promedioGanador, grupoId, torneoId }) => {
        const torneo = torneoData[torneoId];

        if (!torneo) {
          console.log(`Torneo ${torneoId} no encontrado`);
          return;
        }

        const grupo = torneo.groups.find((g) => g.grupoId === grupoId);

        if (grupo) {
          ganadores.push({ userId: ganador, promedio: promedioGanador });
          console.log(`Ganador de la ronda (Grupo ${grupoId}):`, ganador);

          if (ganadores.length === torneo.groups.length) {
            reiniciarTiempos();

            if (ganadores.length > 1) {
              const nuevosGrupos = groupParticipants(
                ganadores.map((g) => ({ userId: g.userId })),
                torneo.juezId,
                torneo.torneoId
              );
              reiniciarRonda(nuevosGrupos, torneoId);

              nuevosGrupos.forEach((grupo, index) => {
                const scramble = generarNuevoScramble();
                grupo.users.forEach((userId) => {
                  const participante = participantSockets[userId];
                  if (participante) {
                    participante.emit("nuevaRonda", {
                      oponentes: grupo.users,
                      scramble,
                      grupoId: grupo.grupoId, // Utiliza el grupoId actualizado del nuevo grupo
                    });
                  }
                });
              });

              ganadores = [];
            } else {
              const ganadorAbsoluto = ganadores[0];
              console.log("Ganador absoluto:", ganadorAbsoluto.userId);

              const ganadorSocket = participantSockets[ganadorAbsoluto.userId];
              if (ganadorSocket) {
                ganadorSocket.emit("ganadorAbsoluto");
              }

              const juezSocketObj = juezSocket[torneo.juezId];
              if (juezSocketObj) {
                juezSocketObj.emit("torneoTerminado", ganadorAbsoluto.userId);
              }

              socket.emit("torneoTerminado", ganadorAbsoluto.userId);
              reiniciarTorneo(torneoId);
            }
          }
        }
      }
    );

    socket.on("juez", (data) => {
      const { juezId, torneoId, n_p, puntos } = data;

      torneoData[torneoId] = {
        juezId,
        n_p,
        puntos,
        participantes: [],
        roundParticipants: [],
      };
      juezSocket[juezId] = socket;
      juezData[juezId] = { torneoId }; // Almacenar el torneoId asociado al juez
      socket.juezId = juezId;
      socket.torneoId = torneoId; // Almacenar el torneoId en el socket del juez
      jueces.push(socket);

      console.log("TorneoData:", torneoData);

      console.log(`Juez connected: ${torneoData[torneoId].juezId}`);
    });

    socket.on("unirseGrupo", ({ juezId, grupoIndex }) => {
      const juezSocketObj = juezSocket[juezId];
      if (juezSocketObj) {
        const grupo = groups[grupoIndex];
        if (grupo) {
          grupo.juez = juezId;
          console.log(`Juez ${juezId} unido al grupo ${grupoIndex}`);
          juezSocketObj.emit("grupo", {
            juez: juez,
            users: users.map((userId) => ({ userId })),
            grupoId: index,
          });
        } else {
          console.log(`Grupo ${grupoIndex} no encontrado`);
        }
      } else {
        console.log(`Juez ${juezId} no encontrado`);
      }
    });

    socket.on("user", (data) => {
      const { userId, torneoId } = data;

      const torneo = torneoData[torneoId];

      if (!torneo) {
        console.log(`Torneo ${torneoId} no encontrado`);
        socket.emit("torneo_no_encontrado");
        return;
      }

      if (torneo.participantes.length >= torneo.n_p) {
        console.log(
          `El torneo ${torneoId} ya tiene ${torneo.n_p} participantes. No se permiten más conexiones.`
        );
        socket.emit("torneo_lleno");
        return;
      }

      participantSockets[userId] = socket;
      console.log(`Socket del participante ${userId} almacenado:`, socket.id);
      usuariosData[userId] = [];

      socket.userId = userId;
      socket.torneoId = torneoId;
      socket.emit("user", { userId, torneoId });
      torneo.participantes.push(socket);
      console.log(`User connected: ${socket.userId}`);
      console.log(
        "Participantes:",
        torneo.participantes.map((s) => s.userId)
      );

      console.log("Grupo del usuario:", torneo.grupoActual);

      if (torneo.participantes.length === torneo.n_p) {
        const groups = groupParticipants(
          torneo.participantes,
          torneo.juezId,
          torneoId
        );
        torneo.groups = groups;
        torneo.grupoActual = groups[0];
        socket.emit("grupoActualizado", torneo.grupoActual);

        const juezSocketObj = juezSocket[torneo.juezId];
        if (juezSocketObj) {
          juezSocketObj.emit("grupos", groups);
          console.log(`Grupos enviados al juez ${torneo.juezId}`);
        }

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

          const juezSocketObj = jueces.find((j) => j.juezId === juez);
          if (juezSocketObj) {
            juezSocketObj.emit("grupo", {
              juez: juez,
              users: users,
              grupoId: index,
            });
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
        reiniciarRonda(nuevosGrupos, torneoId);
        ganadores = [];
      }
    });

    socket.on("siguienteGrupo", () => {
      const grupoActualIndex = groups.findIndex((g) => g === grupoActual);
      const siguienteGrupo = groups[grupoActualIndex + 1];

      if (siguienteGrupo) {
        grupoActual = siguienteGrupo;
        socket.emit("cambiarGrupo", siguienteGrupo);
        socket.emit("unirseGrupo", {
          juezId: juezID[0].juezID,
          grupoIndex: grupoActualIndex + 1,
        });
        socket.emit("grupoActualizado", siguienteGrupo);
      } else {
        const ganadores = roundParticipants.map((grupo) => {
          const indiceGanador = grupo.promedios.indexOf(
            Math.min(...grupo.promedios)
          );
          return grupo.users[indiceGanador];
        });

        if (ganadores.length > 1) {
          const nuevosGrupos = groupParticipants(
            ganadores,
            2,
            torneoData[torneoId].juezId
          );
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
        }
      }
    });

    socket.on("disconnect", () => {
      if (socket.juezId) {
        const torneoId = socket.torneoId;
        console.log("TorneoId:", torneoId);
        const torneo = torneoData[torneoId];
        if (torneo) {
          console.log(`Juez desconectado: ${socket.juezId}`);
          // Emitir evento a los participantes para que se desconecten
          torneo.participantes.forEach((participante) => {
            const participanteSocket = participantSockets[participante.userId];
            if (participanteSocket) {
              participanteSocket.emit("redirigir", "/profile");
            }
          });
          delete juezSocket[socket.juezId];
          jueces = jueces.filter((j) => j.juezId !== socket.juezId);
          reiniciarTorneo(torneoId); // Reiniciar el torneo cuando el juez se desconecta
        }
      } else {
        console.log(`User disconnected: ${socket.userId}`);
    
        delete participantSockets[socket.userId];
        participantes = participantes.filter(
          (client) => client.userId !== socket.userId
        );
      }
    });

    socket.on("times", (message) => {
      const { time, grupoId, torneoId } = JSON.parse(message);
      const userId = socket.userId;

      const torneo = torneoData[torneoId];

      if (!torneo) {
        console.log(`Torneo ${torneoId} no encontrado`);
        return;
      }

      const grupo = torneo.groups.find((g) => g.grupoId === grupoId);
      console.log("Torneo:", grupo);
      if (!grupo) {
        console.error("Grupo no encontrado");
        return;
      }

      console.log("Datos del usuario:", grupoId, userId, time, torneoId);
      console.log("Usuarios en el grupo:", grupo.users);
      grupo.users.forEach((user, index) => {
        console.log(`Usuario ${user} - Índice: ${index}`);
      });
      const userIndex = grupo.users.findIndex((user) => user === userId);
      console.log("Index del usuario:", userIndex);
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
      grupo[promedioKey] =
        grupo[tiemposKey].reduce((a, b) => a + b, 0) / grupo[tiemposKey].length;

      console.log(`Tiempo de ${userId} (user${userIndex + 1}):`, time);
      console.log(`Promedio de ${userId}:`, grupo[promedioKey]);

      const tiemposPorGrupo = {
        [grupoId]: grupo.users.reduce((obj, user, index) => {
          obj[`user${index + 1}`] = {
            userId: user,
            tiempos: grupo[`tiempos${index + 1}`] || [],
            promedio: grupo[`promedio${index + 1}`] || 0,
          };
          return obj;
        }, {}),
      };

      const juezId = grupo.juez;
      const juezSocketObj = juezSocket[juezId];
      if (juezSocketObj) {
        juezSocketObj.emit("tiemposUsuarios", tiemposPorGrupo);
        console.log(`Tiempos enviados al juez ${juezId}:`, tiemposPorGrupo);
      }

      if (
        grupo.users.every(
          (_, index) => grupo[`tiempos${index + 1}`]?.length === 5
        )
      ) {
        const promedios = grupo.users.map(
          (_, index) => grupo[`promedio${index + 1}`]
        );
        const ganadorIndex = promedios.indexOf(Math.min(...promedios));
        const perdedorIndex = promedios.indexOf(Math.max(...promedios));
        const ganador = grupo.users[ganadorIndex];
        const perdedor = grupo.users[perdedorIndex];
        const promedioGanador = promedios[ganadorIndex];

        if (ganador === userId) {
          socket.emit("resultado", "Ganaste");
        } else if (perdedor === userId) {
          socket.emit("resultado", "Perdiste");
        }

        socket.emit("ganadorRonda", {
          ganador,
          promedioGanador,
          grupoId,
        });
        //const grupo = torneo.groups.find((g) => g.grupoId === grupoId);
        ganadores.push({ userId: ganador, promedio: promedioGanador });
        console.log(`Ganador de la ronda (Grupo ${grupoId}):`, ganador);
        console.log(`Perdedor de la ronda (Grupo ${grupoId}):`, perdedor);
        console.log(
          "Ganadores:",
          ganadores.map((g) => g.userId)
        );
        console.log("tamaño de arreglo ganadores:", ganadores.length);
        console.log("tamaño de arreglo de grupos:", torneo.groups.length);
        const perdedorSocket = participantSockets[perdedor];
        if (perdedorSocket) {
          perdedorSocket.emit("redirigir", "/");
        }
        if (ganadores.length === torneo.groups.length) {
          reiniciarTiempos();
          console.log(
            "Ganadores:",
            ganadores.map((g) => g.userId)
          );

          if (ganadores.length > 1) {
            const nuevosGrupos = groupParticipants(
              ganadores.map((g) => ({ userId: g.userId })),
              juezId,
              torneoId
            );

            console.log(
              "Nuevos grupos:",
              nuevosGrupos.map((g) => g.users)
            );
            groups = nuevosGrupos;
            reiniciarRonda(nuevosGrupos, torneoId);

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
            const ganadorSocket = participantSockets[ganadorAbsoluto.userId];

            if (ganadorSocket) {
              ganadorSocket.emit("ganadorAbsoluto");
            }

            const juezSocketObj = juezSocket[torneo.juezId];
            if (juezSocketObj) {
              juezSocketObj.emit("torneoTerminado", ganadorAbsoluto.userId);
            }

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

  function groupParticipants(participantes, juezId, torneoId) {
    const groups = [];
    const numParticipants = participantes.length;
    const numGroups = Math.floor(numParticipants / 2);
    torneoData[torneoId].roundParticipants = [];
    torneoData[torneoId].groups = [];

    for (let i = 0; i < numGroups; i++) {
      console.log(
        "Participantes:",
        participantes.map((p) => p.userId)
      );
      const user1 = participantes[i * 2];
      const user2 = participantes[i * 2 + 1];
      const group = {
        juez: juezId,
        users: [user1.userId, user2.userId],
        grupoId: i,
      };
      groups.push(group);
      torneoData[torneoId].groups.push(group); // Agrega el grupo al array groups del torneo

      console.log("Grupo", i, ":", group);

      console.log(`Grupo ${i}:`, {
        juez: juezId || "Sin juez",
        users: [user1.userId, user2.userId],
      });

      torneoData[torneoId].roundParticipants.push({
        juez: juezId,
        users: [user1.userId, user2.userId],
        promedios: [0, 0],
        grupoId: i,
      });
      console.log("participantesData:", torneoData[torneoId].roundParticipants);
      console.log("Groups del torneo:", torneoData[torneoId].groups);
    }

    console.log(
      "Grupos formados:",
      groups.map((g) => ({ juez: g.juez || "Sin juez", users: g.users }))
    );
    console.log(groups.length);

    return groups;
  }

  function convertTimeToMilliseconds(timeString) {
    const [minutes, seconds, milliseconds] = timeString.split(":").map(Number);
    return minutes * 60 * 1000 + seconds * 1000 + milliseconds;
  }

  function reiniciarRonda(nuevosGrupos, torneoId) {
    torneoData[torneoId].roundParticipants = [];
    torneoData[torneoId].groups = nuevosGrupos; // Asigna los nuevos grupos al torneo

    nuevosGrupos.forEach((grupo, index) => {
      const { juez, users } = grupo;
      users.forEach((userId) => {
        torneoData[torneoId].participantes[userId] = []; // Reinicia los datos de cada participante
      });
      console.log(
        "participantesData reiniciado:",
        torneoData[torneoId].roundParticipants
      );
      torneoData[torneoId].roundParticipants.push({
        juez,
        users,
        promedios: [0, 0],
        grupoId: grupo.grupoId,
      });

      console.log(`Grupo ${index}:`, {
        juez: juez || "Sin juez",
        users,
        grupoId: grupo.grupoId,
      });
    });

    console.log(
      "roundParticipants:",
      torneoData[torneoId].roundParticipants.map((p) => ({
        juez: p.juez,
        users: p.users,
        grupoId: p.grupoId,
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
