import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
const TorneoContext = createContext();
import {
  createTorneoRequest,
  deleteTorneoByIdRequest,
  getTorneoByIdRequest,
  getTorneosRequest,
  deleteTorneoByJuezRequest,
} from "../api/torneo.js";

export const useAuthTorneo = () => {
  const context = useContext(TorneoContext);
  if (!context) {
    throw new Error("useAuthTorneo debe ser usado dentro de un TorneoProvider");
  }
  return context;
};

export const TorneoProvider = ({ children }) => {
  const [torneos, setTorneos] = useState(null);

  const getTorneos = async () => {
    try {
    
        const res = await getTorneosRequest();
        return res.data;
      
    } catch (error) {
      console.error("Error al obtener torneos:", error);
    }
  };

  const getTorneoById = async () => {
    try {
      
        const torneo = await getTorneoByIdRequest();
        return torneo.data;
      
    } catch (error) {
      console.error("Error al obtener torneo por id:", error);
    }
  };

  const createTorneo = async (user, torneo) => {
    try {
      const newTorneo = await createTorneoRequest(user, torneo);
      setTorneos(newTorneo.data);
      console.log(newTorneo.data);
    } catch (error) {
      console.error("Error al crear torneo:", error);
    }
  };

  const deleteTorneo = async (id) => {
    try {
      const res = await deleteTorneoByIdRequest(id);
      console.log(res);
    } catch (error) {
      console.error("Error al borrar torneo:", error);
    }
  };

  const deleteTorneoByJuez = async () => {
    try {
      const res = await deleteTorneoByJuezRequest();
      console.log(res);
    } catch (error) {
      console.error("Error al borrar torneo por juez:", error);
    }
  };

  const value = {
    torneos,
    getTorneos,
    getTorneoById,
    createTorneo,
    deleteTorneoByJuez,
    deleteTorneo,
  };

  return (
    <TorneoContext.Provider value={value}>{children}</TorneoContext.Provider>
  );
};
