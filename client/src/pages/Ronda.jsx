import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useAuth } from "../context/AuthContext";

function Ronda() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scrambles, setScrambles] = useState([]);
  const [currentScrambleIndex, setCurrentScrambleIndex] = useState(0);
  const [tiempos, setTiempos] = useState([]);
  const [socket, setSocket] = useState(null);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:4000/tournament');
    setSocket(socket);

    socket.emit('user', JSON.stringify({ id: user._id }));
    socket.on('user', (user) => {
      console.log('Usuario conectado:', user);
    });

    socket.on('scramble', (scramble) => {
      setScrambles((prevScrambles) => [...prevScrambles, scramble]);
    });

    socket.on('resultado', (data) => {
      setResultado(data);
      if (data.ganador) {
        // Manejar el resultado del ganador
        console.log('Ganador:', data.winner);
        console.log('Perdedor:', data.loser);
      } else {
        // Manejar el resultado del perdedor
        console.log('Perdedor:', data.loser);
        console.log('Ganador:', data.winner);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const registrarTiempo = (tiempo) => {
    setTiempos((prevTiempos) => [...prevTiempos, tiempo]);
    socket.emit('tiempo', { tiempo, scrambleIndex: currentScrambleIndex });
    setCurrentScrambleIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div>
      <h1>Ronda</h1>
      {scrambles.length > 0 && (
        <>
          <p>Scramble: {scrambles[currentScrambleIndex]}</p>
          {/* Componente para ingresar el tiempo */}
          <button onClick={() => registrarTiempo('00:15:23')}>Registrar Tiempo</button>
        </>
      )}
      {resultado && (
        <div>
          <h2>{resultado.ganador ? 'Ganaste!' : 'Perdiste'}</h2>
          <p>Tus tiempos: {tiempos.join(', ')}</p>
          {resultado.ganador && (
            <p>Ganador: {resultado.winner}</p>
          )}
          {!resultado.ganador && (
            <p>Ganador: {resultado.winner}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Ronda;