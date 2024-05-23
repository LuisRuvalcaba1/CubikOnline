import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
//import { useForm } from "react-hook-form";
import { removeTokenRequest, verifyTokenRequest } from "../api/auth";
import { useAuthTorneo } from "../context/TorneoContext";
import Encuesta from "../components/Encuesta";
import Switch from "react-switch";
import { isPrivateRequest } from "../api/auth";
import { useNavigate } from "react-router-dom";

import "./Profile.css";

function ProfilePage() {
  const [showModal, setShowModal] = useState(false);
  const { user, logout, statusChangeAuth, isAuthenticated } =
    useAuth();
  const { deleteTorneoByJuez } = useAuthTorneo();
  const [currentUser, setCurrentUser] = useState(null);
  const navigation = useNavigate();
  const handleOnClose = () => setShowModal(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await verifyTokenRequest();
        setCurrentUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [user]);

  console.log("User:", isAuthenticated);
  console.log("User:", currentUser);

  const getTimestampFromObjectId = (objectId) => {
    const timestamp = parseInt(objectId.toString().slice(0, 8), 16);
    return new Date(timestamp * 1000);
  };

  useEffect(() => {
    const userCreatedAt = currentUser ? getTimestampFromObjectId(currentUser._id) : null;
    const currentDate = new Date();
    console.log("User created at:", userCreatedAt);
    const diffInDays = Math.floor((currentDate - userCreatedAt) / (1000 * 60 * 60 * 24));
    console.log("Diff in days:", diffInDays);
    if (userCreatedAt && diffInDays >= 1) {
      const remainderDays = diffInDays % 1;
      if (remainderDays === 0) {
        setShowModal(true);
      }
    }
  }, [currentUser]);

  

  useEffect(() => {
    const eliminarToken = async () => {
      try {
        const data = {
          email: currentUser.email,
          status: "inactive",
          role: "user",
        };
        deleteTorneoByJuez(data._id);
        statusChangeAuth(data);
        await logout();
        await removeTokenRequest();
      } catch (error) {
        console.error("Error al eliminar el token:", error);
      }
    };
    const timeoutId = setTimeout(eliminarToken, 21600000);

    return () => clearTimeout(timeoutId);
  }, [currentUser, deleteTorneoByJuez, statusChangeAuth, logout]);

  useEffect(() => {
    if (currentUser) {
      setChecked(currentUser.isPrivate);
    }
  }, [currentUser]);


  const handleChange = (nextChecked) => {
    setChecked(nextChecked);
    const data = {
      email: currentUser.email,
      isPrivate: nextChecked,
    };
    isPrivateRequest(data.email, data.isPrivate);
  };

  const searchFriends = () => {
    navigation("/friends");
  };

  return (
    <div className="contenedor" id="cont">
      <h1 className="titulo font-bold">Perfil</h1>
      {currentUser ? (
        <div className="contenedor">
          <p className="texto font-bold text-center">Nombre de usuario</p>
          <p>{currentUser.username}</p>
          <p>Email: {currentUser.lastName}</p>
          <p>ID: {currentUser._id}</p>
          <p>Rango: {currentUser.rank}</p>
          <p>Points: {currentUser.points}</p>
          <div>
            <p>Perfil privado</p>
            <Switch onChange={handleChange} checked={checked}></Switch>
          </div>

          <button onClick={searchFriends}>Buscar amigos</button>
          <Encuesta onClose={handleOnClose} visible={showModal} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ProfilePage;
