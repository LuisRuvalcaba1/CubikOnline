import "./Aprendizaje.css";
import Posicion_cruz from "../../images/Posicion_de_la_cruz.png";
import mov1 from "../../images/mov1.png";
import mov2 from "../../images/mov2.png";
import mov3 from "../../images/mov3.png";
import mov1_arista from "../../images/mov1_arista.png";
import mov2_arista from "../../images/mov2_arista.png";
import caso_punto1 from "../../images/caso_punto1.png";
import caso_punto2 from "../../images/caso_punto2.png";
import caso_cruz_armada from "../../images/caso_cruz_armada.png";
import caso_L from "../../images/caso_l.png";
import caso_linea from "../../images/caso_linea.png";
import { Link } from "react-router-dom";
import orientar from "../../images/orientar_3x3.png";
function MetodoP() {
  return (
    <div className="contenedor" id="cont">
      <div className="contenedor">
        <h2 className="titulo font-bold">Método de las capas</h2>

        <p className="texto font-bold">
          En esta primera capa vamos a comenzar por la cara blanca (aunque, como
          ya se ha mencionado,se puede comenzar por cualquier cara). Lo primero
          que tenemos que hacer es una cruz blanca, teniendo en cuenta que
          tendremos que respetar el color de los centros adyacentes. Este paso
          no requiere ningún algoritmo específico, es algo intuitivo que solo
          necesita un poco de práctica para entender cómo se mueven las
          diferentes piezas por el cubo. En la siguiente ilustración se refleja
          lo que tenemos que conseguir.
        </p>
        <img className="card" src={Posicion_cruz} alt="" />

        <h2 className="titulo font-bold">Orientar aristas</h2>
        <div className="fila-container">
          <div className="fila-item1">
            <img className="fila-img" src={mov1} alt="" />
            <p className="texto font-bold">U&apos; R&apos; U F&apos;</p>
          </div>
          <div className="fila-item1">
            <img className="fila-img" src={mov2} alt="" />
            <p className="texto font-bold">F&apos; U&apos; R U</p>
          </div>
          <div className="fila-item1">
            <img className="fila-img" src={mov3} alt="" />
            <p className="texto font-bold">U&apos; R U</p>
          </div>
        </div>

        <h2 className="titulo font-bold">Resolver esquinas</h2>
        <p className="texto font-bold">
          Una vez que hayamos completado la cruz blanca en el cubo de Rubik, el
          siguiente paso consistirá en insertar las esquinas que contienen el
          color blanco en su posición correcta para finalizar la primera capa.
          Es decir, en esta etapa nos enfocaremos exclusivamente en aquellas
          esquinas que poseen una de sus caras de color blanco. Este
          procedimiento es relativamente simple, ya que solo existen cinco
          posibles situaciones que podemos resolver utilizando el mismo
          algoritmo.
        </p>
        <h2 className="titulo font-bold">Acomodo de aristas</h2>
        <p className="texto font-bold">
          Ahora vamos a por la capa central. Como ya hemos terminado la primera
          capa la ponemos mirando hacia abajo. En este punto la cosa se complica
          un poco, pero con práctica te resultará más fácil. Para este caso
          tenemos que aprender dos sencillos algoritmos. Para llevarlos a
          cabo,buscaremos una arista que no tenga el color amarillo y la ponemos
          de forma que el color de la arista coincida con el color del centro.
        </p>

        <div className="fila-container">
          <div className="fila-item1 ">
            <img className="fila-img" src={mov1_arista} alt="" />
            <p className="texto font-bold">
              U R U&apos; R&apos; U&apos; F&apos; U F
            </p>
          </div>
          <div className="fila-item1">
            <img className="fila-img" src={mov2_arista} alt="" />
            <p className="texto font-bold">
              U&apos; L&apos; U L U F U&apos; F&apos;
            </p>
          </div>
        </div>

        <p className="texto font-bold">
          Nos podemos encontrar un caso en el que una arista está en su sitio
          pero mal orientada. En esa situación lo que tenemos que hacer es sacar
          esa pieza. Para ello, debemos aplicar alguno de los algoritmos que
          acabamos de explicar. Con esto lo que estamos consiguiendo es meter
          otra pieza en su lugar y una vez que tenemos esa pieza fuera la
          insertamos en su posición correcta.
        </p>

        <h2 className="titulo font-bold">Resolver la última capa</h2>
        <div className="texto font-bold">
          En este paso vamos a hacer una cruz en la cara amarilla pero no te
          preocupes si los colores laterales no coinciden con los colores del
          centro de la cara, eso lo arreglaremos en el próximo paso. Nos podemos
          encontrar con cuatro casos y todos ellos los vamos a solucionar con el
          mismo algoritmo. Aunque no sea la solución más eficiente, es la más
          sencilla, después podrás aprender el resto de formas. Vamos a explicar
          los casos del más sencillo al más complicado:
        </div>

        <div className="texto mt-3 font-bold mb-4">
          <li className="texto">
            Lo primero que nos puede pasar es que la cruz ya la tengamos hecha.
            En este caso no hace falta que hagas nada, continua con el siguiente
            paso.
          </li>
          <li className="texto">
            El segundo paso es muy sencillo. En esta ocasión tendremos una línea
            de color amarillo. Para hacer la cruz amarilla desde aquí, pondremos
            la línea amarilla de forma horizontal a nosotros y aplicaremos el
            algoritmo una sola vez.
          </li>
          <li className="texto">
            Reconoceremos el tercer caso porque veremos una L amarilla. Para
            solucionar este caso cogeremos el cubo de forma que las aristas
            amarillas se queden en el fondo y en la izquierda. Una vez que lo
            tengamos así, aplicaremos el mismo algoritmo dos veces.
          </li>
          <li className="texto">
            Último caso: &quot;el Punto&quot;. Este caso lo vamos a explicar de
            dos formas diferentes, una más eficiente y corta, (pero que implica
            girar la capa S) y otra más larga que puede que te resulte más
            sencilla al no llevar movimiento de la capa S.
          </li>
        </div>

        <div className="fila-container">
          <div className="fila-item1 ">
            <img className="fila-img" src={caso_cruz_armada} alt="" />
            <p className="texto font-bold">Cruz Armada</p>
          </div>
          <div className="fila-item1">
            <img className="fila-img" src={caso_linea} alt="" />
            <p className="texto font-bold">F R U R&apos; U&apos; F&apos;</p>
          </div>
          <div className="fila-item1">
            <img className="fila-img" src={caso_L} alt="" />
            <p className="texto font-bold">
              F R U R&apos; U&apos; F&apos; (x2)
            </p>
          </div>
          <div className="fila-item1">
            <img className="fila-img" src={caso_punto1} alt="" />
            <p className="texto font-bold">
              F R U R&apos; U&apos; F&apos; U2 F R U R&apos; U&apos; F&apos;
              (x2)
            </p>
          </div>
          <div className="fila-item1">
            <img className="fila-img" src={caso_punto2} alt="" />
            <p className="texto font-bold">
              F R U R&apos; U&apos; S R U R&apos; U&apos; f&apos;
            </p>
          </div>
        </div>

        <h2 className="titulo font-bold mb-4">
          <div>
            <div>
              <Link
                to="/learn"
                replace
                className="text-white-500 hover:text-white-700 transition-colors mr-4"
              >
                &#8592;
              </Link>
              <span>Método Friedrich</span>
              <Link
                to="/metodof"
                replace
                className="text-white-500 hover:text-white-700 transition-colors ml-4"
              >
                &#8594;
              </Link>
            </div>
          </div>
        </h2>
      </div>
    </div>
  );
}

export default MetodoP;
