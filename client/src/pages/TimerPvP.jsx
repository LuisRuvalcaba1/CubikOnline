import { useEffect, useState } from "react";
import "./Timer.css";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { useAuthTimerPvP } from "../context/TimerPvPContext";
import { verifyTokenRequest, getUserRequest } from "../api/auth";
import { useObjetives } from "../context/ObjetivesContext";
import Confirmation from "../components/Confirmation";
const URL = import.meta.env.VITE_BACKEND_URL;
import { getRankByUserRequest } from "../api/rank";
import {
  createUserPvPRequest,
  getUserPvPByUserRequest,
  updateUserPvPByIdRequest,
} from "../api/userpvp";

function TimerPvP() {
  const navigate = useNavigate();
  const { user, updateUserPoints } = useAuth();
  const { createTimerPvP, getTimerPvP } = useAuthTimerPvP();
  const [milisegundos, setMilisegundos] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [minutos, setMinutos] = useState(0);
  const [activo, setActivo] = useState(false);
  const [tiempoInicial, setTiempoInicial] = useState(null);
  const [scramble, setScramble] = useState("");
  const [isPaired, setIsPaired] = useState(false);
  const [socket, setSocket] = useState("");
  const [resultado, setResultado] = useState(null);
  const [solicitarRevancha, setSolicitarRevancha] = useState(false);
  const { setResultadoCon } = useAuthTimerPvP();
  const [contrincante, setContrincante] = useState(null);
  const { getObjetivesContext, updateObjetive } = useObjetives();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [revancha, setRevancha] = useState(false);
  const [userPvP, setUserPvP] = useState(null);

  // useEffect(() => {
  //   const fetchUserPvP = async () => {
  //     try {
  //       const { data } = await getUserPvPByUserRequest(currentUser._id);

  //       setUserPvP(data);
  //       console.log("UserPvP:", data)
  //       if (!data) {
  //         const updatedQtyPvP = data.qty_pvp + 1;
  //         await updateUserPvPByIdRequest(data._id, {
  //           qty_pvp: updatedQtyPvP,
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Error fetching userPvP:", error);
  //     }
  //   };

  //   if (currentUser && contrincante) {
  //     fetchUserPvP();
  //   }
  // }, [currentUser, contrincante]);

  useEffect(() => {
    const checkUserRank = async () => {
      try {
        const { data } = await getRankByUserRequest(currentUser._id);
        if (data.length === 0) {
          // El usuario no tiene rango, redirigir a RankingUsers
          navigate("/rankingusers");
        }
      } catch (error) {
        console.error("Error fetching user rank:", error);
      }
    };

    if (currentUser) {
      checkUserRank();
    }
  }, [currentUser, navigate]);

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
    const time = setTimeout(() => {
      if (isPaired) {
        navigate("/profile");
      }
    }, 120000);
    const socket = io(`${URL}/confrontation`);
    setSocket(socket);

    if (!currentUser) return;
    socket.emit("user", currentUser._id);
    console.log("Usuario:", currentUser._id);
    socket.on("paired", () => {
      console.log("Emparejado");
      setIsPaired(true);
    });

    socket.on("contrincante", (contrincante) => {
      console.log(contrincante);
      if (contrincante) {
        const fetchsContrincante = async () => {
          try {
            const { data } = await getUserRequest(contrincante); // Aquí se envía el _id directamente
            console.log(data);
            setContrincante(data);
            console.log("Contrincante:", contrincante);
            socket.emit("contrincante", data._id);
          } catch (error) {
            console.error("Error fetching user:", error);
          }
        };
        fetchsContrincante();
      }
    });

    socket.on("scramble", (scramble) => {
      setScramble(scramble);
    });

    socket.on("message", (tiempoSocket) => {
      console.log(tiempoSocket);
    });

    // socket.on("revancha", (tiempoSocket) => {
    //   console.log(tiempoSocket);
    //   console.log("Revancha")
    //   // Aquí puedes agregar lógica adicional para manejar la revancha si es necesario
    // });

    socket.on("resultado", (data) => {
      console.log(data);
      setResultado(data.ganador);
      setResultadoCon(data.ganador);
      setShowConfirmation(true);
      console.log("Contrincante:", data.loser);
      if (data.ganador) {
        console.log("Ganaste");
        const winner = data.winner; // Aquí se envía el _id como cadena
        const loser = data.loser; // Aquí se envía el _id como cadena
        createTimerPvP(winner, loser);

        // Actualizar objetivo del usuario ganador
        if (currentUser && currentUser._id === winner) {
          const fetchUserPvP = async () => {
            try {
              const { data } = await getUserPvPByUserRequest(currentUser._id);
              setUserPvP(data);
              console.log("UserPvP:", data);
              if (!data) {
                createUserPvPRequest({
                  user: currentUser._id,
                  userPvP: loser,
                  qty_pvp: 0,
                });
              }
            } catch (error) {
              console.error("Error fetching userPvP:", error);
            }
          };
          const actualizarObjetivo = async () => {
            try {
              const objetivosResponse = await getObjetivesContext();
              const objetivos = objetivosResponse.data;
              const objetivoActual = objetivos.find(
                (objetivo) => objetivo.objective === 2
              );

              if (objetivoActual) {
                const nuevoQtyTimes = objetivoActual.qty_times + 1;
                await updateObjetive(objetivoActual._id, {
                  qty_times: nuevoQtyTimes,
                });
                console.log("Objetivo actualizado:", nuevoQtyTimes);
                const newPoints = currentUser.points + 10;
                updateUserPoints(currentUser._id, { points: newPoints })
                  .then((updatedUser) => {
                    setCurrentUser({
                      ...currentUser,
                      points: updatedUser.points,
                    });
                    console.log("Puntos actualizados:", updatedUser.points);
                  })
                  .catch((error) => {
                    console.error("Error al actualizar los puntos:", error);
                  });
              } else {
                console.log("No se encontró el objetivo");
              }
            } catch (error) {
              console.error("Error al actualizar el objetivo:", error);
            }
          };

          actualizarObjetivo();
          fetchUserPvP();
        }
      }
    });

    // Efecto de limpieza para cerrar la conexión al socket cuando el componente se desmonte
    return () => {
      socket.disconnect();
      clearTimeout(time);
    };
  }, [currentUser]);

  useEffect(() => {
    let interval;
    if (activo) {
      interval = setInterval(() => {
        const tiempoActual = performance.now();
        const tiempoTranscurrido = tiempoActual - tiempoInicial;
        const tiempoMilisegundos = Math.floor(tiempoTranscurrido % 1000);
        const tiempoSegundos = Math.floor((tiempoTranscurrido / 1000) % 60);
        const tiempoMinutos = Math.floor(
          (tiempoTranscurrido / (1000 * 60)) % 60
        );

        setMilisegundos(tiempoMilisegundos);
        setSegundos(tiempoSegundos);
        setMinutos(tiempoMinutos);
      }, 1);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [activo, tiempoInicial]);

  function registrarTiempo() {
    if (tiempoInicial && isPaired) {
      const tiempoFinal = performance.now();
      const tiempoTranscurrido = tiempoFinal - tiempoInicial;
      const tiempoMilisegundos = Math.floor(tiempoTranscurrido % 1000);
      const tiempoSegundos = Math.floor((tiempoTranscurrido / 1000) % 60);
      const tiempoMinutos = Math.floor((tiempoTranscurrido / (1000 * 60)) % 60);

      const time = `${tiempoMinutos}:${
        tiempoSegundos < 10 ? "0" : ""
      }${tiempoSegundos}:${
        tiempoMilisegundos < 10 ? "00" : tiempoMilisegundos < 100 ? "0" : ""
      }${tiempoMilisegundos}`;

      if (socket) {
        const message = JSON.stringify({ time: time });
        socket.emit("message", message);
        console.log("Enviado:", message);
      }
    }
  }

  useEffect(() => {
    function handleKeyPress(event) {
      if (event.keyCode === 32) {
        setActivo((prevActivo) => !prevActivo);
        if (!activo) {
          setTiempoInicial(performance.now());
        } else {
          registrarTiempo();
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [activo, socket]); // Agrega 'socket' como dependencia para que el efecto se ejecute cada vez que 'socket' cambie

  return (
    <div className="timer__scramble">
      {isPaired ? (
        <>
          <h1>Emparejado</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {!activo && (
              <p
                className="scramble"
                style={{
                  fontSize: "40px",
                  maxWidth: "60%",
                  wordWrap: "break-word",
                }}
              >
                {scramble}
              </p>
            )}
            <p className="cronometro">
              <p>
                {minutos < 10 ? `0${minutos}` : minutos} :{" "}
                {segundos < 10 ? `0${segundos}` : segundos} :{" "}
                {milisegundos < 10
                  ? `00${milisegundos}`
                  : milisegundos < 100
                  ? `0${milisegundos}`
                  : milisegundos}
              </p>
            </p>
          </div>
          {contrincante && (
            <>
              <p>
                Tu contrincante es:{" "}
                {contrincante.isPrivate ? "UsuarioX" : contrincante.username}
              </p>
              <p>Rango: {contrincante.rank}</p>
            </>
          )}
          <div>
            <p>
              Presiona la barra espaciadora para iniciar y detener el cronómetro
            </p>
          </div>
          <Confirmation
            visible={showConfirmation}
            onClose={() => setShowConfirmation(false)}
          />
        </>
      ) : (
        <h1>Esperando emparejamiento...</h1>
      )}
    </div>
  );
}

export default TimerPvP;
