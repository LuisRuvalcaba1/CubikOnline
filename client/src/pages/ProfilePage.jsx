import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
function ProfilePage() {
  const { register, handleSubmit } = useForm();
  const { user, updateUserPoints } = useAuth();

  const onSubmit = handleSubmit((data) => {
    data.email = user.email;
    updateUserPoints(data);

  });
  return (
    <div>
      <h1 className="">Perfil</h1>
      {user ? (
        <div>
          <p>Nombre: {user.username}</p>
          <p>Rango: {user.rank}</p>
          <p>Points: {user.points}</p>
          {/*Formulario para sumar puntos al usuario */}
          <form onSubmit={onSubmit}>
            <label htmlFor="points">Añadir Puntos:</label>
            <input
              id="points"
              type="number"
              {...register("points", { required: true })}
            />
            <button type="submit">Actualizar Puntos</button>
          </form>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ProfilePage;
