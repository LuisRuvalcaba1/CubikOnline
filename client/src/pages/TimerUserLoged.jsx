import { useEffect, useState } from "react";
import { useAuthTimer } from "../context/TimerContext";
import "./Timer.css";

function TimerUserLoged() {
  const { user, createNewTimer, getTimers } = useAuthTimer();
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
    const fetchTimers = async () => {
      try {
        const timers = await getTimers();
        setTiemposGuardados(timers);
      } catch (error) {
        console.error('Error fetching timers:', error.message);
      }
    };
    fetchTimers();
  }, [user]);

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
          setTiempoInicial(performance.now()); // Al activar, establecer tiempo inicial
        } else {
          registrarTiempo(); // Al desactivar, registrar tiempo
          generarNuevoScramble(); // Generar un nuevo scramble al detener el cronómetro
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
      // Verificar que hay un tiempo inicial establecido
      const tiempoFinal = performance.now(); // Obtener el tiempo actual
      const tiempoTranscurrido = tiempoFinal - tiempoInicial; // Calcular el tiempo transcurrido
      const tiempoMilisegundos = Math.floor(tiempoTranscurrido % 1000);
      const tiempoSegundos = Math.floor((tiempoTranscurrido / 1000) % 60);
      const tiempoMinutos = Math.floor((tiempoTranscurrido / (1000 * 60)) % 60);

      // Crear el objeto de tiempo
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

      const time = `${tiempoMinutos}:${tiempoSegundos}.${tiempoMilisegundos}`;
      // Actualizar los tiempos guardados
      setTiemposGuardados((prevTiempos) => [nuevoTiempo, ...prevTiempos]);
      
      const values = {
        time,
        scramble,
        session
      };
      createNewTimer(values);
      getTimers(); // Obtener los tiempos actualizados desde el servidor
      // Reiniciar el tiempo inicial
      setTiempoInicial(null);
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
          {user ? (
            <p>loading...</p>
          ) : (
            tiemposGuardados.map((tiempo, index) => (
              <li key={index}>
                {tiempo.tiempo} - {tiempo.scramble}
              </li>
            ))
          )}
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
