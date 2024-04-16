import { useEffect } from "react";
import { useAuthTorneo } from "../context/TorneoContext";
import './Torneo.css';

function YourTournament() {
    const { torneos } = useAuthTorneo();

    useEffect(() => {
        console.log(torneos);
    }, [torneos]);

  return (
    <div>
      <h1>Your Tournament</h1>

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

export default YourTournament;