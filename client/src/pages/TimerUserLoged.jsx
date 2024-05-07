import { useEffect, useState } from "react";
import { useAuthTimer } from "../context/TimerContext";
import { renewTokenRequest, removeTokenRequest } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useAuthTorneo } from "../context/TorneoContext";
import "./Timer.css";

function TimerUserLoged() {
  const { createNewTimer, getTimersContext } = useAuthTimer();
  const [milisegundos, setMilisegundos] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [minutos, setMinutos] = useState(0);
  const [activo, setActivo] = useState(false);
  const [tiempoInicial, setTiempoInicial] = useState(null);
  const [scramble, setScramble] = useState("");
  const [tiemposGuardados, setTiemposGuardados] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [session, setSession] = useState(1);
  const { user, logout, statusChangeAuth } = useAuth();
  const { deleteTorneoByJuez } = useAuthTorneo();

  useEffect(() => {
    getTimersContext()
      .then((response) => {
        setTiemposGuardados(response.data);
      })
      .catch((error) => {
        console.error("Error fetching timers:", error);
      });
  }, []);

  useEffect(() => {
    generarNuevoScramble();
  }, []);

  useEffect(() => {

    const renovarToken = async () => {
      try {
        await renewTokenRequest();
      } catch (error) {
        console.error('Error al renovar el token:', error);
      }
    }

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
        console.error('Error al eliminar el token:', error);
      }
    };

    renovarToken();

    const timeoutId = setTimeout(eliminarToken, 21600000); 

    return () => clearTimeout(timeoutId);
  }, [user, deleteTorneoByJuez, statusChangeAuth, logout]);

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

  useEffect(() => {
    function handleKeyPress(event) {
      if (event.keyCode === 32) {
        setActivo((prevActivo) => !prevActivo);
        if (!activo) {
          setTiempoInicial(performance.now());
        } else {
          registrarTiempo();
          generarNuevoScramble();
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [activo]);

  function generarNuevoScramble() {
    const movimientos = ["R", "L", "U", "D", "F", "B"];
    const modificadores = ["", "'", "2"];

    let nuevoScramble = "";
    let ultimoMovimiento = "";

    for (let i = 0; i < 20; i++) {
      let movimientoAleatorio =
        movimientos[Math.floor(Math.random() * movimientos.length)];
      let modificadorAleatorio =
        modificadores[Math.floor(Math.random() * modificadores.length)];

      while (movimientoAleatorio === ultimoMovimiento) {
        movimientoAleatorio =
          movimientos[Math.floor(Math.random() * movimientos.length)];
      }

      nuevoScramble += movimientoAleatorio + modificadorAleatorio + " ";
      ultimoMovimiento = movimientoAleatorio;
    }

    setScramble(nuevoScramble.trim());
  }

  function registrarTiempo() {
    if (tiempoInicial) {
      const tiempoFinal = performance.now();
      const tiempoTranscurrido = tiempoFinal - tiempoInicial;
      const tiempoMilisegundos = Math.floor(tiempoTranscurrido % 1000) - 3;
      const tiempoSegundos = Math.floor((tiempoTranscurrido / 1000) % 60);
      const tiempoMinutos = Math.floor((tiempoTranscurrido / (1000 * 60)) % 60);

      const nuevoTiempo = {
        tiempo: `${tiempoMinutos < 10 ? `0${tiempoMinutos}` : tiempoMinutos}:${
          tiempoSegundos < 10 ? `0${tiempoSegundos}` : tiempoSegundos
        }:${
          tiempoMilisegundos < 10
            ? `00${tiempoMilisegundos}`
            : tiempoMilisegundos < 100
            ? `0${tiempoMilisegundos}`
            : tiempoMilisegundos
        }`,
        scramble: scramble,
      };

      const time = `${tiempoMinutos}:${
        tiempoSegundos < 10 ? "0" : ""
      }${tiempoSegundos}.${
        tiempoMilisegundos < 10 ? "00" : tiempoMilisegundos < 100 ? "0" : ""
      }${tiempoMilisegundos}`;

      setTiemposGuardados((prevTiempos) => {
        if (Array.isArray(prevTiempos)) {
          return [nuevoTiempo, ...prevTiempos];
        } else {
          console.error("prevTiempos no es un array:", prevTiempos);
          return [];
        }
      });

      const values = {
        time,
        scramble,
        session,
        user: user._id,
      };

      createNewTimer(values)
        .then(() => {
          getTimersContext()
            .then((response) => {
              setTiemposGuardados(response.data);
            })
            .catch((error) => {
              console.error("Error fetching timers:", error);
            });
        })
        .catch((error) => {
          console.error("Error creating timer:", error);
        });
    }
  }

  function getBestTime(tiempos, session) {
    const tiemposSesion = tiempos.filter((timer) => timer.session === session);
    if (tiemposSesion.length === 0) return "N/A";

    const tiemposEnMilisegundos = tiemposSesion.map((timer) =>
      convertToMillisecondsFromString(timer.time)
    );
    const mejorTiempo = Math.min(...tiemposEnMilisegundos);

    return convertToTimeFormat(mejorTiempo);
  }

  function convertToMillisecondsFromString(tiempoString) {
    const tiempoParts = tiempoString.split(":");
    const minutos = parseInt(tiempoParts[0], 10);
    const segundos = parseInt(tiempoParts[1].split(".")[0], 10);
    const milisegundos = parseInt(tiempoParts[1].split(".")[1], 10);
    return minutos * 60000 + segundos * 1000 + milisegundos;
  }

  function convertToTimeFormat(milliseconds) {
    const minutos = Math.floor(milliseconds / 60000);
    const segundos = Math.floor((milliseconds % 60000) / 1000);
    const milisegundos = Math.floor(milliseconds % 1000);
    return `${minutos < 10 ? "0" : ""}${minutos}:${
      segundos < 10 ? "0" : ""
    }${segundos}:${
      milisegundos < 10 ? "00" : milisegundos < 100 ? "0" : ""
    }${milisegundos}`;
  }

  return (
    <div className="">
      <button
        className="sidebar-toggle"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        ☰
      </button>
      <div className={`sidebar ${showSidebar ? "show" : ""}`}>
        <h2>Tiempos Guardados</h2>
        {/*Visualizacion del mejor tiempo en la session*/}
        <div>
          <div>
            <h3>Mejor Tiempo</h3>
            <ul>
              {tiemposGuardados && tiemposGuardados.length > 0 && (
                <li>
                  <p>Tiempo: {getBestTime(tiemposGuardados, session)}</p>
                  {/* <p>Scramble: {scramble}</p> */}
                </li>
              )}
            </ul>
          </div>
        </div>
        <div>
          <a>Session</a>
          <div>
            <button onClick={() => setSession(session - 1)}>-</button>
            <input
              type="number"
              value={session}
              onChange={(e) => {
                const val = Math.floor(e.target.value);
                if (isNaN(val)) {
                  return;
                }
                setSession(val);
              }}
              style={{
                fontSize: "20px",
                color: "black",
                fontWeight: "bold",
                backgroundColor: "white",
                padding: "10px",
              }}
            />
            <button onClick={() => setSession(session + 1)}>+</button>
          </div>
        </div>
        <ul>
          {tiemposGuardados
            .filter((timer) => timer.session === session)
            .map((timer, index) => (
              <li key={index}>
                <p>Tiempo: {timer.time}</p>
                <p>Scramble: {timer.scramble}</p>
              </li>
            ))}
        </ul>
      </div>
      {!activo && <p className="scramble">{scramble}</p>}
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
    </div>
  );
}

export default TimerUserLoged;