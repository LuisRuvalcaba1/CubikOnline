//import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
//import { removeTokenRequest, renewTokenRequest } from "../api/auth";
import { useAuthTorneo } from "../context/TorneoContext";

function ProfilePage() {
  const { register, handleSubmit } = useForm();
  const { user, updateUserPoints, logout, statusChangeAuth } = useAuth();
  const { deleteTorneoByJuez } = useAuthTorneo();

  // useEffect(() => {

  //   const renovarToken = async () => {
  //     try {
  //       await renewTokenRequest();
  //     } catch (error) {
  //       console.error('Error al renovar el token:', error);
  //     }
  //   }

  //   const eliminarToken = async () => {
  //     try {
  //       const data = {
  //         email: user.email,
  //         status: "inactive",
  //         role: "user",
  //       };
  //       deleteTorneoByJuez(data._id);
  //       statusChangeAuth(data);
  //       await logout();
  //       await removeTokenRequest();
  //     } catch (error) {
  //       console.error('Error al eliminar el token:', error);
  //     }
  //   };

  //   renovarToken();

  //   const timeoutId = setTimeout(eliminarToken, 21600000); 

  //   return () => clearTimeout(timeoutId);
  // }, [user, deleteTorneoByJuez, statusChangeAuth, logout]);

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
