import Notacion from "../images/Notacion.png";
import Partes from "../images/Partes_rubik.png";
import Capas from "../images/Capas.png";
import "./Aprendizaje.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { removeTokenRequest } from "../api/auth";
import { useAuthTorneo } from "../context/TorneoContext";

function AprendizajePage() {
  const { user, logout, statusChangeAuth } = useAuth();
  const { deleteTorneoByJuez } = useAuthTorneo();

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

  return (
    <div className="contenedor mb-4" id="cont">
      <div className="contenedor mb-3">
        <h2 className="titulo font-bold">Introducción</h2>
        <p className="texto font-bold">
          El Cubo de Rubik fue inventado en 1974 por el profesor húngaro Erno
          Rubik. El propósito fue explicar a sus alumnos el concepto de volumen
          y espacio. Luego, este juego de ingenio se hizo tan famoso que fue
          lanzado comercialmente. El objetivo es restaurar el cubo a su
          condición original. Se debe rotar cada uno de sus lados para ir
          llevando cada pieza a su correcta ubicación, logrando, en cada cara,
          un único color. Con la Investigación Operativa y la Simulación, se
          planteó un modelo matemático para resolver un cubo 3x3x3 desarmado a
          partir de una mezcla y algoritmos de resolución (Pensados como
          restricciones).
        </p>

        <h2 className="titulo font-bold mb-4">Notación</h2>
        <p className="texto font-bold">
          La notación de Rubik es un sistema de notación para representar
          movimientos en el cubo de Rubik. Cada cara del cubo se representa con
          una letra, y los movimientos se indican con un símbolo. Por ejemplo,
          la notación F indica que se debe girar la cara frontal en el sentido
          de las manecillas del reloj.
        </p>

        <img className="imagen drop-shadow-lg" src={Notacion} alt="Notación" />

        <p className="texto font-bold">
          Cuando te encuentres la letra normal (U) quiere decir que el giro se
          deberá hacer en sentido de las agujas del reloj y cuando la letra
          lleve un apóstrofe (U’) el giro será antihorario. Podemos encontrarnos
          con las siguientes:
          <ul className="list-disc pl-6">
            <li>U (Up): Capa Superior</li>
            <li>D (Down): Capa Inferior</li>
            <li>R (Right): Capa Derecha</li>
            <li>L (Left): Capa Izquierda</li>
            <li>F (Front): Capa Frontal</li>
            <li>B (Back): Capa Trasera</li>
          </ul>
        </p>

        <h2 className="titulo font-bold">Partes del cubo</h2>
        <img className="imagen drop-shadow-lg" src={Partes} alt="Partes del cubo" />
        <p className="texto font-bold">
          En primer lugar, debemos conocer los diferentes tipos de piezas que
          forman los cubos de Rubik. En el caso del 3x3, al igual que en todos
          los demás, está compuesto por tres tipos de piezas bien diferenciadas:
          centros, aristas y esquinas. Tenemos que tener claro que cada tipo de
          pieza solo puede estar en su posición. Es decir, por muchos
          movimientos que hagamos, nunca podremos poner una esquina en la
          posición de una arista.
          <ul className="texto list-disc mb-4">
            <li className="mb-3 mt-2">
              Centros: los centros de un cubo de Rubik son piezas que nunca se
              mueven, es decir, no varían su posición. Éstos están fijos en el
              centro de cada cara y marcan el color de la misma. Cada cubo tiene
              6 centros.
            </li>
            <li className="mb-3">
              Aristas: el cubo 3x3 tiene 12 aristas. Se sitúan entre los
              vértices y están formadas por dos colores.
            </li>
            <li className="mb-3">
              Esquinas: tendremos un total de 8 esquinas y cada una se compone
              de tres colores diferentes.
            </li>
          </ul>
          Resumiendo, en total tenemos 26 piezas, de las que 20 son móviles
          (aristas y esquinas). Las 6 restantes, como hemos señalado
          anteriormente, son los centros y nos indicarán el color del que
          tenemos que formar cada cara.
        </p>

        <h2 className="titulo font-bold">Capas del cubo de Rubik</h2>
        <img className="imagen drop-shadow-2xl" src={Capas} alt="Capas del cubo de Rubik" />
        <p className="texto font-bold">
          Como hemos comentado al principio de este tutorial, en el método para
          resolver un cubo de Rubik 3x3 para principiantes, haremos una
          resolución por capas. Estos cubos se componen de tres capas: superior,
          central e inferior. Vamos a conocer brevemente lo que tenemos que
          hacer en cada una de ellas.
          <ul className="list-disc pl-6">
            <li className="mb-3 mt-2">
              En la capa superior (que normalmente comenzamos por la cara
              blanca, aunque se puede comenzar por cualquier otra) tenemos que
              hacer primero la cruz y después meter las esquinas en su posición
              correcta.
            </li>
            <li className="mb-3">
              En la capa central tendremos que buscar las aristas que van en
              esta capa y mediante un sencillo algoritmo, colocarlas en su
              posición correcta.
            </li>
            <li className="mb-3">
              En la última capa del cubo de Rubik tendremos que repetir el
              proceso que hemos hecho en la primera capa, pero ejecutando una
              serie de algoritmos para no desmontar la parte que ya tenemos
              hecha.
            </li>
          </ul>
        </p>

        <h2 className="titulo font-bold mb-4">
          <Link to="/metodop" replace className="text-white-500 underline">
            Metodo principiante
          </Link>
        </h2>
      </div>
    </div>
  );
}

export default AprendizajePage;
