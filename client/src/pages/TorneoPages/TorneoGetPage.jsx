import { useAuthTorneo } from "../../context/TorneoContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";

function TorneoGetPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getTorneos } = useAuthTorneo();
  const [torneos, setTorneos] = useState([]);

  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        const torneosGet = await getTorneos();
        setTorneos(torneosGet);
        console.log(torneosGet);
      } catch (error) {
        console.error('Error al obtener los torneos:', error);
      }
    };

    fetchTorneos();
  }, [getTorneos]);

  const unirseTorneo = (data) => {
    data.torneo = data._id;
    data.user2 = user._id;
    console.log(data);
    navigate('/waitroom', { state: data });
  };

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
                {torneos.length === 0 && (
                  <tr>
                    <td colSpan="4">No hay torneos</td>
                  </tr>
                ) }
                {torneos.map((torneo) => (
                  <tr key={torneo._id}>
                    <td>{torneo.nombre}</td>
                    <td>{torneo.qty_participantes}</td>
                    <td>{torneo.rango}</td>
                    <td>{torneo.premio}</td>
                    <td>
                      <button onClick={() => unirseTorneo(torneo)}>
                        Unirse  
                      </button>
                    </td>
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
