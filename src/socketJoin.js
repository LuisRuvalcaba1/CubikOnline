export function handleJoinTournament(joinNS) {
  let participantes = [];
  let juezID = [];
  let scrambles = [];
  let n_p;
  let rondas = [];
  const tiempos = {};
  let scrambleIndex = 0;

  joinNS.on("connection", (socket) => {
    console.log("Conectado al espacio de nombres de torneos");

    socket.on("n_participantes", (n) => {
      socket.n_p = n;
      n_p = n;
      socket.emit("n_participantes", n);
      console.log(`n_participantes: ${socket.n_p}`);
      console.log(typeof(socket.n_p));
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

      console.log(participantes.length);
      console.log("Usuarios faltantes",n_p - participantes.length);
      if (participantes.length == n_p) {
        for(let i = 0; i<5 ; i++){
          scrambles.push(generarNuevoScramble());
          console.log(scrambles[i]);
        }

        while (participantes.length >= 2) {
          const [user1, user2] = participantes.splice(0, 2);
          const pair = { user1, user2 };
          rondas.push(pair);
          user1.emit("paired", user2.userId);
          user2.emit("paired", user1.userId);
          user1.emit("scramble", scrambles[0]);
          user2.emit("scramble", scrambles[0]);
        }
    
        console.log("Usuarios emparejados");
      }
    });

    socket.on("roundResult", (data) => {
      const { winner, loser } = JSON.parse(data);
    
      // Encontrar la ronda correspondiente
      const round = rondas.find(
        (round) =>
          round &&
          (round.user1.userId === winner ||
            round.user1.userId === loser ||
            round.user2.userId === winner ||
            round.user2.userId === loser)
      );
    
      if (round) {
        // Remover los participantes de la ronda actual
        rondas = rondas.filter((r) => r !== round);
    
        // Agregar el ganador a la siguiente ronda
        const ganador = round.user1.userId === winner ? round.user1 : round.user2;
        participantes.push(ganador);
    
        // Iniciar una nueva ronda si hay suficientes participantes
        if (participantes.length >= 2) {
          iniciarNuevaRonda();
        } else if (participantes.length === 1) {
          // Declarar el ganador final si solo queda un participante
          const ganador = participantes[0];
          joinNS.emit("finalResult", `El ganador final es ${ganador.username}`);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
      participantes = participantes.filter(
        (client) => client.userId !== socket.userId
      );

      juezID = juezID.filter(
        (client) => client.juezID !== socket.juezID
      );
    });

    socket.on("times", (message) => {
      const { time } = JSON.parse(message);
      const userId = socket.userId;
    
      if (!tiempos[userId]) {
        tiempos[userId] = [];
      }
    
      tiempos[userId].push(time);
    });

    socket.on("nextScramble", () => {
      if (scrambleIndex < scrambles.length) {
        socket.emit("newScramble", scrambles[scrambleIndex]);
        scrambleIndex++;
      } else {
        // Calcular el tiempo promedio de cada usuario
        const promedios = {};
        for (const userId in tiempos) {
          const tiemposUsuario = tiempos[userId];
          const totalSegundos = tiemposUsuario.reduce((total, tiempo) => {
            const [minutos, segundos, milisegundos] = tiempo.split(":").map(Number);
            return total + minutos * 60 + segundos + milisegundos / 1000;
          }, 0);
          const promedioSegundos = totalSegundos / tiemposUsuario.length;
          promedios[userId] = promedioSegundos;
        }
    
        // Encontrar el usuario con el tiempo promedio más bajo
        const ganador = Object.entries(promedios).reduce((min, [userId, promedio]) => {
          return promedio < min[1] ? [userId, promedio] : min;
        }, [null, Infinity]);
    
        // Emitir el resultado a todos los clientes
        joinNS.emit("result", `El ganador es ${ganador[0]} con un tiempo promedio de ${ganador[1].toFixed(3)} segundos`);
      }
    });

  });
}

function iniciarNuevaRonda() {
  while (participantes.length >= 2) {
    const [user1, user2] = participantes.splice(0, 2);
    const pair = { user1, user2 };
    rondas.push(pair);
    user1.emit("paired", user2.userId);
    user2.emit("paired", user1.userId);
    user1.emit("scramble", scrambles[scrambleIndex]);
    user2.emit("scramble", scrambles[scrambleIndex]);
    scrambleIndex++;
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

