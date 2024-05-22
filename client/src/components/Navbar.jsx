import { Link } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { useAuthTorneo } from "../context/TorneoContext";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { verifyTokenRequest } from "../api/auth";

const profileMenu = [
  { name: "Perfil", href: "/profile" },
  { name: "Cambiar contraseña", href: "/account/password" },
  {name: "Amigos", href: "/friends"},
  { name: "Salir", href: "/" },
];

const torneoMenu = [
  { name: "Crear Torneo", href: "/torneo" },
  { name: "Torneos Disponibles", href: "/torneoget" },
];

export const Navbar = () => {

  const refreshPage = () => {
    window.reload().location();
  };

  const { user, logout, statusChangeAuth, isAuthenticated, isJuez } = useAuth();
  const { handleSubmit } = useForm();
  const [currentUser, setCurrentUser] = useState(null);
  const { deleteTorneoByJuez } = useAuthTorneo();

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
  
  const onSubmit = handleSubmit((data) => {
    data.email = currentUser.email;
    data._id = currentUser._id;
    data.status = "inactive";
    data.role = "user";

    //deleteTorneoByJuez(data._id);
    statusChangeAuth(data);
    logout();
  });

  const onDeleteTournament = async (id) => {
    try {
      const res = await deleteTorneoByJuez(currentUser._id, id);
      console.log(res);
      statusChangeAuth(currentUser._id);
      logout();
    } catch (error) {
      console.error("Error al eliminar torneo:", error);
    }
  }

  return (
    <Disclosure as="nav" className="bg-neutral-700">
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
          <div className="flex space-x-5">
            {isAuthenticated && isJuez ? (
              <>
                <Link
                  to="/"
                  replace
                  onClick={onDeleteTournament}
                  className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Salir
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
                  to="/store"
                  className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Store
                </Link>

                <Link
                  to="/timerul"
                  className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Timer
                </Link>

                <Link
                  to="/timerpvp"
                  className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Confrontaciones
                </Link>
                <Menu as="div" className="relative inline-block text-right">
                  <div>
                    <Menu.Button className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                      Torneo
                    </Menu.Button>
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
                    <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-gray-700 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-1 py-1 ">
                        {torneoMenu.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                to={item.href}
                                className={`${
                                  active
                                    ? "bg-gray-900 text-white"
                                    : "text-white"
                                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                              >
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>

                <Link
                  to="/category"
                  className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Aprendizaje
                </Link>

                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                      Perfil
                    </Menu.Button>
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
                    <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-gray-700 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-1 py-1 ">
                        {profileMenu.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                to={item.href}
                                className={`${
                                  active
                                    ? "bg-gray-900 text-white"
                                    : "text-white"
                                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                onClick={
                                  item.name === "Salir" ? onSubmit : null
                                } // Add this line
                              >
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
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
                  to="/category"
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
