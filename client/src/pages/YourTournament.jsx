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
import { set } from "mongoose";
const URL = import.meta.env.VITE_BACKEND_URL

Modal.setAppElement("#root");

function YourTournament() {
  const navigate = useNavigate();
  const { getTorneoById, deleteTorneo } = useAuthTorneo();
  const { participantes } = useLocation().state;
  const [torneo, setTorneo] = useState([]);
  const [socket, setSocket] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const { user, logout, statusChangeAuth } = useAuth();
  const { deleteTorneoByJuez } = useAuthTorneo();
  const [currentUser, setCurrentUser] = useState(null);

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
    if(currentUser) {
      socket.emit("juez", currentUser._id);    
      socket.emit("n_participantes", participantes);
    }

    socket.on("grupos", (gruposFormados) => {
      setGrupos(gruposFormados);
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser, participantes]);

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
