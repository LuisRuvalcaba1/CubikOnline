import "./Aprendizaje.css"
import Notacion from "../images/Notacion.png"
import Partes from "../images/Partes_rubik.png"
import Capas from "../images/Capas.png"
import { Link } from "react-router-dom";
function AprendizajePage(){

    return (  
    <div className="container">
        <div className="content">
            <h2 className="title">Introducción</h2>
                <a className="description">
                El Cubo de Rubik fue inventado en 1974 por el profesor húngaro
                Erno Rubik. El propósito fue explicar a sus alumnos el concepto de volumen y
                espacio. Luego, este juego de ingenio se hizo tan famoso que fue lanzado 
                comercialmente. 
                El objetivo es restaurar el cubo a su condición original. Se debe
                rotar cada uno de sus lados para ir llevando cada pieza a su correcta ubicación,
                logrando, en cada cara, un único color. Con la Investigación Operativa y la 
                Simulación, 
                se planteó un modelo matemático para resolver un cubo 3x3x3 desarmado a partir de una mezcla y 
                algoritmos de resolución (Pensados como restricciones). 
                </a>

            <h2 className="title">Notación</h2>
                <a className="description">
                La notación de Rubik es un sistema de notación para representar movimientos en el cubo de Rubik. 
                Cada cara del cubo se representa con una letra, y los movimientos se indican con un símbolo. 
                Por ejemplo, la notación F indica que se debe girar la cara frontal en el sentido de las manecillas del reloj.
                </a>

                <img className="Notacion" src={Notacion} alt="Notacion"/>
            
            <a className="description">
            Cuando te encuentres la letra normal (U) quiere decir que el 
            giro se deberá hacer en sentido de las agujas del reloj y cuando 
            la letra lleve un apóstrofe (U’) el giro será antihorario. Podemos 
            encontrarnos con las siguientes:
            <a className="description2">U (Up): Capa Superior</a>
            <a className="description2">D (Down): Capa Inferior</a>
            <a className="description2">R (Right): Capa Derecha</a>
            <a className="description2">L (Left): Capa Izquierda</a>
            <a className="description2">F (Front): Capa Frontal</a>
            <a className="description2">B (Back): Capa Trasera</a>
            </a>
            
            <h2 className="title">Partes del cubo</h2>
            <img src={Partes} className="Partes" />

            <a className="description">
            En primer lugar, debemos conocer los diferentes tipos de piezas 
            que forman los cubos de rubik. En el caso del 3x3, al igual que en 
            todos los demás, está compuesto por tres tipos de piezas bien diferenciadas: 
            centros, aristas y esquinas. Tenemos que tener claro que cada tipo de pieza 
            solo puede estar en su posición. Es decir, por muchos movimientos que hagamos, 
            nunca podremos poner una esquina en la posición de una arista.
                <a className="description2">
                Centros: los centros de un cubo de rubik son piezas que nunca se mueven, es decir, 
                no varían su posición. Éstos están fijos en el centro de cada cara y marcan el color 
                de la misma. Cada cubo tiene 6 centros.</a>
                <a className="description2">Aristas: el cubo 3x3 tiene 12 aristas. Se sitúan entre los vértices y están formadas por 
                dos colores.
                Esquinas: tendremos un total de 8 esquinas y cada una se compone de tres colores 
                diferentes.
                </a>
            Resumiendo, en total tenemos 26 piezas, de las que 20 son móviles (aristas y esquinas). 
            Las 6 restantes, como hemos señalado anteriormente, son los centros y nos indicarán el
            color del que tenemos que formar cada cara.
            </a>

            <h2 className="title">Capas del cubo de rubik</h2>
            <img src={Capas} className="Capas" />
            <a className="description">
            Como hemos comentado al principio de este tutorial, 
            en el método para resolver un cubo de rubik 3x3 para principiantes, 
            haremos una resolución por capas. 
            Estos cubos se componen de tres capas: superior, central e inferior. 
            Vamos a conocer brevemente lo que tenemos que hacer en cada una de ellas.
            <a className="description2">- En la capa superior (que normalmente comenzamos
            por la cara blanca, aunque se puede comenzar por cualquier otra) 
            tenemos que hacer primero la cruz y después meter las esquinas 
            en su posición correcta.</a>
            <a className="description2">- En la capa central tendremos que buscar 
            las aristas que van en esta capa y mediante un sencillo algoritmo, 
            colocarlas en su posición correcta.</a>
            <a className="description2">- En la última capa del cubo de rubik 
            tendremos que repetir el proceso que hemos hecho en la primera capa,
            pero ejecutando una serie de algoritmos para no desmontar la 
            parte que ya tenemos hecha.</a>
            </a>
            
            <h2 className="cambio">
                <Link to="/metodop" replace>Metodo principiante</Link>
            </h2>
        </div>
        
    </div>
    )
}

export default AprendizajePage;