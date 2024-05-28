import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import {
  registerRequest,
  loginRequest,
  verifyTokenRequest,
  updatePasswordRequest,
  updateUserRequest,
  getUsersRequest,
  statusChangeRequest,
  changeToJugdeRequest,
  updateUserRankRequest,
  isPrivateRequest,
} from "../api/auth.js";
//import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isJuez, setIsJuez] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      console.log(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error.response);
      setErrors(error.response.data);
    }
  };

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      console.log(res.data);
      setUser(res.data);
      setIsAuthenticated(true);
      setLoading(false);
      localStorage.setItem("token", res.data.token);
    } catch (error) {
      if (Array.isArray(error.response.data)) {
        return setErrors(error.response.data);
      } else {
        setErrors([error.response.data.message]);
      }

      setErrors([error.response.data.message]);
    }
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const checkLogin = useCallback(async () => {
    // Obtener el token del localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return setUser(null);
    }
    try {
      // Verificar el token en el servidor
      const res = await verifyTokenRequest(token);
      if (!res.data) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      } else {
        setUser(res.data.user); // Asumiendo que el usuario se almacena en res.data.user
        setIsAuthenticated(true);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  // Nuevo efecto para escuchar cambios en el token del localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
      } else {
        // Verificar el token en el servidor cuando cambie
        checkLogin();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [checkLogin]);

  const updatePassword = async (email, newPassword) => {
    try {
      const res = await updatePasswordRequest(email, newPassword);
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const updateUserPoints = async (email, points) => {
    try {
      const res = await updateUserRequest(email, points);
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Eliminar el token del localStorage
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
      setIsJuez(false);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getUsersTable = async () => {
    try {
      const res = await getUsersRequest();
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const statusChangeAuth = async (email, status, role) => {
    try {
      const res = await statusChangeRequest(email, status, role);
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const changeToJugde = async (userInfo) => {
    try {
      const res = await changeToJugdeRequest(userInfo.email, userInfo.role);
      console.log(res.data);
      setIsJuez(true);
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const updateUserRank = async (user) => {
    try {
      const res = await updateUserRankRequest(user);
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const isPrivate = async (email, isPrivate) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return setUser(null);
      } else {
        const res = await isPrivateRequest(email, isPrivate);
        console.log(res.data);
        return res.data;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        updatePassword,
        updateUserPoints,
        getUsersTable,
        statusChangeAuth,
        changeToJugde,
        updateUserRank,
        isPrivate,
        logout,
        loading,
        user,
        isAuthenticated,
        isJuez,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
