import { createContext, useState, useContext, useEffect } from "react";
import {
  getEncuestasRequest,
  getEncuestaRequest,
  createEncuestaRequest,
  updateEncuestaRequest,
  deleteEncuestaRequest,
} from "../api/encuestas.js";   

export const EncuestaContext = createContext();

export const useEncuesta = () => {
    const context = useContext(EncuestaContext);
    if (!context) {
        throw new Error("useEncuesta must be used within an EncuestaProvider");
    }
    return context;
    }   

export const EncuestaProvider = ({ children }) => {

    const getEncuestas = async () => {
        try {
            const res = await getEncuestasRequest();
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const getEncuesta = async (id) => {
        try {
            const res = await getEncuestaRequest(id);
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const createEncuesta = async (encuesta) => {
        try {
            const res = await createEncuestaRequest(encuesta);
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const updateEncuesta = async (id, encuesta) => {
        try {
            const res = await updateEncuestaRequest(id, encuesta);
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const deleteEncuesta = async (id) => {
        try {
            const res = await deleteEncuestaRequest(id);
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const value = {
        getEncuestas,
        getEncuesta,
        createEncuesta,
        updateEncuesta,
        deleteEncuesta,
    };

    return (
        <EncuestaContext.Provider value={{ value }}>
            {children}
        </EncuestaContext.Provider>
    );
};

