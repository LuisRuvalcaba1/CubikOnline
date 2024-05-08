import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { useAuthTorneo } from "../context/TorneoContext";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

export const Navbar = () => {
  const location = useLocation();
  const refreshPage = () => {
    window.reload().location();
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

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
      <Link to="/" className="title" replace>
        CubikOnline
      </Link>
      <ul className="navbar-menu">
        {isAuthenticated && isJuez ? (
          <>
            <li>
              <Link to="/" replace onClick={onSubmit}>
                Logout
              </Link>
            </li>
            <li>
              <Link to="/yourtournament">Tu Torneo</Link>
            </li>
          </>
        ) : isAuthenticated ? (
          <>
            <>
              <li>
                <Link to="/" replace onClick={onSubmit}>
                  Logout
                </Link>
              </li>
              <li>
                <Link to="/learn" replace>
                  Aprendizaje
                </Link>
              </li>
            </>
            <li>
              <Link to="/profile" replace>
                Perfil
              </Link>
            </li>
            <li>
              <Link to="/torneo" replace>
                Torneo
              </Link>
            </li>
            <li>
              <Link to="/timerul" replace>
                Timer
              </Link>
            </li>

            <Menu as="div">
              <div>
                <Menu.Button>Menu</Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? "bg-gray-600" : "",
                          "block px-4 py-2 text-sm text-white"
                        )}
                      >
                        <Link to="/store" replace>
                          Store
                        </Link>
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-white"
                        )}
                      >
                        <Link to="/torneoget">Crear Torneo</Link>
                      </a>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>

            {renderLinks()}
          </>
        ) : (
          <>
            <li>
              <Link to="/login" replace onClick={refreshPage}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" replace onClick={refreshPage}>
                Registrarse
              </Link>
            </li>
            <li>
              <Link to="/learn" replace onClick={refreshPage}>
                Aprendizaje
              </Link>
            </li>
            <li>
              <Link to="/timer" replace onClick={refreshPage}>
                Timer
              </Link>
            </li>
            <li>
              <Link to="/product" replace>
                Producto
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
