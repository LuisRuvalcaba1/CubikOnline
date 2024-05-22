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
  const { user, logout, statusChangeAuth, isAuthenticated, isPrivate } =
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
  }, [user, deleteTorneoByJuez, statusChangeAuth, logout]);

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
            <Switch onChange={handleChange} checked={currentUser.isPrivate}></Switch>
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
