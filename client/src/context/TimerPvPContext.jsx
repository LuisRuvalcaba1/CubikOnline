import { createContext, useState, useContext } from "react";
export const TimerPvPContext = createContext();
import { timerPvPRequest as timerPvPRequestFunction ,
  getTimerPvPRequest,
  updateTimerPvPByIdRequest,
 } from "../api/timerpvp.js";

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
  const [contrincante, setContrincante] = useState(null); // Nuevo estado para el contrincante


  const createTimerPvP = async (winner, loser) => {
    try {
      const response = await timerPvPRequestFunction(winner, loser);
      console.log(response.data);
    } catch (error) {
      console.error('Error al crear TimerPvP:', error.response.data);
      // Manejo del error
    }
  };

  const getTimerPvP = async () => {
    try {
      const response = await getTimerPvPRequest();
      setTimerPvPs(response.data);
      return response;
    } catch (error) {
      console.error("Error fetching TimerPvP:", error);
    }
  }

  const updateTimerPvPById = async (id, timerPvP) => {
    try {
      const response = await updateTimerPvPByIdRequest(id, timerPvP);
      console.log(response);
    } catch (error) {
      console.error("Error updating TimerPvP:", error);
    }
  }

  const setResultadoCon = (resultado) => {
    setResultadoTimerPvP(resultado);
  };

  

  const contextValue = {
    resultadoTimerPvP,
    setResultadoCon,
    createTimerPvP,
    getTimerPvP,
    updateTimerPvPById,
    setContrincante,
    contrincante,
  };

  return (
    <TimerPvPContext.Provider value={contextValue}>
      {children}
    </TimerPvPContext.Provider>
  );
};
