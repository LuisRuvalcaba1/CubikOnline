import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function JuezPage() {
  const { register, handleSubmit } = useForm();
  const { user } = useAuth();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <div>
      <h1>Juez</h1>
      <form onSubmit={onSubmit}>
        <h2>Configuracion de Torneo</h2>
        <b>Nombre</b>
        <input
          type="text"
          {...register("name", { required: true })}
        />
        <b>Participantes</b>
        <input
          type="range"
          min="5"
          max="12"
          {...register("participants", { required: true })}
        />
        <b>Rango</b>
        <input type="range"
        min="0"
        max="10"
        {...register("rank", {required:true})} 
        />

        <b>Premio</b>
        <input
          type="number"
          min={0}
          max={100000}
          step={100}
          value={0}
          {...register("prize", { required: true })}
        />

        

        <button type="submit">Start</button>
      </form>
    </div>
  );
}

export default JuezPage;
