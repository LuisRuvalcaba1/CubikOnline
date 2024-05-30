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
  const { grupo, grupoActual, participantes } = useLocation().state;
  const { getTorneoById } = useAuthTorneo();
  const [torneo, setTorneo] = useState([]);
  const [socket, setSocket] = useState(null);
  const [resultados, setResultados] = useState([]);
  const [juez2, setJuez2] = useState(null);
  const [tiemposUsuarios, setTiemposUsuarios] = useState({});
  const [tiemposVistos, setTiemposVistos] = useState(false);
  const [ganador, setGanador] = useState(null);
  const [participante, setParticipante] = useState([]);
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
        const torneo = await getTorneoById();
        setTorneo(torneo);
        setParticipante(torneo.qty_participantes);
        console.log(torneo);
        console.log("Participantes:", participantes);
      } catch (error) {
        console.error("Error al obtener el torneo:", error);
      }
    };

    fetchTorneo();
  });

  useEffect(() => {
    const socket = io(`${URL}/join`);
    setSocket(socket);

    socket.emit("grupo", grupo);
    socket.emit("juez", juez2);

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
      // Aquí puedes agregar la lógica para permitir el registro de los tiempos
    });

    socket.on("ganadorRegistrado", (grupoId) => {
      const grupoIndex = grupo.findIndex((g) => g.join("-") === grupoId);
      const siguienteGrupo = grupo[grupoIndex + 1];

      if (siguienteGrupo) {
        setGrupoActual(siguienteGrupo);
        navigate("/resultroundusers", { state: { grupo: siguienteGrupo, grupoActual: siguienteGrupo } });
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
    <div>
      <h1>ResultRoundUsers</h1>
      <div>
        <h2>Tiempos de los usuarios:</h2>
        {Object.entries(tiemposUsuarios).map(([usuario, datosUsuario]) => (
          <div key={usuario}>
            <h3>{datosUsuario.userId}</h3>
            <ul>
              {datosUsuario.tiempos.map((tiempo, index) => (
                <li key={index}>{tiempo}</li>
              ))}
            </ul>
            <button onClick={() => handleMarcarGanador(datosUsuario.userId)} disabled={ganador !== null}>
              {ganador === datosUsuario.userId ? "Ganador" : "Marcar como ganador"}
            </button>
          </div>
        ))}
      </div>
      <button onClick={handleTiemposVistos} disabled={tiemposVistos}>
        {tiemposVistos ? "Tiempos vistos" : "Ver tiempos"}
      </button>
    </div>
  );
}
export default ResultRoundUsers;
