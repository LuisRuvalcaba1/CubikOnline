import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

function ProtectedRoute() {
  const { loading } = useAuth();

  // Obtener el token del localStorage
  const token = localStorage.getItem("token");

  // Si no hay carga y hay un token en el localStorage, renderizar el componente protegido
  if (!loading && token) {
    return <Outlet />;
  }
  // Si no hay carga y no hay token, redirigir al inicio de sesión
  if (!loading && !token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay carga, mostrar un mensaje de carga
  if (loading) {
    return <h1>Loading...</h1>;
  }
}

export default ProtectedRoute;
//Request de si sigue vivo el cliente.
