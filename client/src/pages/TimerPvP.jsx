import { useEffect, useState } from "react";
import "./Timer.css";
import { Link,useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useAuth } from "../context/AuthContext";
import { useAuthTimerPvP } from '../context/TimerPvPContext';
//import Camara from "../components/Camara";

function TimerPvP() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createTimerPvP } = useAuthTimerPvP();
  const [usuario, setUsuario] = useState('');
  const [milisegundos, setMilisegundos] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [minutos, setMinutos] = useState(0);
  const [activo, setActivo] = useState(false);
  const [tiempoInicial, setTiempoInicial] = useState(null);
  const [scramble, setScramble] = useState("");
  const [isPaired, setIsPaired] = useState(false);
  const [socket, setSocket] = useState(''); // Estado para almacenar el socket
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:4000');
    setSocket(socket);

    socket.emit('user', JSON.stringify({ id: user._id }))
    socket.on('user', (user) => {
      setUsuario(user)
    })

    socket.on('paired', () => {
      setIsPaired(true);
    });

    socket.on('scramble', (scramble) => {
      setScramble(scramble);
    });

    socket.on('message', (tiempoSocket) => {
      console.log(tiempoSocket)
    });

    socket.on('resultado', (data) => {
      console.log(data);
      setResultado(data.ganador);
    
      if (data.ganador) {
        const winner = JSON.parse(data.winner);
        const loser = JSON.parse(data.loser);
        createTimerPvP(winner, loser);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  function mostrarResultado() {
    if (resultado !== null) {
        if (resultado) {
            return <p>¡Felicidades! Ganaste el duelo.</p>;
        } else {
            return <p>Lo siento, perdiste el duelo.</p>;
        }
    }
    return null;
}

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
  
      const time = `${tiempoMinutos}:${tiempoSegundos < 10 ? "0" : ""}${tiempoSegundos}:${
        tiempoMilisegundos < 10 ? "00" : tiempoMilisegundos < 100 ? "0" : ""
      }${tiempoMilisegundos}`;

        if (socket) {
          const message = JSON.stringify({ time: time });
          socket.emit('message', message);
          console.log('Enviado:', message);
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
          {mostrarResultado()}
        </>
      ) : (
        <h1>Esperando emparejamiento...</h1>
      )}
    </div>
  );
}

export default TimerPvP;