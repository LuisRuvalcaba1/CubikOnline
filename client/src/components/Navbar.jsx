import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { useAuthTorneo } from "../context/TorneoContext";

export const Navbar = () => {
  const location = useLocation();
  const refreshPage = () => {
    window.reload().location();
  };

  const { user, logout, statusChangeAuth, isAuthenticated, isJuez } = useAuth();
  const { handleSubmit } = useForm();
  const { deleteTorneoByJuez } = useAuthTorneo();

  const onSubmit = handleSubmit((data) => {
    data.email = user.email;
    data.status = "inactive";
    data.role = "user";

    deleteTorneoByJuez(data._id);
    statusChangeAuth(data);
    logout();
  });

  const renderLinks = () => {
    switch (location.pathname) {
      case "/profile":
        return (
          <li>
            <Link to="/account/password" replace>
              Password
            </Link>
          </li>
        );
      case "/timerul":
        return (
          <>
            <li>
              <Link to="/timerpvp" replace>
                TimerPvP
              </Link>
            </li>
            <li>
              <Link to="/store" replace>
                Store
              </Link>
            </li>
          </>
        );
      case "/torneo":
        return (
          <>
            <li>
              <Link to="/torneoget" replace>
                Torneos
              </Link>
            </li>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav>
        <Link to="/" className="title" replace>CubikOnline</Link>
        <ul style={{ flexDirection: 'row' }}>
            {
                isAuthenticated && isJuez ? (
                    <>
                        <li><Link to="/" replace onClick={onSubmit}>Logout</Link></li>
                        <li><Link to="/yourtournament">Tu Torneo</Link></li>
                    </>
                ) :   
                isAuthenticated ? (

                    <>
                    <>
                        <li><Link to="/" replace onClick={onSubmit}>Logout</Link></li>
                        <li><Link to="/learn" replace>Learn</Link></li>

                    </>
                        <li><Link to="/profile" replace>Profile</Link></li>
                        <li><Link to="/torneo" replace>Torneo</Link></li>
                        <li><Link to="/timerul" replace>Timer</Link></li>
                        <li>
            <Link to="/torneoget" replace>
              Torneos
            </Link>
          </li>
                        {renderLinks()}
                    </>
                    
                ):                           
                     (
                        <>
                            <li>
                                <Link to="/login" replace onClick={refreshPage}>Login</Link>
                            </li>
                            <li>
                                <Link to="/register" replace onClick={refreshPage}>Register</Link>
                            </li>
                            <li>
                                <Link to="/learn" replace onClick={refreshPage}>Learn</Link>
                            </li>
                            <li>
                                <Link to="/timer" replace onClick={refreshPage}>Timer</Link>
                            </li>
                            <li>
                                <Link to="/product" replace>Producto</Link>
                            </li>
                        </>

                    )
                    }

        </ul>
    </nav>
)
};
