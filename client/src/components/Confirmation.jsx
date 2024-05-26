import { Link } from "react-router-dom";
import { useAuthTimerPvP } from "../context/TimerPvPContext";
import "./Confirmation.css";

export default function Confirmation({ visible, onClose }) {
  const { resultadoTimerPvP } = useAuthTimerPvP();
  if (!visible) return null;
  const refreshPage = () => {
    window.location.reload();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-black">Resultado</h1>
        <div className="text-2xl font-bold mb-4 text-black">
          {resultadoTimerPvP !== null && (
            <p>
              {resultadoTimerPvP
                ? "¡Felicidades! Ganaste el duelo."
                : "Lo siento, perdiste el duelo."}
            </p>
          )}
          <p className="text-2xl font-bold mb-4 text-black">¿Deseas buscar otra confrontación?</p>
          <div className="confirmation-buttons">
            <button onClick={refreshPage}  className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-300">
              Sí
            </button>
            <Link to="/" className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-300">
              No
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
