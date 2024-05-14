import { get } from "mongoose";
import { useState, useEffect } from "react";

const RankingUsers = () => {
  const [solves, setSolves] = useState([]);
  const [scramble, setScramble] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [averageTime, setAverageTime] = useState("");
  const [rank, setRank] = useState("");
  const [milisegundos, setMilisegundos] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [minutos, setMinutos] = useState(0);
  const [activo, setActivo] = useState(false);
  const [tiempoInicial, setTiempoInicial] = useState(null);
  const [tiemposGuardados, setTiemposGuardados] = useState([]);

  useEffect(() => {
    generateNewScramble();
  }, []);

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

  useEffect(() => {
    function handleKeyPress(event) {
      if (event.keyCode === 32) {
        setActivo((prevActivo) => !prevActivo);
        if (!activo) {
          setTiempoInicial(performance.now());
        } else {
          console.log(tiemposGuardados.length);
          if (tiemposGuardados.length === 12) {
            setAverageTime(getAverageOf12(tiemposGuardados));
            setRank(getRank(averageTime));
            setShowResult(true);
          }
          else{
            registrarTiempo();
            generarNuevoScramble();
            
          }
        }
      }
    }

    function getRank(averageTime) {
      if (averageTime === "") {
        return "";
      }
      if (averageTime < "00:2:00") {
        console.log("entra");
        return "1";
      } else if (averageTime < "00:45:00") {
        console.log("entra2");
        return "2";
      } else if (averageTime < "01:00:00") {
        console.log("entra3");
        return "3";
      } else if (averageTime < "01:15:00") {
        console.log("entra4");
        return "4";
      } else if (averageTime < "01:30:00") {
        console.log("entra5");
        return "5";
      } else {
        console.log("entra6");
        return "6";
      }
    }


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

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [activo]);

  function registrarTiempo() {
    if (tiempoInicial) {
      const tiempoFinal = performance.now();
      const tiempoTranscurrido = tiempoFinal - tiempoInicial;
      const tiempoMilisegundos = Math.floor(tiempoTranscurrido % 1000);
      const tiempoSegundos = Math.floor((tiempoTranscurrido / 1000) % 60);
      const tiempoMinutos = Math.floor((tiempoTranscurrido / (1000 * 60)) % 60);

      const time = `${tiempoMinutos}:${
        tiempoSegundos < 10 ? "0" : ""
      }${tiempoSegundos}:${
        tiempoMilisegundos < 10 ? "00" : tiempoMilisegundos < 100 ? "0" : ""
      }${tiempoMilisegundos}`;

      setTiemposGuardados((prevTiemposGuardados) => [
        ...prevTiemposGuardados,
        { time },
      ]);
      console.log("Tiempos guardados:", tiemposGuardados);
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

  function getAverageOf12(tiempos) {
    if (tiempos.length < 12) {
      return "";
    }
    const last12 = tiempos.slice(-12);
    const last12Milliseconds = last12.map((tiempo) =>
      convertToMillisecondsFromString(tiempo.time)
    );
    const sortedTimes = last12Milliseconds.sort((a, b) => a - b);
    const bestTime = sortedTimes[0];
    const worstTime = sortedTimes[sortedTimes.length - 1];
    const total = sortedTimes.reduce((a, b) => a + b, 0) - bestTime - worstTime;
    const average = total / 10;
    return convertToTimeFormat(average);
  }

  return (
    <div>
      <h1>Ranking de Usuarios</h1>
      <p>Scramble: {scramble}</p>
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
      </div>
    </div>
  );
};

export default RankingUsers;
