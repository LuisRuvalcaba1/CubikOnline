import {useAuth} from '../context/AuthContext.jsx'
import {useEffect, useState} from 'react';

function HomePage() {
  const { getUsersTable } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
      const fetchUsers = async () => {
            const users = await getUsersTable();
            setUsers(users);
            console.log(users);
      };
  
      fetchUsers();
    }, [getUsersTable]);

  return (
    <div>
      <h1>Home Page</h1>
      {users.length > 0 ? (
        <div>
            {users.map((user) => (
                <table key={user}>
                    <tr>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.points}</td>
                    </tr>
                </table>
            ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default HomePage;