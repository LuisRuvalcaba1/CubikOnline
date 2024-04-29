import io from 'socket.io-client';
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from 'react';
import { useAuthTorneo } from "../context/TorneoContext";
import { useLocation } from "react-router-dom";


function WaitRoom() {
  const {user, torneo} = useLocation().state;
  const [socket, setSocket] = useState(null);
  const { getTorneoById } = useAuthTorneo();
  const [usuario, setUsuario] = useState('');

  useEffect(() => {
    setUsuario(user);
  }
  , [user]);

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
  }
  , [getTorneoById]);


  useEffect(() => {
    const socket = io('http://localhost:4000/join');
    setSocket(socket);

    socket.emit('user', user)
    socket.on('user', (user) => {
      setUsuario(user)
    })
    return () => {
      socket.disconnect();
    };
  }, []);
    
  return (
    <div>
      <h1>Wait Room</h1>
      <h2>{user}</h2>
      <h2>{torneo}</h2>
    </div>
  );
}

export default WaitRoom;