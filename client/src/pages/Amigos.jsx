import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import {
  addFriendRequest,
  getFriendsRequest,
  acceptFriendRequest,
  denyFriendRequest,
} from "../api/amigos";
import { useAmigos } from "../context/AmigosContext";

function Amigos() {
  const { user, getUsersTable } = useAuth();
  const { value } = useAmigos();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentFriends, setCurrentFriends] = useState([]);


  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const hasActiveFriendRequest = (userId) => {
    return friends.some(
      (friend) => friend.user1._id === userId || friend.user2._id === userId
    );
  };

  const isCurrentFriend = (userId) => {
    return currentFriends.some((friend) => friend._id === userId);
  };
  

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsersTable();
      setUsers(users);
    };

    const fetchFriends = async () => {
      const friendRequests = await value.getFriends();
      console.log("Solicitudes de amistad obtenidas:", friendRequests);
      setFriends(friendRequests);
    };

    // Agregar un evento de escucha de clic al documento
    const handleDocumentClick = () => {
      fetchFriends();
      fetchUsers();
    };

    document.addEventListener("click", handleDocumentClick);

    fetchFriends();
    fetchUsers();

    // Limpiar el evento de escucha en el desmontaje del componente
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [getUsersTable, value.getFriends]);

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

  const searcher = (e) => {
    setSearch(e.target.value);
  };

  let results = [];
if (!search) {
  results = users.filter(
    (user) =>
      !hasActiveFriendRequest(user._id) &&
      user._id !== currentUser?._id &&
      !isCurrentFriend(user._id)
  );
} else {
  results = users.filter(
    (user) =>
      !hasActiveFriendRequest(user._id) &&
      user.username.toLowerCase().includes(search.toLowerCase()) &&
      user._id !== currentUser?._id &&
      !isCurrentFriend(user._id)
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
          {
            /* Hacer un console.log para ver si se estan recibiendo los datos */
            console.log(friends)
          }
          <table>
            <thead>
              <tr>
                <th>Usuario que envía la solicitud</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(friends) && friends.length > 0 ? (
                friends.map((friend) => (
                  <tr key={friend._id}>
                    <td>{friend.user1.username}</td>
                    <td>
                      <button onClick={() => acceptFriendRequest(friend._id)}>
                        Aceptar
                      </button>
                      <button onClick={() => denyFriendRequest(friend._id)}>
                        Rechazar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No hay solicitudes de amistad</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Amigos;
