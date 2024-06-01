import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useAuthTorneo } from "../context/TorneoContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyTokenRequest } from "../api/auth";
import "./Profile.css";
// import io from "socket.io-client";
// const URL = import.meta.env.VITE_BACKEND_URL;

function TorneoPage() {
  const { register, handleSubmit } = useForm();
  const { user, changeToJugde, isJuez } = useAuth();
  const { createTorneo } = useAuthTorneo();
  const navigation = useNavigate();
  const [participantes, setParticipantes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  //const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await verifyTokenRequest();
        setCurrentUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [user]);

  // useEffect(() => {
  //   const socket = io(`${URL}/join`);
  //   setSocket(socket);
  // }, []);

  const onSubmit = async (data, event) => {
    event.preventDefault();
    data.qty_participantes = parseInt(data.qty_participantes, 10);
    setParticipantes(data.qty_participantes);
    try {
      const userInfo = {
        email: currentUser.email,
        role: "juez",
      };
      data.juez = currentUser._id;
      await Promise.all([
        console.log(data),
        changeToJugde(userInfo),
        createTorneo(data),
      ]);
      console.log("Torneo creado y rol de usuario cambiado a juez");
      // socket.emit("juez", currentUser._id);
      // socket.emit("n_participantes", data.qty_participantes);
    } catch (error) {
      console.error("Error al crear el torneo y cambiar el rol:", error);
    }
  };

  useEffect(() => {      
    if (isJuez) {
      navigation("/yourtournament", { state: { participantes } });
    }
  }, [isJuez, navigation]);

  return (
    <div
    className="contenedor" id="cont">
      <div className="contenedor">
      <h1 className="texto font-bold text-center">Juez</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        
      >
        <h2 className="texto text-center">Configuración de Torneo</h2>
        <label htmlFor="nombre">
          <input
            type="text"
            id="nombre"
            placeholder="Nombre del torneo"
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
            {...register("nombre", { required: true })}
          />
        </label>

        <label htmlFor="qty_participantes">
          <b>Participantes</b>
          <input
            type="range"
            id="participants"
            min="2"
            max="4"
            {...register("qty_participantes", { required: true })}
          />
        </label>
        
        <label htmlFor="rango">
          <b>Rango</b>
          <input
            type="range"
            id="rango"
            min="1"
            max="10"
            {...register("rango", { required: true })}
          />
        </label>

        <label htmlFor="premio">
          {/* <b>Premio</b> */}
          <input
            type="text"
            id="premio"
            placeholder="Premio"
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
            {...register("premio", { required: true })}
          />
        </label>
        <div className="flex justify-center space-x-4">
          <button type="submit" className="bg-slate-700 text-white py-2 px-4 rounded-md hover:bg-slate-900 transition-colors duration-300">Start</button>
        </div>
      </form>
      </div>
     
    </div>
  );
}

export default TorneoPage;
