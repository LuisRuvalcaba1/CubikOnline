import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import {
  addFriendRequest,
  getFriendsRequest,
  acceptFriendRequest,
  denyFriendRequest,
} from "../api/amigos";

function Amigos() {
  const { user, getUsersTable } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsersTable();
      setUsers(users);
    };

    const fetchFriends = async () => {
      const friendRequests = await getFriendsRequest();
      setFriends(friendRequests);
    };

    fetchFriends();
    fetchUsers();
  }, [getUsersTable, getFriendsRequest]);

  const handleAddFriend = async (friendId) => {
    try {
      const data = {
        user1: user._id,
        user2: friendId,
      };

      await addFriendRequest(data);
      const updatedFriendRequests = await getFriendsRequest(user._id);
      setFriends(updatedFriendRequests);
    } catch (error) {
      console.error("Error al agregar amigo:", error);
    }
  };

  const handleAcceptFriend = async (friendshipId) => {
    try {
      await acceptFriendRequest(friendshipId);
      const updatedFriendRequests = await getFriendsRequest(user._id);
      setFriends(updatedFriendRequests);
    } catch (error) {
      console.error("Error al aceptar solicitud de amistad:", error);
    }
  };

  const handleDenyFriend = async (friendshipId) => {
    try {
      await denyFriendRequest(friendshipId);
      const updatedFriendRequests = await getFriendsRequest(user._id);
      setFriends(updatedFriendRequests);
    } catch (error) {
      console.error("Error al rechazar solicitud de amistad:", error);
    }
  };

  const searcher = (e) => {
    setSearch(e.target.value);
  };

  let results = [];
  if (!search) {
    results = users;
  } else {
    results = users.filter((user) =>
      user.username.toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <div>
      <h1>Amigos</h1>

      {users.length > 0 ? (
        <div>
          <input
            type="text"
            placeholder="Buscar"
            onChange={searcher}
            className="text-black"
          />
          <br />

          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {results.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>
                    <button onClick={() => handleAddFriend(user._id)}>
                      Agregar Amigo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Solicitudes de amistad</h2>
          {/*Hacer un console.log para ver si se estan recibiendo los datos */
          console.log(friends)}
          {friends.length > 0 ? (
            <div>
              {console.log(friends)}
              <table>
                <thead>
                  <tr>
                    <th>Nombre de usuario</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {friends.map((friend) => (
                    <tr key={friend._id}>
                      <td>{friend.user1.username}</td>
                      <td>
                        <button onClick={() => handleAcceptFriend(friend._id)}>
                          Aceptar
                        </button>
                        <button onClick={() => handleDenyFriend(friend._id)}>
                          Rechazar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No hay solicitudes de amistad pendientes.</p>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Amigos;
