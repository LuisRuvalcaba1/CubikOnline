import io from 'socket.io-client';
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from 'react';


function WaitRoom() {
  const { user } = useAuth();
  const [socket, setSocket] = useState('');
  const [participantes, setParticipantes] = useState([]);
  const [paried, setPaired] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:4000/tournament');
    setSocket(socket);

    socket.emit('user', JSON.stringify({ id: user._id }));
    socket.on('user', (user) => {
      console.log('Usuario conectado', user);
    });

    socket.on('paired', () => {
      setPaired(true);
    });
    
    socket.on('disconnect', () => {
      console.log('Desconectado del espacio de nombres de la sala de espera');
    });

    return () => {
      socket.disconnect();
    };
  }
  , []);


  return (
    <div>
      <h1>Wait Room</h1>
    </div>
  );
}

export default WaitRoom;