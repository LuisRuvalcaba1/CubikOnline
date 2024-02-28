import { Link } from "react-router-dom";
import './Navbar.css';
import { useAuth } from "../context/AuthContext";
export const Navbar = () => {
    // const refreshPage = () => {
    //     window.reload().location();
    // }  

    const {isAuthenticated} = useAuth();
    const logout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    }
    return (
    <nav>
        <Link to="/" className="title" replace>CubikOnline</Link>
        <ul>
            {
                isAuthenticated ? (
                    <>
                        <li><Link to= "/profile" replace >Profile</Link></li>
                        <li><Link to= "/learn" replace >Learn</Link></li>
                        <li><Link to= "/timerul" replace >Timer</Link></li>
                        <li><Link to= "/" replace onClick={logout}>Logout</Link></li>
                    </>
                )
            :(
            <>
                <li>
                    <Link to="/login" replace >Login</Link> 
                </li>
                <li>
                    <Link to="/register" replace >Register</Link>
                </li>
                <li>
                    <Link to="/learn" replace >Learn</Link>
                </li>
                <li>
                    <Link to="/timer" replace>Timer</Link>
                </li>
            </>
            
            )}
            
        </ul>
    </nav>
)
}
