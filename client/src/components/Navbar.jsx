import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { useAuthTorneo } from "../context/TorneoContext";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

export const Navbar = () => {
  //const location = useLocation();
  const refreshPage = () => {
    window.reload().location();
  };

  // function classNames(...classes) {
  //   return classes.filter(Boolean).join(" ");
  // }

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

  return (
    <Disclosure as="nav" className="bg-gray-700">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16m-7 6h7"
                      />
                    </svg>
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
        <Link to="/" className="title" replace>
          CubikOnline
        </Link>
        <div className="hidden sm:block sm:ml-6">
          <div className="flex space-x-4">
            {isAuthenticated && isJuez ? (
              <>
                <Link
                  to="/"
                  replace
                  onClick={onSubmit}
                  className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </Link>
                <Link
                  to="/yourtournament"
                  className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Tu Torneo
                </Link>
              </>
            ) : isAuthenticated ? (
              <>
                <Link
                  to="/"
                  replace
                  onClick={onSubmit}
                  className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </Link>
                <Link
                  to="/profile"
                  className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Perfil
                </Link>
                <Link
                  to="/account/password"
                  className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Cambiar contraseña
                </Link>
                <Link
                  to="/timerul"
                  className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Timer
                </Link>
                <Link
                  to="/store"
                  className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Store
                </Link>

                <Link
                  to="/torneo"
                  className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Crear Torneo
                </Link>
                <Link
                  to="/torneoget"
                  className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Torneos Disponibles
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  replace
                  onClick={refreshPage}
                  className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  replace
                  onClick={refreshPage}
                  className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Registrarse
                </Link>

                <Link
                  to="/timer"
                  replace
                  onClick={refreshPage}
                  className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Timer
                </Link>

                <Link
                  to="/product"
                  className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Producto
                </Link>

                <Link
                  to="/learn"
                  className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Aprendizaje
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </Disclosure>
  );
};
