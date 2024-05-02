import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useAuthTorneo } from "../context/TorneoContext";
import { useLocation } from "react-router-dom";

function WaitRoom() {
  const { user } = useAuth();
  const { user2, torneo } = useLocation().state;
  const { getTorneoById } = useAuthTorneo();
  const [usuario, setUsuario] = useState("");
  const [solveCount, setSolveCount] = useState(0);
  const [isPaired, setIsPaired] = useState(false);
  const [milisegundos, setMilisegundos] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [minutos, setMinutos] = useState(0);
  const [activo, setActivo] = useState(false);
  const [tiempoInicial, setTiempoInicial] = useState(null);
  const [scramble, setScramble] = useState("");
  const [socket, setSocket] = useState("");
  const [resultado, setResultado] = useState(null);
  const [ganador, setGanador] = useState(null);
  const [tiempos, setTiempos] = useState({});

  useEffect(() => {
    setUsuario(user2);
  }, [user2]);

  useEffect(() => {
    const fetchTorneo = async () => {
      try {
        const torneo = await getTorneoById();
        console.log(torneo);
      } catch (error) {
        console.error("Error al obtener el torneo:", error);
      }
    };

    fetchTorneo();
  }, [getTorneoById]);

  useEffect(() => {
    const socket = io("http://localhost:4000/join");
    setSocket(socket);

    socket.emit("user", user2);
    socket.on("user", (user) => {
      setUsuario(user);
    });

    socket.on("paired", () => {
      setIsPaired(true);
    });

    socket.on("scramble", (nuevoScramble) => {
      setScramble(nuevoScramble);
    });

    socket.on("resultado", (data) => {
      setResultado(
        `${data.ganador ? "Ganaste" : "Perdiste"} con un promedio de ${
          data.promedio
        }. El promedio de tu oponente fue ${data.promedioOponente}.`
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
        const message = JSON.stringify(time);
        socket.emit("times", message);
        socket.emit("nextScramble"); 
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
  }, [activo, socket]);

  return (
    <div>
      {isPaired ? (
        <>
          <h1>Paired</h1>
          <p>{scramble}</p>
          <div className="cronometro">
            <p>
              {minutos < 10 ? `0${minutos}` : minutos} :{" "}
              {segundos < 10 ? `0${segundos}` : segundos} :{" "}
              {milisegundos < 10
                ? `00${milisegundos}`
                : milisegundos < 100
                ? `0${milisegundos}`
                : milisegundos}
            </p>
          </div>
          {resultado && <p>{resultado}</p>}
        </>
      ) : (
        <>
          <h1>Wait Room</h1>
          <h2>{user.username}</h2>
          <h2>{torneo}</h2>
        </>
      )}
    </div>
  );
}

export default WaitRoom;
