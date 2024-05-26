import { useEffect, useState } from "react";
import { useAuthTimer } from "../context/TimerContext";
import { useAuth } from "../context/AuthContext";
import { useAuthTorneo } from "../context/TorneoContext";
import { useObjetives } from "../context/ObjetivesContext.jsx";
import "./Timer.css";
import { verifyTokenRequest, removeTokenRequest } from "../api/auth.js";

function TimerUserLoged() {
  const { createNewTimer, getTimersContext } = useAuthTimer();
  const { getObjetivesContext, createNewObjetive, updateObjetive, objetivo } =
    useObjetives();
  const [milisegundos, setMilisegundos] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [minutos, setMinutos] = useState(0);
  const [activo, setActivo] = useState(false);
  const [tiempoInicial, setTiempoInicial] = useState(null);
  const [scramble, setScramble] = useState("");
  const [tiemposGuardados, setTiemposGuardados] = useState([]);
  const [session, setSession] = useState(1);
  const { user, logout, statusChangeAuth, updateUserPoints } = useAuth();
  const { deleteTorneoByJuez } = useAuthTorneo();
  const [categoria, setCategoria] = useState("3x3");
  const [expandedScramble, setExpandedScramble] = useState(null);
  const [userObjetive, setUserObjetive] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const handleTimeClick = (scramble) => {
    if (expandedScramble === scramble) {
      setExpandedScramble(null);
    } else {
      setExpandedScramble(scramble);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await verifyTokenRequest();
        setCurrentUser(data);
        console.log("Usuario", data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchObjectivo = async () => {
      try {
        const { data } = await getObjetivesContext();
        setUserObjetive(data);
        userObjetive.map((objetivo) => {
          if (objetivo.objective === 1 && objetivo.qty_times < 5) {
            console.log("Objetivo actual:", objetivo);
          }
        });
      } catch (error) {
        console.error("Error fetching objetives:", error);
      }
    };

    fetchObjectivo();
    fetchUser();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [objetivesResponse, timersResponse] = await Promise.all([
          getObjetivesContext(),
          getTimersContext(),
        ]);

        const fetchedObjetives = objetivesResponse.data;
        const fetchedTimers = timersResponse.data;

        setUserObjetive(fetchedObjetives);
        setTiemposGuardados(fetchedTimers);

        if (fetchedObjetives.length === 0 && fetchedTimers.length === 0) {
          const data = {
            objective: 1,
            qty_times: 0,
          };

          createNewObjetive(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [getObjetivesContext, getTimersContext]);

  useEffect(() => {
    getTimersContext()
      .then((response) => {
        setTiemposGuardados(response.data);
      })
      .catch((error) => {
        console.error("Error fetching timers:", error);
      });
  }, []);

  useEffect(() => {
    generarNuevoScramble();
  }, [categoria]);

  useEffect(() => {
    const eliminarToken = async () => {
      try {
        const data = {
          email: user.email,
          status: "inactive",
          role: "user",
        };
        deleteTorneoByJuez(data._id);
        statusChangeAuth(data);
        await logout();
        await removeTokenRequest();
      } catch (error) {
        console.error("Error al eliminar el token:", error);
      }
    };
    const timeoutId = setTimeout(eliminarToken, 21600000);

    return () => clearTimeout(timeoutId);
  }, [user, deleteTorneoByJuez, statusChangeAuth, logout]);

  useEffect(() => {
    let interval;
    if (activo) {
      interval = setInterval(() => {
        const tiempoActual = performance.now();
        const tiempoTranscurrido = tiempoActual - tiempoInicial;
        const tiempoMilisegundos = Math.floor(tiempoTranscurrido % 1000);
        const tiempoSegundos = Math.floor((tiempoTranscurrido / 1000) % 60);
        const tiempoMinutos = Math.floor(
          (tiempoTranscurrido / (1000 * 60)) % 60
        );

        setMilisegundos(tiempoMilisegundos);
        setSegundos(tiempoSegundos);
        setMinutos(tiempoMinutos);
      }, 1);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [activo, tiempoInicial]);

  useEffect(() => {
    function handleKeyPress(event) {
      if (event.keyCode === 32) {
        setActivo((prevActivo) => !prevActivo);
        if (!activo) {
          setTiempoInicial(performance.now());
        } else {
          registrarTiempo();
          generarNuevoScramble();
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [activo]);

  function generarNuevoScramble() {
    const movimientos = {
      "2x2": ["R", "L", "U", "D", "F", "B"],
      "3x3": ["R", "L", "U", "D", "F", "B"],
      "4x4": ["R", "L", "U", "D", "F", "B", "r", "l", "u", "d", "f", "b"],
      "5x5": ["R", "L", "U", "D", "F", "B", "r", "l", "u", "d", "f", "b"],
    };

    const modificadores = ["", "'", "2"];
    const movimientosCategoria = movimientos[categoria];
    let nuevoScramble = "";
    let ultimoMovimiento = "";

    const longitudScramble = {
      "2x2": 9,
      "3x3": 21,
      "4x4": 46,
      "5x5": 60,
    };

    for (let i = 0; i < longitudScramble[categoria]; i++) {
      let movimientoAleatorio =
        movimientosCategoria[
          Math.floor(Math.random() * movimientosCategoria.length)
        ];
      let modificadorAleatorio =
        modificadores[Math.floor(Math.random() * modificadores.length)];

      while (movimientoAleatorio === ultimoMovimiento) {
        movimientoAleatorio =
          movimientosCategoria[
            Math.floor(Math.random() * movimientosCategoria.length)
          ];
      }

      nuevoScramble += movimientoAleatorio + modificadorAleatorio + " ";
      ultimoMovimiento = movimientoAleatorio;
    }

    setScramble(nuevoScramble.trim());
  }

  //console.log("Objetivo:", userObjetive.qty_times);
  function registrarTiempo() {
    if (tiempoInicial) {
      const tiempoFinal = performance.now();
      const tiempoTranscurrido = tiempoFinal - tiempoInicial;
      const tiempoMilisegundos = Math.floor(tiempoTranscurrido % 1000) - 3;
      const tiempoSegundos = Math.floor((tiempoTranscurrido / 1000) % 60);
      const tiempoMinutos = Math.floor((tiempoTranscurrido / (1000 * 60)) % 60);
      const nuevoTiempo = {
        tiempo: `${tiempoMinutos < 10 ? `0${tiempoMinutos}` : tiempoMinutos}:${
          tiempoSegundos < 10 ? `0${tiempoSegundos}` : tiempoSegundos
        }:${
          tiempoMilisegundos < 10
            ? `00${tiempoMilisegundos}`
            : tiempoMilisegundos < 100
            ? `0${tiempoMilisegundos}`
            : tiempoMilisegundos
        }`,
        scramble: scramble,
      };
      const time = `${tiempoMinutos}:${
        tiempoSegundos < 10 ? "0" : ""
      }${tiempoSegundos}.${
        tiempoMilisegundos < 10 ? "00" : tiempoMilisegundos < 100 ? "0" : ""
      }${tiempoMilisegundos}`;
      setTiemposGuardados((prevTiempos) => {
        if (Array.isArray(prevTiempos)) {
          return [nuevoTiempo, ...prevTiempos];
        } else {
          console.error("prevTiempos no es un array:", prevTiempos);
          return [];
        }
      });

      const values = {
        time,
        scramble,
        session,
      };
      createNewTimer(values)
        .then(() => {
          getTimersContext()
            .then((response) => {
              setTiemposGuardados(response.data);
            })
            .catch((error) => {
              console.error("Error fetching timers:", error);
            });
        })
        .catch((error) => {
          console.error("Error creating timer:", error);
        });

      const mejorTiempoAnterior = getBestTime(tiemposGuardados, session);

      console.log(mejorTiempoAnterior);
      console.log(nuevoTiempo.tiempo);

      if (
        mejorTiempoAnterior === "N/A" ||
        nuevoTiempo.tiempo < mejorTiempoAnterior
      ) {
        console.log("Objetivo actual:", userObjetive.qty_times);

        const objetivoActual = userObjetive.find(
          (objetivo) => objetivo.objective === 1 && objetivo.qty_times < 4
        );

        console.log("Objetivo actual:", objetivoActual);
        if (objetivoActual) {
          const nuevoQtyTimes = objetivoActual.qty_times + 1;
          updateObjetive(objetivoActual._id, { qty_times: nuevoQtyTimes })
            .then(() => {
              setUserObjetive((prevObjetivos) =>
                prevObjetivos.map((objetivo) =>
                  objetivo._id === objetivoActual._id
                    ? { ...objetivo, qty_times: nuevoQtyTimes }
                    : objetivo
                )
              );
              // Actualizar los puntos del usuario
              if (currentUser) {
                const newPoints = currentUser.points + 100;
                updateUserPoints(currentUser._id, { points: newPoints })
                  .then((updatedUser) => {
                    setCurrentUser({
                      ...currentUser,
                      points: updatedUser.points,
                    });
                    console.log("Puntos actualizados:", updatedUser.points);
                  })
                  .catch((error) => {
                    console.error("Error al actualizar los puntos:", error);
                  });
              }
            })
            .catch((error) => {
              console.error("Error al actualizar el objetivo:", error);
            });
        } else {
          console.error("No se encontró el objetivo");
        }
      }
    }
  }

  function getBestTime(tiempos, session) {
    const tiemposSesion = tiempos.filter((timer) => timer.session === session);
    if (tiemposSesion.length === 0) return "N/A";
    const tiemposEnMilisegundos = tiemposSesion.map((timer) =>
      convertToMillisecondsFromString(timer.time)
    );
    const mejorTiempo = Math.min(...tiemposEnMilisegundos);
    return convertToTimeFormat(mejorTiempo);
  }

  function convertToMillisecondsFromString(tiempoString) {
    const tiempoParts = tiempoString.split(":");
    const minutos = parseInt(tiempoParts[0], 10);
    const segundos = parseInt(tiempoParts[1].split(".")[0], 10);
    const milisegundos = parseInt(tiempoParts[1].split(".")[1], 10);
    return minutos * 60000 + segundos * 1000 + milisegundos;
  }

  function convertToTimeFormat(milliseconds) {
    const minutos = Math.floor(milliseconds / 60000);
    const segundos = Math.floor((milliseconds % 60000) / 1000);
    const milisegundos = Math.floor(milliseconds % 1000);
    return `${minutos < 10 ? "0" : ""}${minutos}:${
      segundos < 10 ? "0" : ""
    }${segundos}:${
      milisegundos < 10 ? "00" : milisegundos < 100 ? "0" : ""
    }${milisegundos}`;
  }

  function getAverageOf5(tiempos, session) {
    const tiemposSesion = tiempos.filter((timer) => timer.session === session);
    if (tiemposSesion.length < 5) return "N/A";

    const ultimosGrupo = tiemposSesion
      .slice(-5)
      .sort(
        (a, b) =>
          convertToMillisecondsFromString(b.time) -
          convertToMillisecondsFromString(a.time)
      );
    const tiemposFiltrados = ultimosGrupo.slice(1, 4);

    if (tiemposFiltrados.length === 3) {
      const promedio =
        tiemposFiltrados.reduce(
          (acc, curr) => acc + convertToMillisecondsFromString(curr.time),
          0
        ) / 3;
      return convertToTimeFormat(promedio);
    }

    return "N/A";
  }

  function getAverageOf12(tiempos, session) {
    const tiemposSesion = tiempos.filter((timer) => timer.session === session);
    if (tiemposSesion.length < 12) return "N/A";

    const ultimosGrupo = tiemposSesion
      .slice(-12)
      .sort(
        (a, b) =>
          convertToMillisecondsFromString(b.time) -
          convertToMillisecondsFromString(a.time)
      );
    const tiemposFiltrados = ultimosGrupo.slice(1, 11);

    if (tiemposFiltrados.length === 10) {
      const promedio =
        tiemposFiltrados.reduce(
          (acc, curr) => acc + convertToMillisecondsFromString(curr.time),
          0
        ) / 10;
      return convertToTimeFormat(promedio);
    }

    return "N/A";
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {!activo && (
          <p
            className="scramble"
            style={{
              fontSize: "35px",
              maxWidth: "50%",
              wordWrap: "break-word",
            }}
          >
            {scramble}
          </p>
        )}
        <div className="cronometro">
          <p>
            {minutos < 10 ? `0${minutos}` : minutos} :{" "}
            {segundos < 10 ? `0${segundos}` : segundos} :{" "}
            {milisegundos < 10
              ? `00${milisegundos}`
              : milisegundos < 100
              ? `0${milisegundos}`
              : milisegundos}
          </p>
        </div>
      </div>
      <div className="sidebar bg-neutral-700 w-46">
        <h2>Tiempos Guardados</h2>
        <div>
          <div className="text-x1 font-bold">
            <label>Categoría: </label>
            <select
              className="text-black"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option className="text-black" value="2x2">
                2x2
              </option>
              <option className="text-black" value="3x3">
                3x3
              </option>
              <option className="text-black" value="4x4">
                4x4
              </option>
              <option className="text-black" value="5x5">
                5x5
              </option>
            </select>
          </div>

          <div>
            <h4>Promedio de 5</h4>
            <ul>
              {tiemposGuardados && tiemposGuardados.length > 0 && (
                <li>
                  <p>Tiempo: {getAverageOf5(tiemposGuardados, session)}</p>
                </li>
              )}
            </ul>
            <h4>Promedio de 12</h4>
            <ul>
              {tiemposGuardados && tiemposGuardados.length > 0 && (
                <li>
                  <p>Tiempo: {getAverageOf12(tiemposGuardados, session)}</p>
                </li>
              )}
            </ul>
            <h3>Mejor Tiempo</h3>
            <ul>
              {tiemposGuardados && tiemposGuardados.length > 0 && (
                <li>
                  <p>Tiempo: {getBestTime(tiemposGuardados, session)}</p>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div>
          <h3>Session</h3>
          <div>
            <button
              onClick={() => setSession(Math.max(session - 1, 1))}
              disabled={session <= 1}
            >
              Anterior
            </button>
            <input
              type="number"
              value={session}
              onChange={(e) => {
                let val = Math.floor(e.target.value);
                if (isNaN(val) || val <= 0) {
                  val = 1;
                }
                setSession(val);
              }}
              style={{
                fontSize: "20px",
                color: "white",
                fontWeight: "bold",
                background: "#374151",
                width: "50px",
                textAlign: "center",
              }}
              min={1}
            />
            <button onClick={() => setSession(session + 1)}>Siguiente</button>
          </div>
        </div>
        <ul>
          {tiemposGuardados
            .filter((timer) => timer.session === session)
            .reverse()
            .map((timer, index) => (
              <li
                key={index}
                onClick={() => handleTimeClick(timer.time, timer.scramble)}
              >
                <p>Tiempo: {timer.time}</p>
                {expandedScramble === timer.scramble && (
                  <p>Scramble: {timer.scramble}</p>
                )}
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}

export default TimerUserLoged;
