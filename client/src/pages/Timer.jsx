import { useEffect, useState } from "react";
import './Timer.css';

function Timer() {
  const [milisegundos, setMilisegundos] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [minutos, setMinutos] = useState(0);
  const [activo, setActivo] = useState(false);
  const [tiempoInicial, setTiempoInicial] = useState(null);
  const [scramble, setScramble] = useState('');
  const [tiemposGuardados, setTiemposGuardados] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    generarNuevoScramble();
    const tiemposGuardadosLocal = JSON.parse(localStorage.getItem('tiempos'));
    if (tiemposGuardadosLocal) {
      setTiemposGuardados(tiemposGuardadosLocal);
    }

    // Agregar un event listener para el evento beforeunload
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Remover el event listener al desmontar el componente
      window.removeEventListener('beforeunload', handleBeforeUnload);
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
        const tiempoMinutos = Math.floor((tiempoTranscurrido / (1000 * 60)) % 60);

        setMilisegundos(tiempoMilisegundos);
        setSegundos(tiempoSegundos);
        setMinutos(tiempoMinutos);
      }, 1);

      setTiempoInicial(performance.now());
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [activo, tiempoInicial]);

  useEffect(() => {
    function handleKeyPress(event) {
      if (event.keyCode === 32) {
        setActivo(prevActivo => !prevActivo);
        if (!activo) {
          generarNuevoScramble();
          registrarTiempo();
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [activo]);

  function generarNuevoScramble() {
    const movimientos = ['R', 'L', 'U', 'D', 'F', 'B'];
    const modificadores = ['', "'", '2'];

    let nuevoScramble = '';
    let ultimoMovimiento = '';

    for (let i = 0; i < 20; i++) {
      let movimientoAleatorio = movimientos[Math.floor(Math.random() * movimientos.length)];
      let modificadorAleatorio = modificadores[Math.floor(Math.random() * modificadores.length)];

      while (movimientoAleatorio === ultimoMovimiento) {
        movimientoAleatorio = movimientos[Math.floor(Math.random() * movimientos.length)];
      }

      nuevoScramble += movimientoAleatorio + modificadorAleatorio + ' ';
      ultimoMovimiento = movimientoAleatorio;
    }

    setScramble(nuevoScramble.trim());
    
  }

  function registrarTiempo() {
    if (!(minutos === 0 && segundos === 0 && milisegundos === 0)) {
      const nuevoTiempo = {
        tiempo: `${minutos < 10 ? `0${minutos}` : minutos}:${segundos < 10 ? `0${segundos}` : segundos}:${milisegundos < 10 ? `00${milisegundos}` : milisegundos < 100 ? `0${milisegundos}` : milisegundos}`,
        scramble: scramble
      };
  
      setTiemposGuardados(prevTiempos => [...prevTiempos, nuevoTiempo]);
      localStorage.setItem('tiempos', JSON.stringify([...tiemposGuardados, nuevoTiempo]));
    }
  }

  // Función para manejar el evento beforeunload
  function handleBeforeUnload() {
    // Limpiar el almacenamiento local al descargar la página
    localStorage.removeItem('tiempos');
  }

  return (
    <div className="">
      <button className="sidebar-toggle" onClick={() => setShowSidebar(!showSidebar)}>☰</button>
      <div className={`sidebar ${showSidebar ? 'show' : ''}`}>
        <h2>Tiempos Guardados</h2>
        <ul>
          {tiemposGuardados.map((item, index) => (
            <li key={index}>
              Tiempo: {item.tiempo}
            </li>
          ))}
        </ul>
      </div>
      {!activo && <p className="scramble">{scramble}</p>}
      <div className="cronometro">
        <p>{minutos < 10 ? `0${minutos}` : minutos} : {segundos < 10 ? `0${segundos}` : segundos} : {milisegundos < 10 ? `00${milisegundos}` : milisegundos < 100 ? `0${milisegundos}` : milisegundos}</p>
      </div>
    </div>
  );
}

export default Timer;