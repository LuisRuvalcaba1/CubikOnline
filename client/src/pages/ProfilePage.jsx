import { useAuth } from '../context/AuthContext';


function ProfilePage(){
    const { user } = useAuth();
  return (
    <div>
      <h1 className=''>Perfil</h1>
      {user ? (
        <div>
          <p>Nombre: {user.username}</p>
          <p>Torneos: {user.torneos}</p>
          <p>Confrontaciones: {user.confrontaciones}</p>
          <p>Puntos: {user.points}</p>
          {/* <button onClick={() => setPoints(points+1)}>Sumar Puntos</button> */}
        </div>
      ) : (
        <p>No se ha iniciado sesión.</p>
      )}
    </div>
  );
}

export default ProfilePage;