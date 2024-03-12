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
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Rango</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.username}>
                    <td>{user.username}</td>
                    <td>{user.rank}</td>
                    <td>{user.points}</td>
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

export default HomePage;