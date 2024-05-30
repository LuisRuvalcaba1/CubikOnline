import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { removeTokenRequest, verifyTokenRequest } from "../api/auth";
import { useAuthTorneo } from "../context/TorneoContext";
import Encuesta from "../components/Encuesta";
import Switch from "react-switch";
import { isPrivateRequest } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useEncuesta } from "../context/EncuestaContext";
import { useObjetives } from "../context/ObjetivesContext";
import { getYourFriendsRequest } from "../api/amigos.js";
import "./Profile.css";
import { getUserRequest } from "../api/auth";

function ProfilePage() {
  const [showModal, setShowModal] = useState(false);
  const { user, logout, statusChangeAuth } = useAuth();
  const { deleteTorneoByJuez } = useAuthTorneo();
  const { value } = useEncuesta();
  const [currentUser, setCurrentUser] = useState(null);
  const navigation = useNavigate();
  const handleOnClose = () => setShowModal(false);
  const [checked, setChecked] = useState(false);
  const { getEncuestas } = value;
  const [userEncuestas, setUserEncuestas] = useState([]);
  const [userObjetives, setUserObjetives] = useState([]);
  const { getObjetivesContext, createNewObjetive } = useObjetives();
  const [infoUsuario, setInfoUsuario] = useState(null);
  //const { value } = useAmigos();
  const [yourFriends, setYourFriends] = useState([]);

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

  useEffect(() => {
    const fetchObjetivos = async () => {
      try {
        const [objetivoResponse] = await Promise.all([getObjetivesContext()]);
        const objetivo = objetivoResponse.data;
        setUserObjetives(objetivo);
        console.log("Objetivos del usuario:", objetivo);

        if (objetivo.length === 0) {
          const data = {
            objective: 1,
            qty_times: 0,
          };

          const data2 = {
            objective: 2,
            qty_times: 0,
          };

          const data3 = {
            objective: 3,
            qty_times: 0,
          };

          const data4 = {
            objective: 4,
            qty_times: 0,
          };

          const data5 = {
            objective: 5,
            qty_times: 0,
          };

          const data6 = {
            objective: 6,
            qty_times: 0,
          };

          createNewObjetive(data);
          createNewObjetive(data2);
          createNewObjetive(data3);
          createNewObjetive(data4);
          createNewObjetive(data5);
          createNewObjetive(data6);
        }
      } catch (error) {
        console.error("Error fetching objetives:", error);
      }
    };
    fetchObjetivos();
  }, [getObjetivesContext]);

  useEffect(() => {
    const fetchYourFriends = async () => {
      try {
        const { data } = await getYourFriendsRequest();
        setYourFriends(data);
        console.log("Amigos obtenidos:", data);
        console.log(
          "Amigos obtenidos:",
          yourFriends.map((friend) => friend.username)
        );
      } catch (error) {
        console.error("Error al obtener tus amigos:", error);
      }
    };

    fetchYourFriends();
  }, []);

  useEffect(() => {
    const fetchUserEncuestas = async () => {
      if (currentUser) {
        try {
          const encuestas = await getEncuestas();
          const userEncuestas = encuestas.filter(
            (encuesta) => encuesta.user === currentUser._id
          );
          setUserEncuestas(userEncuestas);
          console.log("Encuestas del usuario:", userEncuestas);
        } catch (error) {
          console.error("Error fetching user encuestas:", error);
        }
      }
    };
    fetchUserEncuestas();
  }, [currentUser, getEncuestas]);

  const getTimestampFromObjectId = (objectId) => {
    const timestamp = parseInt(objectId.toString().slice(0, 8), 16);
    return new Date(timestamp * 1000);
  };

  useEffect(() => {
    const userCreatedAt = currentUser
      ? getTimestampFromObjectId(currentUser._id)
      : null;
    const currentDate = new Date();
    const diffInDays = Math.floor(
      (currentDate - userCreatedAt) / (1000 * 60 * 60 * 24)
    );
    console.log("Diferencia en días:", diffInDays);

    if (userCreatedAt && diffInDays >= 4) {
      const remainderDays = diffInDays % 4;
      if (remainderDays === 0) {
        // Verificar si el usuario ya tiene una encuesta registrada
        const hasUserEncuesta = userEncuestas.length > 0;
        setShowModal(!hasUserEncuesta);
      }
    }
  }, [currentUser, userEncuestas]);

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

  const infoUser = (e) => {
    const username = e.target.innerText;
    yourFriends.map((friend) => {
      if (friend.username === username) {
        setInfoUsuario(friend);
        const fetchAmigo = async () => {
          try {
            const { data } = await getUserRequest(friend._id);
            console.log("Usuario completo:", data);
            setInfoUsuario(data);
          } catch (error) {
            console.error("Error al obtener el usuario:", error);
          }
        };
        fetchAmigo();
      }
    });
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
          <Encuesta
            onClose={handleOnClose}
            visible={showModal}
            userEncuestas={userEncuestas}
          />

          <div>
            <h2>Tus amigos</h2>
            {yourFriends.length > 0 ? (
              <ul>
                {yourFriends.map((friend) => (
                  <li onClick={infoUser} key={friend._id}>
                    {friend.username}
                  </li>
                ))}
                {console.log("Amigos obtenidos:", yourFriends.length)}
              </ul>
            ) : (
              <p>No tienes amigos aún.</p>
            )}
          </div>
          {infoUsuario !== null && (
            <div>
              <p>Nombre de usuario: {infoUsuario.username}</p>
              <p>Email: {infoUsuario.email}</p>
              <p>Rango: {infoUsuario.rank}</p>
              <p>Points: {infoUsuario.points}</p>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ProfilePage;
