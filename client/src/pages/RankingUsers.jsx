import { useState, useEffect } from "react";
import { useAuthTimer } from "../context/TimerContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { addRankRequest } from "../api/rank.js";
import { verifyTokenRequest } from "../api/auth.js";

const RankingUsers = () => {
  const { createNewTimer, getTimersContext, deleteTimerBySession } =
    useAuthTimer();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [session] = useState(200);
  const [scramble, setScramble] = useState("");
  const [rank, setRank] = useState(0);
  const { handleSubmit } = useForm();
  const [milisegundos, setMilisegundos] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [minutos, setMinutos] = useState(0);
  const [activo, setActivo] = useState(false);
  const [tiempoInicial, setTiempoInicial] = useState(null);
  const [tiemposGuardados, setTiemposGuardados] = useState([{}]);
  const [tiempoAverage, setTiempoAverage] = useState("N/A");
  const [currentUser, setCurrentUser] = useState(null);
  const [hasRegisteredRank, setHasRegisteredRank] = useState(false);

  useEffect(() => {
    generateNewScramble();
  }, []);

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
    const fetchUser = async () => {
      try {
        const { data } = await verifyTokenRequest();
        setCurrentUser(data);
        console.log("Usuario actual:", currentUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [user]);

  const generateNewScramble = () => {
    const movimientos = ["R", "L", "U", "D", "F", "B"];
    const modificadores = ["", "'", "2"];
    let nuevoScramble = "";
    let ultimoMovimiento = "";

    for (let i = 0; i < 21; i++) {
      let movimientoAleatorio =
        movimientos[Math.floor(Math.random() * movimientos.length)];
      let modificadorAleatorio =
        modificadores[Math.floor(Math.random() * modificadores.length)];

      while (movimientoAleatorio === ultimoMovimiento) {
        movimientoAleatorio =
          movimientos[Math.floor(Math.random() * movimientos.length)];
      }

      nuevoScramble += movimientoAleatorio + modificadorAleatorio + " ";
      ultimoMovimiento = movimientoAleatorio;
    }

    setScramble(nuevoScramble.trim());
  };
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

  function generarNuevoScramble() {
    const movimientos = ["R", "L", "U", "D", "F", "B"];
    const modificadores = ["", "'", "2"];

    let nuevoScramble = "";
    let ultimoMovimiento = "";

    for (let i = 0; i < 20; i++) {
      let movimientoAleatorio =
        movimientos[Math.floor(Math.random() * movimientos.length)];
      let modificadorAleatorio =
        modificadores[Math.floor(Math.random() * modificadores.length)];

      while (movimientoAleatorio === ultimoMovimiento) {
        movimientoAleatorio =
          movimientos[Math.floor(Math.random() * movimientos.length)];
      }

      nuevoScramble += movimientoAleatorio + modificadorAleatorio + " ";
      ultimoMovimiento = movimientoAleatorio;
    }

    setScramble(nuevoScramble.trim());
  }

  function registrarTiempo() {
    if (tiempoInicial && !hasRegisteredRank) {
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
    }
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

      const promedio2 = convertToTimeFormat(promedio);
      return promedio2;
    }

    return "N/A";
  }

  useEffect(() => {
    if (tiemposGuardados.length === 12) {
      const calculatedAverage = getAverageOf12(tiemposGuardados, session);
      setTiempoAverage(calculatedAverage);
      console.log("Promedio", calculatedAverage);
  
      const [minutos, segundos, milisegundos] = calculatedAverage.split(":").map(Number);
      const tiempoEnMilisegundos = minutos * 60 * 1000 + segundos * 1000 + milisegundos;
  
      let calculatedRank;
      if (tiempoEnMilisegundos >= 50 && tiempoEnMilisegundos <= 10000) {
        calculatedRank = 1; // Gold
      } else if (tiempoEnMilisegundos >= 11000 && tiempoEnMilisegundos <= 15000) {
        calculatedRank = 2; // Silver
      } else if (tiempoEnMilisegundos >= 16000 && tiempoEnMilisegundos <= 20000) {
        calculatedRank = 3; // Bronze
      } else if (tiempoEnMilisegundos >= 21000 && tiempoEnMilisegundos <= 25000) {
        calculatedRank = 4; // Coal
      } else if (tiempoEnMilisegundos >= 26000 && tiempoEnMilisegundos <= 30000) {
        calculatedRank = 5; // Wood
      } else if (tiempoEnMilisegundos >= 31000 && tiempoEnMilisegundos <= 35000) {
        calculatedRank = 6; // Plastic
      } else if (tiempoEnMilisegundos >= 36000 && tiempoEnMilisegundos <= 180000) {
        calculatedRank = 7; // Junior
      } else {
        calculatedRank = 0; // N/A
      }
  
      setRank(calculatedRank);
  
      if (calculatedAverage !== "N/A") {
        addRank(calculatedRank, calculatedAverage);
        setHasRegisteredRank(true);

      }
    }
  }, [tiemposGuardados, currentUser]);
  
  const addRank = async (calculatedRank, calculatedAverage) => {
    try {
      await addRankRequest(currentUser._id, calculatedRank, calculatedAverage);
    } catch (error) {
      console.error('Error al añadir el rango:', error);
    }
  };

  const handleDelete = handleSubmit(async () => {
    deleteTimerBySession(session);
    navigate("/timerpvp");
  });

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

  return (
    <div>
      <h1>Ranking de Usuarios</h1>
      {tiemposGuardados && tiemposGuardados.length > 0 && (
        <li>
          <p>Tiempo: {getAverageOf12(tiemposGuardados, session)}</p>
        </li>
      )}
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
              fontSize: "40px",
              maxWidth: "60%",
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
        <p>{rank}</p>
        <button onClick={handleDelete}> Borrar</button>
      </div>
    </div>
  );
};

export default RankingUsers;
