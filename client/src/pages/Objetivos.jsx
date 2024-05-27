import { useObjetives } from "../context/ObjetivesContext";
import { useEffect, useState } from "react";
import { verifyTokenRequest } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Objetivos() {
  const { user } = useAuth();
  const { getObjetivesContext, createNewObjetive } = useObjetives();
  const [userObjetives, setUserObjetives] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

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
    const fetchObjetivos = async () => {
      try {
        const [objetivoResponse] = await Promise.all([getObjetivesContext()]);
        const objetivo = objetivoResponse.data;
        setUserObjetives(objetivo);
        console.log("Objetivos del usuario:", objetivo);

        if (objetivo.length === 0) {
          const data = {
            objective: 1,
            qty_times: 0,
          };

          const data2 = {
            objective: 2,
            qty_times: 0,
          };

          await createNewObjetive(data);
          await createNewObjetive(data2);
        }
      } catch (error) {
        console.error("Error fetching objetivos:", error);
      }
    };
    fetchObjetivos();
  }, [getObjetivesContext, createNewObjetive]);

  return (
    <div className="flex h-screen items-center justify-center bg-black bg-opacity-20">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-lg">
        <h1 className="text-2xl font-bold">Objetivos</h1>
        {userObjetives.map((objetivo, i) => (
          <div key={i}>
            <p>Objetivo: {objetivo.objective}</p>
            <p>Cantidad de veces: {objetivo.qty_times}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Objetivos;
