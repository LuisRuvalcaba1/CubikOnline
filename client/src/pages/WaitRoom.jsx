import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useAuthTorneo } from "../context/TorneoContext";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const URL = import.meta.env.VITE_BACKEND_URL;
import { verifyTokenRequest } from "../api/auth";
import { useObjetives } from "../context/ObjetivesContext";
import WinModal from "../components/WinModal.jsx";

function WaitRoom() {
  const { user, updateUserPoints } = useAuth();
  const { getObjetivesContext, updateObjetive } = useObjetives();
  const navigate = useNavigate();
  const { user2, torneo } = useLocation().state;
  const { getTorneoById } = useAuthTorneo();
  const [usuario, setUsuario] = useState("");
  const [solveCount, setSolveCount] = useState(0);
  const [isPaired, setIsPaired] = useState(false);
  const [milisegundos, setMilisegundos] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [minutos, setMinutos] = useState(0);
  const [activo, setActivo] = useState(false);
  const [tiempoInicial, setTiempoInicial] = useState(null);
  const [scramble, setScramble] = useState("");
  const [socket, setSocket] = useState("");
  const [resultado, setResultado] = useState(null);
  const [ganador, setGanador] = useState(null);
  const [tiempos, setTiempos] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [tiemposRegistrados, setTiemposRegistrados] = useState(0);
  const [grupoActual, setGrupoActual] = useState(null);
  const [grupoId, setGrupoId] = useState(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const [ganadorAbsoluto, setGanadorAbsoluto] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await verifyTokenRequest();
        setCurrentUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [user]);

  useEffect(() => {
    const fetchTorneo = async () => {
      try {
        const torneo = await getTorneoById();
        console.log(torneo);
      } catch (error) {
        console.error("Error al obtener el torneo:", error);
      }
    };

    fetchTorneo();
  }, []);

  useEffect(() => {
    const socket = io(`${URL}/join`);
    setSocket(socket);

    socket.on("gruposFormados", () => {
      socket.emit("user", { userId: user2._id, torneoId: torneo });
      //socket.emit("user", user2._id)
    });
  
    socket.emit("joinTorneo", torneo);
  
    console.log("Torneo: ", torneo);

    socket.emit("user", { userId: user2._id, torneoId: torneo });
    //socket.emit("user", user2._id);
    socket.on("user", (user) => {
      setUsuario(user);
    });

    socket.emit("joinTorneo", torneo);

    console.log("Torneo: ", torneo);
    socket.on("paired", (data) => {
      setIsPaired(true);
      setGrupoActual(data);
      setGrupoId(data.grupoId);
      console.log("Emparejado:", data);
    });

    socket.on("grupoId", (id) => {
      setGrupoId(id);
    });

    socket.on("scramble", (nuevoScramble) => {
      setScramble(nuevoScramble);
    });

    socket.on("resultado", (data) => {
      setResultado(
        `${data.ganador ? "Ganaste" : "Perdiste"} con un promedio de ${
          data.promedio
        }. El promedio de tu oponente fue ${data.promedioOponente}.`
      );
      console.log("Resultado:", data);
      if (data === "Ganaste") {
        if (user2) {
          const actualizarObjetivo = async () => {
            try {
              const objetivosResponse = await getObjetivesContext();
              const objetivos = objetivosResponse.data;
              const objetivoActual = objetivos.find(
                (objetivo) => objetivo.objective === 4 && objetivo.qty_times < 5
              );
              if (objetivoActual) {
                const nuevoQtyTimes = objetivoActual.qty_times + 1;
                await updateObjetive(objetivoActual._id, {
                  qty_times: nuevoQtyTimes,
                });
                console.log("Objetivo actualizado:", nuevoQtyTimes);
                const newPoints = user2.points + 10;
                updateUserPoints(user2._id, { points: newPoints })
                  .then((updatedUser) => {
                    setCurrentUser({
                      ...user2,
                      points: updatedUser.points,
                    });
                    console.log("Puntos actualizados:", updatedUser.points);
                  })
                  .catch((error) => {
                    console.error("Error al actualizar los puntos:", error);
                  });
              } else {
                console.log("No se encontró el objetivo");
              }
            } catch (error) {
              console.error("Error al actualizar el objetivo:", error);
            }
          };

          actualizarObjetivo();
        }
      }
    });

    socket.on("ganadorAbsoluto", () => {
      setShowWinModal(true);
    });

    socket.on("redirigir", (ruta) => {
      navigate(ruta);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("nuevaRonda", (data) => {
        setIsPaired(true);
        setScramble(data.scramble);
        setActivo(false);
        setMilisegundos(0);
        setSegundos(0);
        setMinutos(0);
        setTiemposRegistrados(0);
        //setGanadorAbsoluto(null);
        setGrupoId(data.grupoId);
        console.log("Nueva ronda:", data.grupoId);
      });
    }
  }, [socket]);

  useEffect(() => {
    let interval;
    if (activo) {
      interval = setInterval(() => {
        const tiempoActual = performance.now();
        const tiempoTranscurrido = tiempoActual - tiempoInicial;
        const tiempoMilisegundos = Math.floor(tiempoTranscurrido % 1000);
        const tiempoSegundos = Math.floor((tiempoTranscurrido / 1000) % 60);
        const tiempoMinutos = Math.floor(
          (tiempoTranscurrido / (1000 * 60)) % 60
        );

        setMilisegundos(tiempoMilisegundos);
        setSegundos(tiempoSegundos);
        setMinutos(tiempoMinutos);
      }, 1);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [activo, tiempoInicial]);

  function registrarTiempo() {
    if (tiemposRegistrados < 5) {
      if (tiempoInicial && isPaired) {
        const tiempoFinal = performance.now();
        const tiempoTranscurrido = tiempoFinal - tiempoInicial;
        const tiempoMilisegundos = Math.floor(tiempoTranscurrido % 1000);
        const tiempoSegundos = Math.floor((tiempoTranscurrido / 1000) % 60);
        const tiempoMinutos = Math.floor(
          (tiempoTranscurrido / (1000 * 60)) % 60
        );

        const time = `${tiempoMinutos}:${
          tiempoSegundos < 10 ? "0" : ""
        }${tiempoSegundos}:${
          tiempoMilisegundos < 10 ? "00" : tiempoMilisegundos < 100 ? "0" : ""
        }${tiempoMilisegundos}`;

        if (socket) {
          const message = JSON.stringify({ time, grupoId, torneoId: torneo });
          socket.emit("times", message);
          socket.emit("nextScramble");
          console.log("Enviado:", message);
          setTiemposRegistrados(tiemposRegistrados + 1);
        }
      }
    }
  }

  useEffect(() => {
    function handleKeyPress(event) {
      if (event.keyCode === 32) {
        setActivo((prevActivo) => !prevActivo);
        if (!activo) {
          setTiempoInicial(performance.now());
        } else {
          registrarTiempo();
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [activo, socket]);

  return (
    <div>
      {isPaired ? (
        <>
          <h1>Paired</h1>
          <p>{scramble}</p>
          <div className="cronometro">
            <p>
              {minutos < 10 ? `0${minutos}` : minutos} :{" "}
              {segundos < 10 ? `0${segundos}` : segundos} :{" "}
              {milisegundos < 10
                ? `00${milisegundos}`
                : milisegundos < 100
                ? `0${milisegundos}`
                : milisegundos}
            </p>
          </div>
          <p>{user2._id}</p>
          <h1>Grupo {grupoId}</h1>
          <p>Juez: {grupoActual.juez}</p>
          <p>Usuarios: {grupoActual.users.join(", ")}</p>
          {showWinModal && <WinModal />}
          
        </>
      ) : (
        <>
          <h1>Wait Room</h1>
          <h2>{user2.username}</h2>
          <h2>{torneo}</h2>
          <h2>{user2._id}</h2>
        </>
      )}
    </div>
  );
}

export default WaitRoom;
