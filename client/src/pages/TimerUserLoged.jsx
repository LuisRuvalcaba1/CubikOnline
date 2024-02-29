import { useEffect, useState } from "react";
import { useAuthTimer } from "../context/TimerContext";
import "./Timer.css";

function TimerUserLoged() {
  const { createNewTimer, getTimersContext, timers } = useAuthTimer();
  const [milisegundos, setMilisegundos] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [minutos, setMinutos] = useState(0);
  const [activo, setActivo] = useState(false);
  const [tiempoInicial, setTiempoInicial] = useState(null);
  const [scramble, setScramble] = useState("");
  const [tiemposGuardados, setTiemposGuardados] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [session, setSession] = useState(1);

  useEffect(() => {
    getTimersContext().then((response) => {
      setTiemposGuardados(response.data);
    }).catch(error => {
      console.error('Error fetching timers:', error);
    });
  }, []);

  useEffect(() => {
    generarNuevoScramble();
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
      const tiempoMilisegundos = Math.floor(tiempoTranscurrido % 1000);
      const tiempoSegundos = Math.floor((tiempoTranscurrido / 1000) % 60);
      const tiempoMinutos = Math.floor((tiempoTranscurrido / (1000 * 60)) % 60);

      const nuevoTiempo = {
        tiempo: `${tiempoMinutos < 10 ? `0${tiempoMinutos}` : tiempoMinutos}:${
          tiempoSegundos < 10 ? `0${tiempoSegundos}` : segundos
        }:${
          tiempoMilisegundos < 10
            ? `00${tiempoMilisegundos}`
            : tiempoMilisegundos < 100
            ? `0${tiempoMilisegundos}`
            : tiempoMilisegundos
        }`,
        scramble: scramble,
      };

      const time = `${tiempoMinutos}:${tiempoSegundos}.${tiempoMilisegundos}`;

      setTiemposGuardados((prevTiempos) => {
        if (Array.isArray(prevTiempos)) {
          return [nuevoTiempo, ...prevTiempos];
        } else {
          console.error('prevTiempos no es un array:', prevTiempos);
          // Devuelve un valor predeterminado o maneja este caso según sea necesario
          return [];
        }
      });

      const values = {
        time,
        scramble,
        session,
      };

      createNewTimer(values).then(() => {
        getTimersContext().then((response) => {
          setTiemposGuardados(response.data);
        }).catch(error => {
          console.error('Error fetching timers:', error);
        });
      }).catch(error => {
        console.error('Error creating timer:', error);
      });
    }
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
        <ul>
          {tiemposGuardados.map((timer, index) => (
            <li key={index}>
              <p>Tiempo: {timer.tiempo}</p>
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