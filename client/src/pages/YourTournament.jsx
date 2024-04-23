import { useEffect, useState } from "react";
import { useAuthTorneo } from "../context/TorneoContext";
import io from 'socket.io-client';

import './Torneo.css';

function YourTournament() {
    const { getTorneoById, deleteTorneo } = useAuthTorneo();
    const [torneo, setTorneo] = useState([]);	
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

    useEffect(() => {
      const socket = io('http://localhost:4000/join');
      socket.emit('juez', JSON.stringify({ id: torneo.juez }));
      // socket.on('n_participantes', (participantes) => {
      //   setTorneo((prevTorneo) => ({ ...prevTorneo, participantes }));
      // });
      return () => {
        socket.disconnect();
      }
    }
    , [torneo]);
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