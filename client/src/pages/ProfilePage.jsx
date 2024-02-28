import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { set } from 'mongoose';


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
        
        </div>
      ) : (
        <p>No se ha iniciado sesión.</p>
      )}
    </div>
  );
}

export default ProfilePage;