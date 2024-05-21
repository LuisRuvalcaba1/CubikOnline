import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
//import { useForm } from "react-hook-form";
import { removeTokenRequest } from "../api/auth";
import { useAuthTorneo } from "../context/TorneoContext";
import Encuesta from "../components/Encuesta";
import Switch from "react-switch";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function ProfilePage() {
  const [showModal, setShowModal] = useState(false);
//  const { register, handleSubmit } = useForm();
  const { user, logout, statusChangeAuth } = useAuth();
  const { deleteTorneoByJuez } = useAuthTorneo();
  const navigation = useNavigate();
  const handleOnClose = () => setShowModal(false);

  console.log(user._id);

  const getTimestampFromObjectId = (objectId) => {
    if (objectId) {
      const timestamp = parseInt(objectId.toString().slice(0, 8), 16);
      return new Date(timestamp * 1000);
    }
    return null; 
  };

  useEffect(() => {
    const userCreatedAt = user ? getTimestampFromObjectId(user._id) : null;
    console.log(userCreatedAt);
    const currentDate = new Date();
    const diffInDays = Math.floor(
      (currentDate - userCreatedAt) / (1000 * 60 * 60 * 24)
    );

    if (userCreatedAt && diffInDays >= 2) {
      const remainderDays = diffInDays % 2;
      if (remainderDays === 0) {
        setShowModal(true);
      }
    }
  }, [user]);

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

  // const onSubmit = handleSubmit((data) => {
  //   data.email = user.email;
  //   updateUserPoints(data);
  // });
  const [checked, setChecked] = useState(false);
  const handleChange = (nextChecked) => {
    setChecked(nextChecked);
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
          <p>
            {user.username}
          </p>
          <p>Email:  {user.lastName} </p>
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
