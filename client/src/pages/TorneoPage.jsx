import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useAuthTorneo } from "../context/TorneoContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TorneoPage() {
  const { register, handleSubmit } = useForm();
  const { user, changeToJugde, isJuez } = useAuth();
  const { createTorneo } = useAuthTorneo();
  const navigation = useNavigate();
  const [participantes, setParticipantes] = useState([]);

  const onSubmit = async (data, event) => {
    event.preventDefault();
    data.qty_participantes = parseInt(data.qty_participantes, 10);
    setParticipantes(data.qty_participantes);
    try {
      const userInfo = {
        email: user.email,
        role: "juez",
      };
      data.juez = user._id;
      await Promise.all([
        console.log(data),
        changeToJugde(userInfo),
        createTorneo(data),
      ]);
      console.log("Torneo creado y rol de usuario cambiado a juez");
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
      style={{ display: "grid", gridGap: "1cm", gridAutoRows: "min-content" }}
    >
      <h1>Juez</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "grid", gridGap: "1cm" }}
      >
        <h2>Configuración de Torneo</h2>
        <label htmlFor="nombre">
          <input
            type="text"
            id="nombre"
            placeholder="Nombre del torneo"
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
          <b>Premio</b>
          <input
            type="text"
            id="premio"
            {...register("premio", { required: true })}
          />
        </label>

        <button type="submit">Start</button>
      </form>
    </div>
  );
}

export default TorneoPage;
