import { useEffect, useState } from "react";
import { useAuthTorneo } from "../context/TorneoContext";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';
import { useAuth } from "../context/AuthContext";

function ResultRoundUsers() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { grupo } = useLocation().state;
    const { getTorneoById } = useAuthTorneo();
    const [torneo, setTorneo] = useState([]);
    const [socket, setSocket] = useState(null);
    const [resultados, setResultados] = useState([]);
    const [resultadosGrupo, setResultadosGrupo] = useState([]);
    const [resultadosGrupoFinal, setResultadosGrupoFinal] = useState([]);
    const [resultadosFinal, setResultadosFinal] = useState([]);
    const [tiempos, setTiempos] = useState({});
    const [juez2, setJuez2] = useState(null);
    const [tiemposUsuarios, setTiemposUsuarios] = useState({});
  
    useEffect(() => {
      setJuez2(user._id);
    }, [user]);
  
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
    });
  
    useEffect(() => {
      const socket = io("http://localhost:4000/join");
      setSocket(socket);
  
      socket.emit("grupo", grupo);
      socket.emit("juez", juez2);
  
      socket.on("resultados", (resultados) => {
        setResultados(resultados);
      });
  
      // Escuchar el evento "tiemposUsuarios"
      socket.on("tiemposUsuarios", (tiempos) => {
        setTiemposUsuarios(tiempos);
      });
  
      return () => {
        socket.disconnect();
      };
    }, [grupo, juez2]);
  
    return (
      <div>
        <h1>ResultRoundUsers</h1>
        <div>
          <h2>Tiempos de los usuarios:</h2>
          {Object.entries(tiemposUsuarios).map(([usuario, tiempos]) => (
            <div key={usuario}>
              <h3>{usuario}</h3>
              <ul>
                {tiempos.map((tiempo, index) => (
                  <li key={index}>{tiempo}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default ResultRoundUsers;