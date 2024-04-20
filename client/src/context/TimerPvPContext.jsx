import { createContext, useState, useContext } from "react";
export const TimerPvPContext = createContext();
import { timerPvPRequest as timerPvPRequestFunction } from "../api/timerpvp.js";

// Crea el contexto
export const useAuthTimerPvP = () => {
  const context = useContext(TimerPvPContext);
  if (!context) {
    throw new Error(
      "useAuthTimerPvP debe ser usado dentro de un TimerPvPProvider"
    );
  }
  return context;
};

// Crea el proveedor del contexto
export const TimerPvPProvider = ({ children }) => {
  const [timerPvPs, setTimerPvPs] = useState([]);
  const [resultadoTimerPvP, setResultadoTimerPvP] = useState(null);

  const createTimerPvP = async (winner, loser) => {
    try {
      const newTimerPvP = await timerPvPRequestFunction({
        winner: winner.id,
        loser: loser.id,
      });
      if (newTimerPvP.status === 201) {
        setTimerPvPs([...timerPvPs, newTimerPvP.data]);
      }
    } catch (error) {
      console.error("Error al crear TimerPvP:", error);
    }
  };

  const setResultadoCon = (resultado) => {
    setResultadoTimerPvP(resultado);
  };

  const contextValue = {
    resultadoTimerPvP,
    setResultadoCon,
    createTimerPvP,
  };

  return (
    <TimerPvPContext.Provider value={contextValue}>
      {children}
    </TimerPvPContext.Provider>
  );
};
