import { createContext, useState, useContext } from "react";
const TorneoContext = createContext();
import {createTorneoRequest, deleteTorneoByIdRequest, getTorneoByIdRequest, getTorneosRequest, updateTorneoByIdRequest} from "../api/torneo.js";

export const useAuthTorneo = () => {
    const context = useContext(TorneoContext);
    if (!context) {
        throw new Error(
        "useAuthTorneo debe ser usado dentro de un TorneoProvider"
        );
    }
    return context;
    }
export const TorneoProvider = ({ children }) => {
    const [torneos, setTorneos] = useState([]);

    const getTorneos = async () => {
        try {
        const torneos = await getTorneosRequest();
        setTorneos(torneos.data);
        } catch (error) {
        console.error("Error al obtener torneos:", error);
        }
    };

    const getTorneoById = async (id) => {
        try {
        const torneo = await getTorneoByIdRequest(id);
        return torneo.data;
        } catch (error) {
        console.error("Error al obtener torneo por id:", error);
        }
    };

    const createTorneo = async (torneo) => {
        try {
        const newTorneo = await createTorneoRequest(torneo);
        if (newTorneo.status === 201) {
            setTorneos([...torneos, newTorneo.data]);
        }
        } catch (error) {
        console.error("Error al crear torneo:", error);
        }
    };

    const updateTorneoById = async (id, torneo) => {
        try {
        const updatedTorneo = await updateTorneoByIdRequest(id, torneo);
        if (updatedTorneo.status === 200) {
            const updatedTorneos = torneos.map((torneo) =>
            torneo.id === id ? updatedTorneo.data : torneo
            );
            setTorneos(updatedTorneos);
        }
        } catch (error) {
        console.error("Error al actualizar torneo por id:", error);
        }
    };

    const deleteTorneoById = async (id) => {
        try {
        const deletedTorneo = await deleteTorneoByIdRequest(id);
        if (deletedTorneo.status === 200) {
            const filteredTorneos = torneos.filter((torneo) => torneo.id !== id);
            setTorneos(filteredTorneos);
        }
        } catch (error) {
        console.error("Error al eliminar torneo por id:", error);
        }
    };

    const value = {
        torneos,
        getTorneos,
        getTorneoById,
        createTorneo,
        updateTorneoById,
        deleteTorneoById,
    };

    return (
        <TorneoContext.Provider value={value}>
        {children}
        </TorneoContext.Provider>
    );
}