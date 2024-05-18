import { useEffect, useState } from "react";
import { useAuthTorneo } from "../context/TorneoContext";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import "./Torneo.css";
import { removeTokenRequest } from "../api/auth";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
const URL = import.meta.env.VITE_BACKEND_URL

Modal.setAppElement("#root");

function YourTournament() {
  const navigate = useNavigate();
  const { getTorneoById, deleteTorneo } = useAuthTorneo();
  const { participantes } = useLocation().state;
  const [torneo, setTorneo] = useState([]);
  const [socket, setSocket] = useState(null);
  const [juez, setJuez] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const { user, logout, statusChangeAuth } = useAuth();
  const { deleteTorneoByJuez } = useAuthTorneo();

  useEffect(() => {
    const eliminarToken = async () => {
      try {
        const data = {
          email: user.email,
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
  }, [user, deleteTorneoByJuez, statusChangeAuth, logout]);

  useEffect(() => {
    setJuez(user._id);
  }, [user]);

  useEffect(() => {
    const socket = io(`${URL}/join`);
    setSocket(socket);
    socket.emit("juez", user._id);
    socket.emit("n_participantes", participantes);

    socket.on("grupos", (gruposFormados) => {
      setGrupos(gruposFormados);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, participantes]);

  const onSubmit = (data) => {
    setGrupoSeleccionado(data);

    navigate("/resultroundusers", { state: { grupo: data } });
  };

  useEffect(() => {
    const fetchTorneo = async () => {
      try {
        const torneo = await getTorneoById();
        setTorneo(torneo);
        console.log(torneo);
      } catch (error) {
        console.error("Error al obtener el torneo:", error);
      }
    };

    fetchTorneo();
  }, [getTorneoById]);

  return (
    <div>
      <h1>Your Tournament</h1>
      <div>
        <h2>Grupos formados:</h2>
        {grupos.map((grupo, index) => (
          <button key={index} onClick={() => onSubmit(grupo)}>
            Grupo {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default YourTournament;
