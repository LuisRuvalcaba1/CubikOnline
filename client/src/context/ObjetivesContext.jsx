import { createContext, useContext } from "react";
export const ObjetiveContext = createContext();
import {
  getObjetivesRequest,
  createObjetiveRequest,
  getObjetiveRequest,
  updateObjetiveRequest,
  deleteObjetiveRequest,
} from "../api/objetives.js";
import { useState } from "react";

export const useObjetives = () => {
    const context = useContext(ObjetiveContext);
    if(!context){
        throw new Error("useObjetives must be used within an ObjetiveProvider");
    }
    return context;
};

export const ObjetiveProvider = ({ children }) => {
    const [objetivo, setObjetivo] = useState(null);

    const getObjetivesContext = async () => {
        try {
            const response = await getObjetivesRequest();
            return response;
        } catch (error) {
            throw new Error(`Error fetching objetives: ${error.message}`);
        }
    };

    const createNewObjetive = async (objective) => {
        try {
            const response = await createObjetiveRequest(objective);
            setObjetivo(response.data);
        } catch (error) {
            console.error("Error creating objetive:", error);
        }
    };

    const getObjetiveById = async (id
        ) => {
        try {
            const response = await getObjetiveRequest(id);
            return response;
        } catch (error) {
            throw new Error(`Error fetching objetive: ${error.message}`);
        }
    };

    const updateObjetive = async (id, objetive) => {
        try {
            const response = await updateObjetiveRequest(id, objetive);
            console.log(response);
        } catch (error) {
            console.error("Error updating objetive:", error);
        }
    };

    const deleteObjetive = async (id) => {
        try {
            const response = await deleteObjetiveRequest(id);
            console.log(response);
        } catch (error) {
            console.error("Error deleting objetive:", error);
        }
    };

    const value = {
        createNewObjetive,
        getObjetivesContext,
        getObjetiveById,
        updateObjetive,
        deleteObjetive,
        objetivo,
    };

    return (
        <ObjetiveContext.Provider value={value}>
            {children}
        </ObjetiveContext.Provider>
    );
}


