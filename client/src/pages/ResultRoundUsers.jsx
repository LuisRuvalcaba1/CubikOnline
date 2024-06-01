import { useEffect, useState } from "react";
import { useAuthTorneo } from "../context/TorneoContext";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { verifyTokenRequest } from "../api/auth";
const URL = import.meta.env.VITE_BACKEND_URL;

function ResultRoundUsers() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { grupo, participantes } = useLocation().state;
  const { getTorneoById } = useAuthTorneo();
  const [torneo, setTorneo] = useState([]);
  const [socket, setSocket] = useState(null);
  const [resultados, setResultados] = useState([]);
  const [juez2, setJuez2] = useState(null);
  const [tiemposUsuarios, setTiemposUsuarios] = useState({});
  const [tiemposVistos, setTiemposVistos] = useState(false);
  const [ganador, setGanador] = useState(null);
  const [participante, setParticipante] = useState([]);
  const [grupoActual, setGrupoActual] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await verifyTokenRequest();
        setJuez2(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [user]);

  useEffect(() => {
    const fetchTorneo = async () => {
      try {
        const torneo2 = await getTorneoById();
        setTorneo(torneo2);
        setParticipante(torneo2.qty_participantes);
      } catch (error) {
        console.error("Error al obtener el torneo:", error);
      }
    };

    fetchTorneo();
  }, [getTorneoById]);

  useEffect(() => {
    const socket = io(`${URL}/join`);
    setSocket(socket);

    socket.emit("grupo", grupo);
    if (juez2) {
      socket.emit("juez", juez2._id);
      socket.on("grupo", (data) => {
        setGrupoActual(data);
      });
      socket.on("grupoActualizado", (nuevoGrupo) => {
        setGrupoActual(nuevoGrupo); // Actualizar estado local con el nuevo grupo
      });
    }

    socket.on("resultados", (resultados) => {
      setResultados(resultados);
    });

    socket.on("tiemposUsuarios", (tiemposPorGrupo) => {
      const grupoId = grupo.join("-");
      const tiemposGrupo = tiemposPorGrupo[grupoId] || {};

      setTiemposUsuarios(tiemposGrupo);
    });

    socket.on("tiemposVistos", (tiemposGrupo) => {
      setTiemposUsuarios(tiemposGrupo);
    });

    socket.on("ganadorRegistrado", (grupoId) => {
      const grupoIndex = grupo.findIndex((g) => g.join("-") === grupoId);
      const siguienteGrupo = grupo[grupoIndex + 1];

      if (siguienteGrupo) {
        setGrupoActual(siguienteGrupo);
        navigate("/resultroundusers", {
          state: { grupo: siguienteGrupo, grupoActual: siguienteGrupo },
        });
      } else {
        navigate("/yourtournament");
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [grupo, juez2, navigate]);

  const handleTiemposVistos = () => {
    setTiemposVistos(true);
    socket.emit("tiemposVistos", grupo);
  };

  const handleMarcarGanador = (userId) => {
    setGanador(userId);
    socket.emit("marcarGanador", { grupo: grupoActual, ganador: userId });
  };
  
  return (
    <>
     <div>
        <h2>Tiempos de los usuarios:</h2>
        {Object.entries(tiemposUsuarios).map(([userId, tiempos]) => (
          <div key={userId}>
            <h3>Usuario: {userId}</h3>
            <p>Tiempos: {tiempos.join(", ")}</p>
            <p>Promedio: {tiempos.reduce((a, b) => a + b, 0) / tiempos.length}</p>
            <button onClick={() => handleMarcarGanador(userId)} disabled={ganador}>
              Marcar como ganador
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
export default ResultRoundUsers;
