import io from 'socket.io-client';
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from 'react';
import { useAuthTorneo } from "../context/TorneoContext";
import { useLocation } from "react-router-dom";
import { set } from 'mongoose';


function WaitRoom() {
  const {user, torneo} = useLocation().state;
  const [socket, setSocket] = useState(null);
  const [participantes, setParticipantes] = useState([]);
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
        setParticipantes(torneo.participantes);
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

    socket.emit('user', JSON.stringify({ id: user._id }))
    socket.on('user', (user) => {
      setUsuario(user)
    })

    socket.on('n_participantes', (participantes) => {
      setParticipantes(participantes);
    });

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