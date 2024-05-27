import { Link } from "react-router-dom";
import { useAuthTimerPvP } from "../context/TimerPvPContext";
import { useState, useEffect } from "react";
import "./Confirmation.css";
import io from "socket.io-client";
const URL = import.meta.env.VITE_BACKEND_URL;

export default function Confirmation({ visible, onClose, handleRevanchaClick }) {
  const { resultadoTimerPvP } = useAuthTimerPvP();
  const [showRevanchaModal, setShowRevanchaModal] = useState(false);
  const [socket, setSocket] = useState(null);

  const solicitarRevancha = () => {
    if (socket) {
      socket.emit("solicitarRevancha");
      setShowRevanchaModal(true);
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    const newSocket = io(`${URL}/confrontation`);
    setSocket(newSocket);
  
    // Lógica para manejar la respuesta del contrincante
    newSocket.on("respuestaRevancha", (respuesta) => {
      if (respuesta) {
        // El contrincante aceptó la revancha
        handleRevanchaClick();
      } else {
        // El contrincante rechazó la revancha
        setShowRevanchaModal(false);
      }
    });
  
    return () => {
      newSocket.disconnect();
    };
  }, []);

  if (!visible) return;
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
          <p className="text-2xl font-bold mb-4 text-black">
            ¿Deseas buscar otra confrontación?
          </p>
          <div className="confirmation-buttons">
            <button
              onClick={refreshPage}
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-300"
            >
              Sí
            </button>
            <button
              onClick={solicitarRevancha}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300"
            >
              Revancha
            </button>
            <Link
              to="/"
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-300"
            >
              No
            </Link>
          </div>
        </div>
        {showRevanchaModal && (
          <div className="text-2xl font-bold mb-4 text-black">
            <p>Esperando respuesta del contrincante...</p>
          </div>
        )}
      </div>
    </div>
  );
}