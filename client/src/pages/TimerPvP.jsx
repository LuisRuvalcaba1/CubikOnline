import { useEffect, useState } from "react";
import "./Timer.css";
import io from 'socket.io-client';
import { useAuth } from "../context/AuthContext";

function TimerPvP() {
  const { user } = useAuth();
  const [milisegundos, setMilisegundos] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [minutos, setMinutos] = useState(0);
  const [activo, setActivo] = useState(false);
  const [tiempoInicial, setTiempoInicial] = useState(null);
  const [scramble, setScramble] = useState("");
  const [isPaired, setIsPaired] = useState(false);
  const [socket, setSocket] = useState(''); // Estado para almacenar el socket

  useEffect(() => {
    const socket = io('http://localhost:4000');
    setSocket(socket);

    socket.on('paired', () => {
      setIsPaired(true);
    });

    socket.on('scramble', (scramble) => {
      setScramble(scramble);
    });

    socket.on('message', (tiempoSocket) => {
      console.log(tiempoSocket)
    });
    // Limpia el socket cuando el componente se desmonte
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
    if (tiempoInicial && isPaired) { // Solo enviamos el tiempo si estamos emparejados
      const tiempoFinal = performance.now();
      const tiempoTranscurrido = tiempoFinal - tiempoInicial;
      const tiempoMilisegundos = Math.floor(tiempoTranscurrido % 1000) - 3;
      const tiempoSegundos = Math.floor((tiempoTranscurrido / 1000) % 60);
      const tiempoMinutos = Math.floor((tiempoTranscurrido / (1000 * 60)) % 60);

      const time = `${tiempoMinutos}:${tiempoSegundos < 10 ? "0" : ""
        }${tiempoSegundos}.${tiempoMilisegundos < 10 ? "00" : tiempoMilisegundos < 100 ? "0" : ""
        }${tiempoMilisegundos}`;

      if (socket) {
        socket.emit('message', JSON.stringify({ usuario: user._id, tiempo: time }));
        console.log('Enviado:', time);
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
      {isPaired ? <><h1>Emparejado</h1><p>{scramble}</p><div className="cronometro">
        <p>
          {minutos < 10 ? `0${minutos}` : minutos} :{" "}
          {segundos < 10 ? `0${segundos}` : segundos} :{" "}
          {milisegundos < 10
            ? `00${milisegundos}`
            : milisegundos < 100
              ? `0${milisegundos}`
              : milisegundos}
        </p>
      </div></>
      
      : <h1>Esperando emparejamiento...</h1>}
      
    </div>
  );
}

export default TimerPvP;