import { createContext, useState, useContext, useEffect } from "react";
import {
  addFriendRequest,
  getFriendsRequest,
  acceptFriendRequest,
  denyFriendRequest,
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

  // const handleAcceptFriend = async (friendshipId) => {
  //     try {
  //         await acceptFriendRequest(friendshipId);
  //         const updatedFriendRequests = await getFriendsRequest(user._id);
  //         setFriendRequests(updatedFriendRequests);
  //     } catch (error) {
  //         console.error("Error al aceptar solicitud de amistad:", error);
  //     }
  // };

  // const handleDenyFriend = async (friendshipId) => {
  //     try {
  //         await denyFriendRequest(friendshipId);
  //         const updatedFriendRequests = await getFriendsRequest(user._id);
  //         setFriendRequests(updatedFriendRequests);
  //     } catch (error) {
  //         console.error("Error al rechazar solicitud de amistad:", error);
  //     }
  // };

  const value = {
    getFriends,
    // handleAcceptFriend,
    // handleDenyFriend,
  };
  
  return (
    <AmigosContext.Provider value={{ value }}>
      {children}
    </AmigosContext.Provider>
  );
};
