import { Link } from "react-router-dom";
import './Navbar.css';
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
export const Navbar = () => {
    const refreshPage = () => {
        window.reload().location();
    }  

    const {user, logout, statusChangeAuth , isAuthenticated} = useAuth();
    const {handleSubmit} = useForm();
    
    const onSubmit = handleSubmit((data) => {
        data.email = user.email;
        data.status = "inactive";
        
        statusChangeAuth(data);
        logout();
    });

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
                        <li><Link to="/account/password" replace>Password</Link></li>
                        <li><Link to= "/" replace onClick={onSubmit}>Logout</Link></li>
                        <li><Link to="/store" replace>Store</Link></li>
                    </>
                )
            :(
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
            
            )}
            
        </ul>
    </nav>
)
}
