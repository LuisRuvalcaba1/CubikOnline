import { createContext, useState, useContext, useEffect } from "react";
import {

  getFriendsRequest,
  getYourFriendsRequest,
  
} from "../api/amigos.js";

export const AmigosContext = createContext();

export const useAmigos = () => {
  const context = useContext(AmigosContext);
  if (!context) {
    throw new Error("useAmigos must be used within an AmigosProvider");
  }
  return context;
};

export const AmigosProvider = ({ children }) => {

  const getFriends = async () => {
    try {
      const res = await getFriendsRequest();
      console.log(res.data);
      return res.data; // Asegúrate de devolver solo los datos, no el objeto completo de respuesta
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const yourFriends = async () => {
    try {
      const res = await getYourFriendsRequest();
      console.log(res.data);
      return res.data; // Asegúrate de devolver solo los datos, no el objeto completo de respuesta
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  const value = {
    getFriends,
    yourFriends,
  };

  return (
    <AmigosContext.Provider value={{ value }}>
      {children}
    </AmigosContext.Provider>
  );
};
