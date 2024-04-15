import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAuthTorneo } from "../context/TorneoContext";

function TorneoPage() {
  const { register } = useForm();
  const { user, changeToJudge } = useAuth();
  const {createTorneo} = useAuthTorneo();

  const onSubmit = async (data) => {
    data.role = "juez";
    data.email = user.email;

    try {
      await Promise.all([
        changeToJudge(data),
        createTorneo(data)
      ]);
      console.log("Torneo creado y rol de usuario cambiado a juez");
    } catch (error) {
      console.error("Error al crear el torneo y cambiar el rol:", error);
    }
  };

  return (
    <div style={{ display: "grid", gridGap: "1cm", gridAutoRows: "min-content" }}>
      <h1>Juez</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gridGap: "1cm" }}>
        <h2>Configuración de Torneo</h2>
        <label htmlFor="name">
          <b>Nombre</b>
          <input type="text" id="name" {...register("name", { required: true })} />
        </label>

        <label htmlFor="participants">
          <b>Participantes</b>
          <input
            type="range"
            id="participants"
            min="5"
            max="12"
            {...register("participants", { required: true })}
          />
        </label>

        <label htmlFor="rank">
          <b>Rango</b>
          <input
            type="range"
            id="rank"
            min="0"
            max="10"
            {...register("rank", { required: true })}
          />
        </label>

        <label htmlFor="prize">
          <b>Premio</b>
          <input
            type="number"
            id="prize"
            min={0}
            max={100000}
            step={100}
            value={0}
            {...register("prize", { required: true })}
          />
        </label>

        <button type="submit">Start</button>
      </form>
    </div>
  );
}

export default TorneoPage;
