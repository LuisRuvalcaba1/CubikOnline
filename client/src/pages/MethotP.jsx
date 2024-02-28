import "./Aprendizaje.css";
import Posicion_cruz from "../images/Posicion_de_la_cruz.png"; 
import mov1  from "../images/mov1.png";
import mov2  from "../images/mov2.png";
import mov3  from "../images/mov3.png";
import mov1_arista from "../images/mov1_arista.png";
import mov2_arista from "../images/mov2_arista.png";

function MetodoP(){
    return (
        <div className="container">
            <div className="content">
                <h2 className="title">
                    Método de las capas
                </h2>

                <a className="description">
                En esta primera capa vamos a comenzar 
                por la cara blanca (aunque, como ya se 
                ha mencionado,se puede comenzar por 
                cualquier cara). Lo primero que tenemos 
                que hacer es una cruz blanca, teniendo 
                en cuenta que tendremos que respetar el 
                color de los centros adyacentes. 
                Este paso no requiere ningún algoritmo 
                específico, es algo intuitivo que solo 
                necesita un poco de práctica para 
                entender cómo se mueven las diferentes 
                piezas por el cubo. En la siguiente 
                ilustración se refleja lo que tenemos 
                que conseguir.
                </a>
                <img src={Posicion_cruz} alt="" />
                <div className="fila">
                    <div className="movement">
                        <img src={mov1} alt="" />
                        <p className="description">U&apos; R&apos; U F&apos;</p>
                    </div>
                    <div className="movement">
                        <img src={mov2} alt="" />
                        <p className="description">F&apos; U&apos; R U</p>
                    </div>
                    <div className="movement">
                        <img src={mov3} alt="" />
                        <p className="description">U&apos; R U</p>
                    </div>
                </div>

                <div className="fila2">
                    <p className="description"></p>
                    <p className="description"></p>
                    <p className="description"></p>
                </div>

                <h2 className="title">Resolver esquinas</h2>
                <a className="description">
                Una vez que hayamos completado la cruz blanca 
                en el cubo de Rubik, el siguiente paso 
                consistirá en insertar las esquinas que 
                contienen el color blanco en su posición 
                correcta para finalizar la primera capa. 
                Es decir, en esta etapa nos enfocaremos 
                exclusivamente en aquellas esquinas que poseen 
                una de sus caras de color blanco. 
                Este procedimiento es relativamente simple, 
                ya que solo existen cinco posibles situaciones 
                que podemos resolver utilizando el mismo 
                algoritmo.
                </a>
                <h2 className="title">Acomodo de aristas</h2>
                <a className="description">
                Ahora vamos a por la capa central. Como ya hemos terminado 
                la primera capa la ponemos mirando hacia abajo. En este punto 
                la cosa se complica un poco, pero con práctica te resultará más fácil.

                Para este caso tenemos que aprender dos sencillos algoritmos. Para llevarlos 
                a cabo,buscaremos una arista que no tenga el color amarillo y la ponemos de 
                forma que el color de la arista coincida con el color del centro.
                </a>

                <div className="fila">
                    <div className="movement">
                        <img src={mov1_arista} alt="" />
                        <p className="description">U R U&apos; R&apos; U&apos; F&apos; U F</p>
                    </div>
                    <div className="movement">
                        <img src={mov2_arista} alt="" />
                        <p className="description">U&apos; L&apos; U L U F U&apos; F&apos;</p>
                    </div>
                </div>

                <a className="description">
                Nos podemos encontrar un caso en el que una arista 
                está en su sitio pero mal orientada. En esa situación lo 
                que tenemos que hacer es sacar esa pieza. Para ello, debemos 
                aplicar alguno de los algoritmos que acabamos de explicar. 
                Con esto lo que estamos consiguiendo es meter otra pieza en 
                su lugar y una vez que tenemos esa pieza fuera la insertamos 
                en su posición correcta.
                </a>

                <h2 className="title">Resolver la última capa</h2>
                <div className="description">
                En este paso vamos a hacer una cruz en la cara amarilla 
                pero no te preocupes si los colores laterales no coinciden con 
                los colores del centro de la cara, eso lo arreglaremos en el próximo paso.

                Nos podemos encontrar con cuatro casos y todos ellos los vamos 
                a solucionar con el mismo algoritmo. Aunque no sea la solución más 
                eficiente, es la más sencilla, después podrás aprender el resto de 
                formas. Vamos a explicar los casos del más sencillo al más complicado:
                </div>

                <div className="description">
                    <div className="description">
                    1 - Lo primero que nos puede pasar es que la cruz ya la tengamos hecha. 
                    En este caso no hace falta que hagas nada, continua con el siguiente paso.
                    </div>
                    <div className="description">
                    2 - El segundo paso es muy sencillo. En esta ocasión tendremos una 
                    línea de color amarillo. Para hacer la cruz amarilla desde aquí, 
                    pondremos la línea amarilla de forma horizontal a nosotros y 
                    aplicaremos el algoritmo una sola vez.
                    </div>
                    <div className="description">
                    3 - Reconoceremos el tercer caso porque veremos una L amarilla. 
                    Para solucionar este caso cogeremos el cubo de forma que las aristas 
                    amarillas se queden en el fondo y en la izquierda. Una vez que lo tengamos así, 
                    aplicaremos el mismo algoritmo dos veces.
                    </div>
                    <div className="description">
                    4 - Último caso: &quot;el Punto&quot;. Este caso lo vamos a explicar de dos formas 
                    diferentes, una más eficiente y corta, (pero que implica girar la capa S) 
                    y otra más larga que puede que te resulte más sencilla 
                    al no llevar movimiento de la capa S.
                    </div>
                </div>

            </div>
        </div>
    );
}
    

export default MetodoP;