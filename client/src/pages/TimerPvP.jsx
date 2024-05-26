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
  const { setResultadoCon } = useAuthTimerPvP();
  const [contrincante, setContrincante] = useState(null);
  const { getObjetivesContext, updateObjetive } = useObjetives();
  const [showConfirmation, setShowConfirmation] = useState(false);

  // useEffect(() => {
  //   if (user.rank === 0) {
  //     navigate('/rankingusers');
  //   }
  // }, [user, navigate]);

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

  const time = setTimeout(() => {
    if (isPaired) {
      navigate("/profile");
    }
  }, 120000);

  useEffect(() => {
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

    socket.on("resultado", (data) => {
      console.log(data);
      setResultado(data.ganador);
      setResultadoCon(data.ganador);
      setShowConfirmation(true);
      if (data.ganador) {
        console.log("Ganaste");
        const winner = data.winner; // Aquí se envía el _id como cadena
        const loser = data.loser; // Aquí se envía el _id como cadena
        createTimerPvP(winner, loser);

        // Actualizar objetivo del usuario ganador
        if (currentUser && currentUser._id === winner) {
          const actualizarObjetivo = async () => {
            try {
              const objetivosResponse = await getObjetivesContext();
              const objetivos = objetivosResponse.data;
              const objetivoActual = objetivos.find(
                (objetivo) => objetivo.objective === 2 && objetivo.qty_times < 5
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
