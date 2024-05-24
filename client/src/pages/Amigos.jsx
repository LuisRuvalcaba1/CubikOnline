import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import {
  addFriendRequest,
  getFriendsRequest,
  acceptFriendRequest,
  denyFriendRequest,
} from "../api/amigos";
import { useAmigos } from "../context/AmigosContext";
import { verifyTokenRequest } from "../api/auth";

function Amigos() {
  const { user, getUsersTable } = useAuth();
  const { value } = useAmigos();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [yourFriend, setYourFriend] = useState([]);

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

    const fetchYourFriends = async () => {
      try {
        const yourFriends = await value.yourFriends();
      setYourFriend(yourFriends);
      console.log("Amigos obtenidos:", yourFriends);
      } catch (error) {
        console.error("Error al obtener tus amigos:", error);
      }
      
    };

    fetchYourFriends();
    fetchFriends();
    fetchUsers();
  }, [getUsersTable, value.getFriends, value.yourFriends]);

  const handleAddFriend = async (friendId) => {
    try {
      console.log("Agregando amigo:", friendId);
      console.log("Usuario actual:", currentUser);
      const data = {
        user1: currentUser._id,
        user2: friendId,
      };

      await addFriendRequest(data);
      const updatedFriendRequests = await getFriendsRequest(currentUser._id);
      setFriends(updatedFriendRequests);
      window.location.reload();
    } catch (error) {
      console.error("Error al agregar amigo:", error);
    }
  };

  const acceptFriend = async (friendId) => {
    try {
      console.log("Aceptando solicitud de amistad:", friendId);
      await acceptFriendRequest(friendId);
      const updatedFriendRequests = await getFriendsRequest(currentUser._id);
      setFriends(updatedFriendRequests);
      window.location.reload();
    } catch (error) {
      console.error("Error al aceptar solicitud de amistad:", error);
    }
  };

  const denyFriend = async (friendId) => {
    try {
      console.log("Rechazando solicitud de amistad:", friendId);
      await denyFriendRequest(friendId);
      const updatedFriendRequests = await getFriendsRequest(currentUser._id);
      setFriends(updatedFriendRequests);
      window.location.reload();
    } catch (error) {
      console.error("Error al rechazar solicitud de amistad:", error);
    }
  };

  const searcher = (e) => {
    setSearch(e.target.value);
  };

  let results = [];

  if (!search) {
    results = users.filter(
      (user) =>
        user._id !== currentUser?._id &&
        (user._id !== yourFriend?.user1 || user._id !== yourFriend?.user2) &&
        user.isPrivate === false
    );
  } else {
    results = users.filter(
      (user) =>
        user.username.toLowerCase().includes(search.toLowerCase()) &&
        user._id !== currentUser?._id &&
        (user._id !== yourFriend?.user1 || user._id !== yourFriend?.user2) &&
        user.isPrivate === false
    );
  }

  const refreshPage = () =>{
    window.location.reload();
  }

  return (
    <div>
      <h1 onClick={refreshPage}>Amigos</h1>

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
            //console.log(currentUser)
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
                      <button onClick={() => acceptFriend(friend._id)}>
                        Aceptar
                      </button>
                      <button onClick={() => denyFriend(friend._id)}>
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
