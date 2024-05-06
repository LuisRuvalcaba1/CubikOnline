import { useEffect, useState } from "react";
import { useAuthTorneo } from "../context/TorneoContext";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import "./Torneo.css";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

Modal.setAppElement("#root");

function YourTournament() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getTorneoById, deleteTorneo } = useAuthTorneo();
  const { participantes } = useLocation().state;
  const [torneo, setTorneo] = useState([]);
  const [socket, setSocket] = useState(null);
  const [juez, setJuez] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setJuez(user._id);
  }, [user]);

  useEffect(() => {
    const socket = io("http://localhost:4000/join");
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

    navigate("/resultroundusers", { state: { grupo: data } })
  }

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
