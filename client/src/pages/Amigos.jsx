import { input } from "@material-tailwind/react";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
function Amigos() {
  const { getUsersTable } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsersTable();
      setUsers(users);
      console.log(users);
    };

    fetchUsers();
  }, [getUsersTable]);

  const searcher = (e) => {
    setSearch(e.target.value);
  };

  let results = []
  if(!search){
    results = users
  }else{
    results = users.filter(user => user.username.toLowerCase().includes(search.toLowerCase()))
  }

  return (
    <div>
      <h1>Amigos</h1>

      {users.length > 0 ? (
        <div>
          <input type="text" placeholder="Buscar" onChange={searcher} className="text-black" />
            <br />

          <table>
            <thead>
              <tr>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              {results.map((user) => (
                <tr key={user.username}>
                  <td>{user.username}</td>
                </tr>
              ))}
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
