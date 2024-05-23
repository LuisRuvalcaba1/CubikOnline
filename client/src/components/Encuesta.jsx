import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useEncuesta } from "../context/EncuestaContext";
import { verifyTokenRequest } from "../api/auth.js";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function Encuesta({ visible, onClose, userEncuestas }) {
  const [showEncuesta, setShowEncuesta] = useState(false);
  const { user } = useAuth();
  const { value } = useEncuesta();
  const { updateEncuesta, createEncuesta } = value;
  const { register, handleSubmit } = useForm();
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.user = currentUser._id;
      if (userEncuestas.length > 0) {
        // Si el usuario tiene una encuesta existente, actualizar
        const encuestaId = userEncuestas[0]._id;
        const res = await updateEncuesta(encuestaId, data);
        console.log(res);
      } else {
        // Si el usuario no tiene una encuesta existente, crear una nueva
        const res = await createEncuesta(data);
        console.log(res);
      }
      onClose();
    } catch (error) {
      console.error("Error al actualizar/crear la encuesta:", error);
    }
  });

  if (!visible) return null;

  return (
    <>
      {!showEncuesta ? (
        <div
          id="container"
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4 text-black">
              ¿Quieres contestar la encuesta?
            </h1>
            <div className="flex justify-center space-x-4">
              <button
                onClick={onClose}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-300"
              >
                No
              </button>
              <button
                onClick={() => setShowEncuesta(true)}
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-300"
              >
                Sí
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form
          id="container"
          onSubmit={onSubmit}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 text-black"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg ">
            <h1 className="text-2xl font-bold mb-4">
              ¿Cuál es tu situación con el cubo de Rubik?
            </h1>
            <div className="mb-4">
              <select
                name="situation"
                {...register("statusCube")}
                id="situation"
                className="border border-gray-300 rounded-md py-2 px-3 w-full"
              >
                <option value="1">
                  Sé resolver el cubo (Método principiante)
                </option>
                <option value="2">Sé resolver el cubo (Método avanzado)</option>
                <option value="3">No sé resolver el cubo</option>
              </select>
            </div>
            <h1 className="text-2xl font-bold mb-4">
              ¿Cuál es el paso en el cual te tardas más?
            </h1>
            <div className="mb-4">
              <select
                name="step"
                {...register("phaseCube")}
                id="step"
                className="border border-gray-300 rounded-md py-2 px-3 w-full"
              >
                <option value="1">OLL</option>
                <option value="2">PLL</option>
                <option value="3">F2L</option>
              </select>
            </div>
            <h1 className="text-2xl font-bold mb-4">
              ¿Cuánto tardas en resolver el cubo de Rubik?
            </h1>
            <div className="mb-4">
              <select
                name="time"
                {...register("timeCube")}
                id="time"
                className="border border-gray-300 rounded-md py-2 px-3 w-full"
              >
                <option value="1">5-30 segundos</option>
                <option value="2">31-59 segundos</option>
                <option value="3">60-120 segundos</option>
              </select>
            </div>

            <div className="flex justify-center space-x-4">
              <button type="submit" className="bg-white-500 text-black py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-300 hover:text-white">
                Enviar
              </button>
              <button onClick={onClose} className="bg-white-500 text-black py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-300 hover:text-white">
                Cancelar
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}

// export default Encuesta;
