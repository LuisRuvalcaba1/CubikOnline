export function handleJoinTournament(socket) {
  let participantes = [];
  let juezID = [];

  socket.on("user", (user) => {
    console.log("Usuario conectado:", user);
    socket.userId = user;
    socket.emit("user", user);

    participantes.push(socket);
  });

  socket.on("juez", (juez) => {
    socket.juezID = juez;
    socket.emit("juez", juez)

    juezID.push(socket)
  });

  socket.on('torneo', (torneo) => {
    socket.torneoID = torneo;
    socket.emit("torneo", torneo);
  })

  socket.on("disconnect", () => {
    console.log("Desconectado del espacio de nombres de torneos");
  });
}
