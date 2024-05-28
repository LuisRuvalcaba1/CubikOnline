import "./Aprendizaje.css";
// import caso1Capa1 from "../images/caso1_capa1.png";
// import caso2Capa1 from "../images/caso2_capa1.png";
// import caso3Capa1 from "../images/caso3_capa1.png";
// import caso4Capa1 from "../images/caso4_capa1.png";
// import caso5Capa1 from "../images/caso5_capa1.png";
// import caso1Capa2 from "../images/caso1_capa2.png";
// import caso2Capa2 from "../images/caso2_capa2.png";

function Metodo2x2() {
  return (
    <div className="contenedor" id="cont">
      <div className="contenedor">
        <h2 className="titulo font-bold">Notacion del Cubo 2x2</h2>
        <p className="texto font-bold">
          Cuando te encuentres la letra normal (U) quiere decir que el giro se
          deberá hacer en sentido de las agujas del reloj y cuando la letra
          lleve un apóstrofe (U&apos;) el giro será antihorario. Podemos
          encontrarnos con las siguientes:
          <ul className="list-disc pl-6">
            <li className="texto font-bold">U (Up): Capa Superior</li>
            <li className="texto font-bold">D (Down): Capa Inferior</li>
            <li className="texto font-bold">R (Right): Capa Derecha</li>
            <li className="texto font-bold">L (Left): Capa Izquierda</li>
            <li className="texto font-bold">F (Front): Capa Frontal</li>
            <li className="texto font-bold">B (Back): Capa Trasera</li>
          </ul>
        </p>
        <h2 className="titulo font-bold">Parte superior del cubo 2x2</h2>
        <p className="texto font-bold">
          Si ya sabes resolver el 3x3 esta primera capa no te supondrá ningún
          problema: lo único que tenemos que hacer es colocar todas las piezas
          blancas en una misma capa, teniendo en cuenta que los colores de los
          laterales coincidan. En la ilustración de la izquierda podemos ver
          cómo quedaría. Si no sabes hacer el 3x3 a continuación te explicamos
          los casos que pueden salirte para resolver estas esquinas.
          Normalmente, empezamos a resolver el cubo completando la capa blanca,
          que la usaremos como capa superior. Céntrate en una esquina y úsala
          como referencia para construir ahí tu capa. Busca en el cubo la
          esquina que iría a su lado. Si por ejemplo has seleccionado la esquina
          blanca-verde-roja, deberás buscar o bien la blanca-verde-naranja, o la
          blanca-roja-azul. Es decir, deben tener dos colores en común. En el
          caso que hemos puesto, podríamos seleccionar el blanco, que como hemos
          mencionado anteriormente actuará de capa superior, el verde para
          situarla a un lado, o el rojo para colocarla al otro.
        </p>
        <h2 className="titulo font-bold">Posicionar esquinas</h2>
        <p className="texto font-bold">
          Para colocar las esquinas, podemos encontrarnos con diferentes
          situaciones. Todas se resuelven de una manera específica. A
          continuación, te vamos a explicar cada una de ellas, de modo que solo
          tendrás que ir fijándote en las diferentes esquinas que quieres
          colocar y hacer la secuencia de movimientos que corresponda a tu caso.
        </p>
        <p className="texto font-bold">
          1. Primer caso: en la capa inferior, debajo del lugar donde queremos
          que vaya nuestra pieza, tenemos una esquina en la que el color blanco
          se queda mirando hacia nosotros. Para ponerla en su posición correcta
          tenemos que hacer cuatro sencillos pasos, que podemos ver en la
          primera ilustración.
        </p>
        <p className="texto font-bold">
          2. Segundo caso: en esta ocasión, el color blanco se queda mirando
          hacia abajo. Del mismo modo que en caso anterior, posicionamos la
          esquina justo debajo de donde la queremos insertar y repetimos el
          mismo algoritmo que antes. Lo tenemos que repetir tres veces para que
          la esquina se coloque en su posición correcta.
        </p>
        <p className="texto font-bold">
          3. Tercer caso: puede ocurrir que la esquina se encuentre en su
          posición correcta, pero mal orientada, es decir, el color blanco se
          quede mirando hacia nosotros. Para cambiarla tenemos que aplicar el
          mismo algoritmo que en los casos anteriores, pero esta vez tenemos que
          repetirlo dos veces.
        </p>

        <p className="texto font-bold">
          4. Cuarto caso: nos encontramos una situación muy parecida a la del
          caso anterior; la diferencia es que el color blanco no está de frente
          a nosotros, sino que se queda hacia la derecha. Para arreglar esta
          pieza haremos el mismo algoritmo y repetirlo cuatro veces.
        </p>
        <p className="texto font-bold">
          5. Quinto caso: nos encontramos algo muy parecido al caso 1, pero el
          blanco en lugar de mirarnos a nosotros, se queda mirando hacia la
          derecha. En esta ocasión haremos un algoritmo aún más sencillo.
          También lo podemos resolver con el mismo algoritmo que en los otros
          casos pero tendríamos que aplicarlo cinco veces.
        </p>

        <h2 className="titulo font-bold">Resolver la ultima capa</h2>
        <h3 className="titulo font-bold">Orientar las piezas</h3>

        <p className="texto font-bold">
          Para resolver la última capa del cubo 2x2 primero deberemos poner toda
          la capa del mismo color utilizando un sencillo algoritmo. Si la
          primera capa que hemos hecho es la blanca, la capa que ahora
          buscaremos poner del mismo color es su opuesta, en este caso la
          amarilla. Deberemos colocar la capa ya hecha (la blanca) mirando hacia
          abajo y la amarilla, que es la que ahora queremos hacer, hacia arriba.
        </p>
        <p className="texto font-bold">
          Para colocar todas las piezas, con la cara amarilla mirando hacia
          arriba, tendremos que aplicar el siguiente algoritmo tantas veces como
          sea necesario para que la pieza amarilla se sitúe mirando hacia
          arriba: (R&apos; D&apos; R D). ¡OJO! Recuerda siempre devolver el
          último movimiento (D).
        </p>

        <p className="texto font-bold">
          Cuando la pieza amarilla esté mirando hacia arriba, giramos la capa
          superior en sentido horario (U) y volvemos a realizar el algoritmo
          anterior para volver a colocar la siguiente pieza. Así lo haremos con
          las cuatro piezas y si alguna está ya colocada, simplemente, vuelve a
          girar la capa superior en sentido horario (U).
        </p>

        <h3 className="titulo font-bold">Resolucion final</h3>

        <p className="texto font-bold">
          Primer caso: el cubo se ha resuelto. ¡Enhorabuena, ya has terminado!
        </p>
        <p className="texto font-bold">
          Segundo caso: nos aparecerán dos piezas adyacentes, bien colocadas y
          otras dos mal, tal y como se muestra en la siguiente imagen. Para
          solucionarlo deberemos colocar las piezas correctas a nuestra
          izquierda, como vemos en la imagen superior y aplicar el siguiente
          algoritmo: R U2 R&apos; U&apos; R U2 L&apos; U R&apos; U&apos; L
        </p>
        <p className="texto font-bold">
          Tercer caso: en esta ocasión, tendremos dos esquinas bien posicionadas
          y otras dos mal, como podemos ver a continuación:
        </p>
        <p className="texto font-bold">
          Para solucionar este último paso podemos utilizar el mismo algoritmo
          que antes dos veces, pero entre una y otra vez deberemos de girar la
          capa superior dos veces. Si solo nos queremos aprender un algoritmo de
          momento, podemos usar el algoritmo anterior. Lo utilizaremos una
          primera vez y como resultado obtendremos el Caso 2. Deberemos de girar
          la capa superior dos veces para colocar las piezas que se han ordenado
          en su correcta posición. Ahora volvemos a realizar el mismo algoritmo
          porque, en este punto estamos en el caso 2. El algoritmo es el
          siguiente: (R U2 R&apos; U&apos; R U2 L&apos; U R&apos; U&apos; L) U2
          (R U2 R&apos; U&apos; R U2 L&apos; U R&apos; U&apos; L)
        </p>
      </div>
    </div>
  );
}

export default Metodo2x2;
