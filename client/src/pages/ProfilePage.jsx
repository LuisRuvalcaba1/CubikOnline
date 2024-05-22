import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
//import { useForm } from "react-hook-form";
import { removeTokenRequest } from "../api/auth";
import { useAuthTorneo } from "../context/TorneoContext";
import Encuesta from "../components/Encuesta";
import Switch from "react-switch";
import { isPrivateRequest } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { getUserPrivateStatus } from "../api/auth";

import "./Profile.css";

function ProfilePage() {
  const [showModal, setShowModal] = useState(false);
  const { user, logout, statusChangeAuth } = useAuth();
  const { deleteTorneoByJuez } = useAuthTorneo();
  const navigation = useNavigate();
  const handleOnClose = () => setShowModal(false);

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const fetchPrivateStatus = async () => {
      try {
        const { data } = await getUserPrivateStatus(user.email);
        setChecked(data.isPrivate);
      } catch (error) {
        console.error("Error fetching private status:", error);
      }
    };

    fetchPrivateStatus();
  }, [user.email]);

  useEffect(() => {
    const eliminarToken = async () => {
      try {
        const data = {
          email: user.email,
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
      email: user.email,
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
      {user ? (
        <div className="contenedor">
          <p className="texto font-bold text-center">Nombre de usuario</p>
          <p>{user.username}</p>
          <p>Email: {user.lastName}</p>
          <p>ID: {user._id}</p>
          <p>Rango: {user.rank}</p>
          <p>Points: {user.points}</p>
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