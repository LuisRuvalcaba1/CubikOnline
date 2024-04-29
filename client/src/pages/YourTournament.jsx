import { useEffect, useState } from "react";
import { useAuthTorneo } from "../context/TorneoContext";
import io from 'socket.io-client';
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import './Torneo.css';

function YourTournament() {
    const { user } = useAuth();
    const { getTorneoById, deleteTorneo } = useAuthTorneo();
    const { participantes } = useLocation().state;
    const [torneo, setTorneo] = useState([]);
    const [socket, setSocket] = useState(null);
    const [juez , setJuez] = useState(null);
    const [usuariosConectados, setUsuariosConectados] = useState([]); // Estado para almacenar usuarios conectados

    useEffect(() => {
      setJuez(user._id);
    }, [user]);

    useEffect(() => {
      const socket = io('http://localhost:4000/join');
      setSocket(socket);
      socket.emit('juez', user._id);
      socket.emit('n_participantes', participantes);

      return () => {
        socket.disconnect();
      }
    }, [user, participantes]);

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
          {torneo.length > 0 ? (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Participantes</th>
                    <th>Rango</th>
                    <th>Premio</th>
                  </tr>
                </thead>
                <tbody>
                  {torneo.map((torneo) => (
                    <><tr key={torneo._id}>
                      <td>{torneo.nombre}</td>
                      <td>{torneo.qty_participantes}</td>
                      <td>{torneo.rango}</td>
                      <td>{torneo.premio}</td>
                    </tr><button onClick={() => deleteTorneo(torneo._id)}>Delete</button></>

                  ))}
                </tbody>
              </table>

              <h2>Usuarios conectados:</h2>              
            </div>
          ) : (
            <p>Loading...</p>
          )
          }
        </div>
    </div>
  );
}

export default YourTournament;