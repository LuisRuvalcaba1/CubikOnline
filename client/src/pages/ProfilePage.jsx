import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { removeTokenRequest } from "../api/auth";
import { useAuthTorneo } from "../context/TorneoContext";
import Encuesta from "../components/Encuesta";
import moment from "moment";

function ProfilePage() {
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit } = useForm();
  const { user, updateUserPoints, logout, statusChangeAuth, isAuthenticated } =
    useAuth();
  const { deleteTorneoByJuez } = useAuthTorneo();

  const handleOnClose = () => setShowModal(false);

  const getTimestampFromObjectId = (objectId) => {
    const timestamp = parseInt(objectId.toString().slice(0, 8), 16);
    return new Date(timestamp * 1000);
  }
  
  const isUserOlderThanOneMinute = () => {
    if (!user || !user._id) {
      return false;
    }
  
    const userCreatedAt = getTimestampFromObjectId(user._id);
    console.log(userCreatedAt);
    const oneMinuteAgo = moment().subtract(2, 'minutes');
    return moment(userCreatedAt).isBefore(oneMinuteAgo);
  }

  useEffect(() => {
    if (isAuthenticated && isUserOlderThanOneMinute()) {
      setShowModal(true);
    }
  }, [isAuthenticated, user]);

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

  const onSubmit = handleSubmit((data) => {
    data.email = user.email;
    updateUserPoints(data);
  });

  return (
    <div>
      <h1 className="">Perfil</h1>
      {user ? (
        <div>
          <p>Nombre: {user.username}</p>
          <p>Rango: {user.rank}</p>
          <p>Points: {user.points}</p>
            {/*Formulario para sumar puntos al usuario */}
          <form onSubmit={onSubmit}>
            <label htmlFor="points">Añadir Puntos:</label>
            <input
              id="points"
              type="number"
              {...register("points", { required: true })}
            />
            <button type="submit">Actualizar Puntos</button>
          </form>
          <Encuesta onClose={handleOnClose} visible={showModal} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ProfilePage;
