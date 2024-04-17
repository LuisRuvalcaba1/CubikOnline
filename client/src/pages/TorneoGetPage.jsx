import { useAuthTorneo } from "../context/TorneoContext";
import { useEffect, useState } from "react";

function TorneoGetPage() {
  const { getTorneo } = useAuthTorneo();
  const [torneos, setTorneos] = useState([]);

  useEffect(() => {
    const fetchTorneos = async () => {
      const torneos = await getTorneo();
      setTorneos(torneos);
      console.log(torneos);
    };

    fetchTorneos();
  }, [getTorneo]);

  return (
    <div>
      <h1>Get Torneo</h1>

      <div>
        {torneos.map((torneo) => (
          <div key={torneo._id}>
            <h2>{torneo.nombre}</h2>
            <p>{torneo.qty_participantes}</p>
            <p>{torneo.rango}</p>
            <p>{torneo.premio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TorneoGetPage;
