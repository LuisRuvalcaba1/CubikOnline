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
import "./Aprendizaje.css";
import { getUserRequest } from "../api/auth";
const URL = import.meta.env.VITE_BACKEND_URL;

Modal.setAppElement("#root");

function YourTournament() {
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
  const [participantUsernames, setParticipantUsernames] = useState({});


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

    if (currentUser && torneo) {
      console.log("Torneo:", torneo);
      socket.emit("juez", {
        juezId: currentUser._id,
        torneoId: torneo._id,
        n_p: torneo.qty_participantes,
        puntos: torneo.premio,
      });
      console.log(
        "Juez conectado:",
        currentUser._id,
        torneo._id,
        torneo.qty_participantes,
        torneo.premio
      );
      socket.emit("unirseGrupo", { juezId: currentUser._id, grupoIndex: 0 });
    }

    socket.on("grupos", async (gruposFormados) => {
      setGrupos(gruposFormados);

      const usernames = {};
      for (const grupo of gruposFormados) {
        const grupoUsernames = {};
        if (grupo.users.length >= 2) {
          try {
            const { data: user1 } = await getUserRequest(grupo.users[0]);
            const { data: user2 } = await getUserRequest(grupo.users[1]);
            grupoUsernames.usuario1 = user1.username;
            grupoUsernames.usuario2 = user2.username;
          } catch (error) {
            console.error("Error al obtener los usuarios:", error);
          }
        }
        usernames[grupo.grupoId] = grupoUsernames;
      }
      setParticipantUsernames(usernames);
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
      setTorneo(location.state.torneo);
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
    <div className="p-4 items-center flex flex-col justify-center max-h-screen mt-4">
    <h1 className="titulo font-bold text-5xl mb-4">Your Tournament</h1>
    <div>
      
      <div className="flex flex-wrap titulo">
        {grupos.map((grupo, index) => (
          <button
            key={index}
            onClick={() => handleGrupoSeleccionado(grupo, index)}
            disabled={grupoActual && grupoActual.grupoId === index}
            className={`${
              grupoActual && grupoActual.grupoId === index
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            } px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50 m-2`}
          >
            Grupo {index + 1}
          </button>
        ))}
      </div>
    </div>
    {grupoActual && (
      <div className="contenedor items-center flex flex-col justify-center max-h-screen mt-4" id="cont">
        <div className="contenedor items-center flex flex-col font-bold">
          <h2 className="titulo">Grupo {grupoActual.grupoId + 1}</h2>
          <p className="text-3xl">Juez: {currentUser.username}</p>
          <h3 className="titulo mt-4">Tiempos de los usuarios:</h3>
          <div className="text items-center titulo mb-4">
            <p>
              Usuario 1: {participantUsernames[grupoActual.grupoId]?.usuario1}
              <br />
              Usuario 2: {participantUsernames[grupoActual.grupoId]?.usuario2}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {Object.entries(tiemposUsuarios[grupoActual.grupoId] || {}).map(([userId, datos], index) => (
              <div key={userId} className="bg-gray-400 shadow-md rounded-lg p-4 w-60">
                <h4 className="texto font-bold">Usuario {index + 1}</h4>
                <div className="text-lg mt-4 mb-4">
                  <ul className="list-disc pl-6 font-bold">
                    {datos.tiempos.map((tiempo, index) => (
                      <li key={index}>{formatTime(tiempo)}</li>
                    ))}
                  </ul>
                </div>
                <p className="texto font-bold mt-2">
                  Promedio: {formatTime(datos.promedio)}
                </p>
              </div>
              
            ))}
            
          </div>
        </div>
      </div>
    )}
  </div>
  );
}

export default YourTournament;
