import { useAuthTorneo } from "../context/TorneoContext";
import { useEffect, useState } from "react";

function TorneoGetPage() {
  const { getTorneos } = useAuthTorneo();
  const [torneos, setTorneos] = useState([]);

  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        const torneosGet = await getTorneos();
        setTorneos(torneosGet);
        console.log(torneosGet);
      } catch (error) {
        // Manejo de errores, por ejemplo:
        console.error('Error al obtener los torneos:', error);
      }
    };
  
    fetchTorneos();
  }, [getTorneos]);

  return (
    <div>
      <h1>Get Torneo</h1>

      <div>
        {torneos.length > 0 ? (
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
                {torneos.map((torneo) => (
                  <tr key={torneo._id}>
                    <td>{torneo.nombre}</td>
                    <td>{torneo.qty_participantes}</td>
                    <td>{torneo.rango}</td>
                    <td>{torneo.premio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default TorneoGetPage;
