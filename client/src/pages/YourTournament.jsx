import { useEffect, useState } from "react";
import { useAuthTorneo } from "../context/TorneoContext";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import "./Torneo.css";
import { removeTokenRequest } from "../api/auth";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { verifyTokenRequest } from "../api/auth";

const URL = import.meta.env.VITE_BACKEND_URL;

Modal.setAppElement("#root");

function YourTournament() {
  const navigate = useNavigate();
  const { getTorneoById } = useAuthTorneo();
  const location = useLocation();
  const [participantes, setParticipantes] = useState(null);
  const [torneo, setTorneo] = useState([]);
  const [socket, setSocket] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [grupoActual, setGrupoActual] = useState(null);
  const { user, logout, statusChangeAuth } = useAuth();
  const { deleteTorneoByJuez } = useAuthTorneo();
  const [currentUser, setCurrentUser] = useState(null);
  const [tiemposUsuarios, setTiemposUsuarios] = useState({});
  const [ganador, setGanador] = useState(null);
  const [promedioGanador, setPromedioGanador] = useState(null);

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
    const eliminarToken = async () => {
      try {
        const data = {
          email: currentUser.email,
          status: "inactive",
          role: "user",
        };
        deleteTorneoByJuez(data._id);
        statusChangeAuth(data);
        await logout();
        await removeTokenRequest();
      } catch (error) {
        console.error("Error al eliminar el token:", error);
      }
    };
    const timeoutId = setTimeout(eliminarToken, 21600000);

    return () => clearTimeout(timeoutId);
  }, [currentUser, deleteTorneoByJuez, statusChangeAuth, logout]);

  useEffect(() => {
    const socket = io(`${URL}/join`);
    setSocket(socket);
    console.log("Socket del juez creado:", socket);
    if (currentUser) {
      socket.emit("juez", currentUser._id);
      socket.emit("n_participantes", participantes);
      socket.emit("unirseGrupo", { juezId: currentUser._id, grupoIndex: 0 });
    }

    socket.on("grupos", (gruposFormados) => {
      setGrupos(gruposFormados);
    });

    socket.on("grupoActualizado", (nuevoGrupo) => {
      setGrupoActual(nuevoGrupo);
    });

    socket.on("tiemposUsuarios", (tiemposPorGrupo) => {
      console.log("Tiempos recibidos:", tiemposPorGrupo);
      setTiemposUsuarios((prevTiempos) => ({
        ...prevTiempos,
        ...tiemposPorGrupo,
      }));
    });

    socket.on("ganadorRonda", (data) => {
      setGanador(data.userId);
      setPromedioGanador(data.promedio);
      console.log("Ganador de la ronda:", data.userId, data.promedio);
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser, participantes]);

  useEffect(() => {
    console.log("tiemposUsuarios actualizado:", tiemposUsuarios);
    console.log("grupoActual:", grupoActual);
  }, [tiemposUsuarios, grupoActual]);

  const handleGrupoSeleccionado = (grupo, index) => {
    setGrupoSeleccionado(grupo);
    setGrupoActual({ ...grupo, grupoId: index });
  };

  useEffect(() => {
    if (location.state && location.state.participantes) {
      setParticipantes(location.state.participantes);
    }
  }, [location.state]);

  function formatTime(timeInMilliseconds) {
    const minutes = Math.floor(timeInMilliseconds / 60000);
    const seconds = Math.floor((timeInMilliseconds % 60000) / 1000);
    const milliseconds = timeInMilliseconds % 1000;

    return `${padZero(minutes)}:${padZero(seconds)}:${padZero(
      milliseconds,
      3
    )}`;
  }

  function padZero(value, length = 2) {
    return value.toString().padStart(length, "0");
  }

  return (
    <div>
      <h1>Your Tournament</h1>
      <div>
        <h2>Grupos formados:</h2>
        {grupos.map((grupo, index) => (
          <button
            key={index}
            onClick={() => handleGrupoSeleccionado(grupo, index)}
            disabled={grupoActual && grupoActual.grupoId === index}
          >
            Grupo {index + 1}
          </button>
        ))}
      </div>
      {grupoActual && (
        <div>
          <h2>Grupo Actual:</h2>
          <p>Juez: {grupoActual.juez}</p>
          <p>Usuarios: {grupoActual.users.join(", ")}</p>
          <div>
            <h3>Tiempos de los usuarios:</h3>
            {Object.entries(tiemposUsuarios[grupoActual.grupoId] || {}).map(
              ([userId, datos]) => (
                <div key={userId}>
                  <h4>Usuario: {datos.userId}</h4>
                  <ul>
                    {datos.tiempos.map((tiempo, index) => (
                      <li key={index}>{formatTime(tiempo)}</li>
                    ))}
                  </ul>
                  <p>Promedio: {formatTime(datos.promedio)}</p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default YourTournament;
