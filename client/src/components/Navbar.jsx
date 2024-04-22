import { Link } from "react-router-dom";
import './Navbar.css';
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { useAuthTorneo } from "../context/TorneoContext";
export const Navbar = () => {
    const refreshPage = () => {
        window.reload().location();
    }

    const { user, logout, statusChangeAuth, isAuthenticated, isJuez } = useAuth();
    const { handleSubmit } = useForm();
    const { deleteTorneoByJuez } = useAuthTorneo();

    const onSubmit = handleSubmit((data) => {
        data.email = user.email;
        data.status = "inactive";
        data.role = "user";

        deleteTorneoByJuez(data._id)
        statusChangeAuth(data);
        logout();
    });

    return (
        <nav>
            <Link to="/" className="title" replace>CubikOnline</Link>
            <ul>
                {
                    isAuthenticated && isJuez ? (
                        <>
                            <li><Link to="/" replace onClick={onSubmit}>Logout</Link></li>
                            <li><Link to="/yourtournament">Tu Torneo</Link></li>
                            <li><Link to="/torneoget" replace>Torneos</Link></li>
                        </>
                    ) :   
                    isAuthenticated ? (

                        <>
                            <li><Link to="/" replace onClick={onSubmit}>Logout</Link></li>
                            <li><Link to="/profile" replace >Profile</Link></li>
                            <li><Link to="/torneo" replace>Torneo</Link></li>
                            <li><Link to="/learn" replace >Learn</Link></li>
                            <li><Link to="/timerpvp" replace >TimerPvP</Link></li>
                            <li><Link to="/timerul" replace >Timer</Link></li>
                            <li><Link to="/account/password" replace>Password</Link></li>
                            <li><Link to="/store" replace>Store</Link></li>
                            <li><Link to="/torneoget" replace>Torneos</Link></li>

                        </>
                        
                    ):
                    //Quiero que ahora separe a los usuarios autenticados de los que son jueces
                                  
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
}
