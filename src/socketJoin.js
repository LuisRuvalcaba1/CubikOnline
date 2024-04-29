export function handleJoinTournament(joinNS) {
  let participantes = [];
  let juezID = [];
  let scrambles = [];
  let n_p;

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
        console.log("Todos los participantes conectados");
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

