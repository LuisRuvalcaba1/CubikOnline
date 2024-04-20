import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import { useAuthTimerPvP } from "../context/TimerPvPContext";
import "./Confirmation.css";

function Confirmation() {
  const { resultadoTimerPvP } = useAuthTimerPvP();

  const [resultado, setResultado] = useState(null);
  const [socket, setSocket] = useState("");

  function mostrarResultado() {
    if (resultado !== null) {
      if (resultado) {
        return <p>¡Felicidades! Ganaste el duelo.</p>;
      } else {
        return <p>Lo siento, perdiste el duelo.</p>;
      }
    }
    return null;
  }

  return (
    <div className="confirmation-container">
    <div className="confirmation-header">
      <h1>¿Empezamos?</h1>
    </div>
    <div className="confirmation-content">
        {resultadoTimerPvP !== null && (
          <p>{resultadoTimerPvP ? "¡Felicidades! Ganaste el duelo." : "Lo siento, perdiste el duelo."}</p>
        )}
        <p>¿Deseas buscar otra confrontación?</p>
        <div className="confirmation-buttons">
          <Link to="/timerpvp" className="confirmation-button">
            Sí
          </Link>
        
      
          <Link to="/" className="confirmation-button">
            No
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Confirmation;
