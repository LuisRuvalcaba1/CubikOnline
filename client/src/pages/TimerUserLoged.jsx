import { useEffect, useState } from "react";
import { useAuthTimer } from "../context/TimerContext";
import "./Timer.css";

function TimerUserLoged() {
  const { createNewTimer, getTimers, timer } = useAuthTimer();
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
        const response = await getTimers();
        setTiemposGuardados(response.data);
      } catch (error) {
        console.error('Error fetching timers:', error);
      }
    };

    fetchTimers();
  }, []);

  useEffect(() => {
    generarNuevoScramble();
    const tiemposGuardadosLocal = JSON.parse(localStorage.getItem("tiempos"));
    if (tiemposGuardadosLocal) {
      setTiemposGuardados(tiemposGuardadosLocal);
    }

    // Agregar un event listener para el evento beforeunload
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // Remover el event listener al desmontar el componente
      window.removeEventListener("beforeunload", handleBeforeUnload);
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
      // Actualizar los tiempos guardados y el almacenamiento local
      setTiemposGuardados((prevTiempos) => [...prevTiempos,nuevoTiempo]);
      localStorage.setItem(
        "tiempos",
        JSON.stringify([...tiemposGuardados, nuevoTiempo])
      );
      
      const values = {
        time,
        scramble,
        session,
      };
      createNewTimer(values);
      getTimers();
      // Reiniciar el tiempo inicial
      setTiempoInicial(null);
      //Recargar la pagina cuando se guarde el tiempo
      window.location;
    }
  }

  // Función para manejar el evento beforeunload
  function handleBeforeUnload() {
    // Limpiar el almacenamiento local al descargar la página
    localStorage.removeItem("tiempos");
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
        <h2>Session</h2>
        <input
          type="number"
          value={session}
          onChange={(e) => setSession(e.target.value)}
        />
        <ul>
        {tiemposGuardados.map((timers) => (
          <li key={timers._id}>

            <p>Tiempo: {timers.time}</p>
            <p>Scramble: {timers.scramble}</p>
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