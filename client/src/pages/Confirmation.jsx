import { Link } from "react-router-dom";
import { useAuthTimerPvP } from "../context/TimerPvPContext";
import "./Confirmation.css";

function Confirmation() {
  const { resultadoTimerPvP } = useAuthTimerPvP();

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
