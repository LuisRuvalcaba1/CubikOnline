import React, { useState, useEffect } from "react";
import { useEncuesta } from "../context/EncuestaContext";
import { verifyTokenRequest } from "../api/auth.js";
import { useAuth } from "../context/AuthContext";

function EncuestaResult() {
  const {user} = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const {value} = useEncuesta();
  const { getEncuestas } = value;
  const [userEncuestas, setUserEncuestas] = useState([]);


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

  // Diccionario de algoritmos
  const algoritmos = {
    oll: {
      cruz: [
        "R U2 R' U' (R U R' U') R U' R'",
        "R U2 R2 U' R2 U' R2 U2 R",
        "L' U R U' L U R'",
        "R U' L' U R' U' L",
        "R2 D' R U2 R' D R U2 R",
        "r U R' U' r' F R F'",
        "R' F' L' F R F' L F"
      ],
      punto: [
        "R U2 R2 F R F' U2 R' F R F'",
        "F (R U R' U') F' f (R U R' U') f'",
        "M R U R' U r U2 r' U M'",
        "M U' r U2 r' U' R U' R2 r",
        "r' R U (R U R' U') r R2 F R F'",
        "F R U R' d R' U2 R' F R F'",
        "R U R' U R' F R F' U2 R' F R F'",
        "r' R U (R U R' U') r2 R2 U R U' r'"
      ],
      linea: [
        "R U R' U R d' R U' R' F'",
        "R U' y R2 D R' U2 R D' R2 d R'",
        "f (R U R' U') (R U R' U') f'",
        "F (R U R' U') x R U' L U R' U' r'"
      ],
      l: [
        "r U R' U R U' R' U R U2 r'",
        "R' F R' F' R2 U2 y R' F R F'",
        "F' L' U' L U L' U' L U F",
        "r' U' R U' R' U R U' R' U2 r",
        "R B' R B R2 U2 F R' F' R",
        "F (R U R' U') (R U R' U') F'"
      ],
      cuadrados: [
        "r U2 R' U' R U' r'",
        "l' U2 L U L' U l"
      ],
      relampagos: [
        "L F R' F R F2 L'",
        "U2 r R2 U' R U' R' U2 R U' M",
        "R U' R' U2 R U y R U' R' U' F'",
        "R2 U R' B' R U' R2 U l U l'",
        "r' U' R U' R' U2 r",
        "F' L' U' L U F U' F' L' U' L U F",
        "L' U L U2 L' U' y' L' U L U F",
        "L2 U' L B L' U L2 U' r' U' r"
      ],
      pez: [
        "F R U' R' U' R U R' F'",
        "L U2 L2 B L B' L U2 L'",
        "R' U' R y' x' R U' R F R U R'",
        "L U L' y x L' U L F' L' U' L"
      ],
      formaC: [
        "F' L' U' L y' R U' R' U2 R",
        "R U R2 U' R' F R U R U' F'"
      ],
      formaL: [
        "R' F R U R' F' R y L U' L'",
        "L' B' L R' U' R U L' B L",
        "L F' L' U' L F L' y' R' U R",
        "R B R' L U L' U' R B' R'"
      ],
      formaP: [
        "F U R U' R' F'",
        "L d R' d' L' U L F L'",
        "F' U' L' U L F",
        "R' d' L d R U' R' F' R"
      ],
      formaT: [
        "R U R' U' R' F R F'",
        "F R U R' U' F'"
      ],
      formaW: [
        "R U R' U R U' R' U' R' F R F'",
        "L' U' L U' L' U L U L F' L' F"
      ],
      formaZ: [
        "R' F (R U R' U') y L' d R",
        "L F' L' U' L U y' R d' L'"
      ],
      esquinasBienOrientadas: [
        "M' U' M U2 M' U' M",
        "L' (R U R' U') L R' F R F'"
      ]
    },
    pll: {
      basicos: [
        "U1: R U R' U R' U' R2 U' R' U R' U R",
        "U2: R' U R' U' R' U' R' U R U R2",
        "Z: M2 U' M2 U' M' U2 M2 U2 M' U2",
        "H: M2 U M2 U2 M2 U M2"
      ],
      avanzados: [
        "A1: R U R' F' r U R' U' r' F R2 U' R'",
        "A2: R U R2 F' r U R U' r' F R U' R'",
        "E: X' R U' R' D R U R' D' R U R' D R U' R' D'",
        "J: R U R' F' (R U R' U') R' F R2 U' R'",
        "L: R' U' R2 B R' U' R' U R B' R' U R",
        "T: (R U R' U') R' F R2 U' R' U' R U R' F'",
        "F: R' U' F' (R U R' U') R' F R2 U' R' U' R U R' U R",
        "Y: F R U' R' U' R U R' F' (R U R' U') R' F R F'",
        "V: R' U R' U' Y R' F' R2 U' R' U R' F R F",
        "R1: R' U2 R U2 R' F (R U R' U') R' F' R2",
        "R2: R U' R' U' R U R D R' U' R D' R' U2 R'",
        "N1: R U R' U R U R' F' (R U R' U') R' F R2 U' R' U2 R U' R'",
        "N2: R' U' R U2 R' U' R2 B R' U' R' U R B' R' U R U R' U R",
        "G1: R2 u R' U R' U' R u' R2 F' U F",
        "G2: F' U' F R2 u R' U R U' R u' R2",
        "G3: R2 F2 R U2 R U2 R' F (R U R' U') R' F R2",
"G4: R2 F' R U R U' R' F' R U2 R' U2 R' F2 R2"]
      }
    };

    useEffect(() => {
    const fetchUserEncuestas = async () => {
      if (currentUser) {
        try {
          const encuestas = await getEncuestas();
          const userEncuestas = encuestas.filter(
            (encuesta) => encuesta.user === currentUser._id
          );
          setUserEncuestas(userEncuestas);
          console.log("Encuestas del usuario:", userEncuestas);
        } catch (error) {
          console.error("Error fetching user encuestas:", error);
        }
      }
    };
    fetchUserEncuestas();
  }, [currentUser, getEncuestas]);

  return (
    <div>
      <h1>Encuesta Result</h1>
      <h2>Resultados de la encuesta</h2>
      
    </div>
  );
}

export default EncuestaResult;