import "./Aprendizaje.css";

function Metodo4x4Page() {
  return (
    <div className="contenedor" id="cont">
      <div className="contenedor">
        <h1>Método 4x4</h1>
        <h2>Piezas del cubo de rubik 4x4</h2>

        <p>
          Del mismo modo que el cubo de rubik 3x3, el cubo 4x4 se compone
          también de centros, aristas y esquinas. Sin embargo, encontramos
          algunas diferencias: cada centro está compuesto por 4 piezas, las
          aristas por 2 y la esquina será solo una. En total tendremos:
        </p>
        <ul>
          <li>24 piezas centrales</li>
          <li>24 piezas que compondran las 12 aristas</li>
          <li>8 esquinas</li>
        </ul>
        <p>
          A diferencia de lo que ocurre con los centros en el cubo 3x3, en el
          4x4 Los centros no son fijos. Por lo tanto,debemos tener muy claro
          cuál es su posición correcta para no tener s problemas con su
          resolución.
        </p>
        <h2>Caras del cubo 4x4</h2>
        <p>
          ¿Te has fijado en el color de las caras?? Del mismo modo que en el
          cubo de rubik 3x3 encontramos 6 colores, opuestos entre sí. El opuesto
          del blanco será el amarillo; el opuesto del rojo el naranja y el
          opuesto del verde el azul.
        </p>
        <p>
          Recuerda que, para resolver cualquier cubo de rubik debemos tener
          siempre una cara de referencia que, en nuestro caso, será la blanca.
          De este modo, si cogemos el cubo con la cara blanca hacia arriba, el
          color que queda a nuestra derecha es el rojo, cuyo opuesto, como hemos
          mencionado anteriormente, es el naranja. Esta es la combinación de
          colores estándar y es la que encontraremos en la mayoría de los cubos.
        </p>
        <h2>Notacion para el cubo 4x4</h2>
        <p>
          Para realizar el cubo de rubik de 4x4 será necesario saber algo de
          notación, puesto que lo más probable es que nos aparezcan casos de
          paridades que se resolverán aplicando ciertos algoritmos. Para
          ejecutar estos algoritmos deberemos saber qué significa cada
          movimiento. Podemos encontrarnos con:
        </p>
        <ul>
          <li>U (Up): Capa Superior</li>
          <li>D (Down): Capa Inferior</li>
          <li>R (Right): Capa Derecha</li>
          <li>L (Left): Capa Izquierda</li>
          <li>F (Front): Capa Frontal</li>
          <li>B (Back): Capa Trasera</li>
        </ul>

        <h2>Giro de capas internas del cubo 4x4</h2>
        <p>
          En el cubo de rubik 4x4 nos encontramos con la particularidad de que
          podemos girar capas internas. Esto quiere decir que, además de girar
          las capas exteriores, también podemos girar las capas centrales. Para
          ello, deberemos tener en cuenta que, si giramos una capa interna, la
          capa exterior que se encuentra en la misma dirección también girará.
        </p>
        {/*Imagenes de los giros de las capas internas */}

        <h2>Pasos para resolver el cubo 4x4</h2>
        <p>
          El primer paso será el de resolver los centros del cubo 4x4. Para
          ello, vamos a olvidarnos del resto del cubo pues, las piezas centrales
          solo se moverán en los centros, es decir no ocuparán otra
          posición.Deberemos ir agrupando colores de forma que hagamos todos los
          centros. Debemos tener en cuenta, tal y como acabamos de explicar en
          el apartado anterior, la posición de los colores.
        </p>
        <p>
          Para hacer los centros no hay un algoritmo específico, se hace por
          intuición. No te desesperes, aunque tardes mucho en juntar las
          piezas...¡acabarás lográndolo! Iremos haciendo líneas de dos piezas
          del mismo color y las colocaremos en vertical a nosotros para no
          romperlas cuando giremos el cubo. Vamos a verlo detenidamente.
        </p>
        <h2>Primer centro</h2>
        <p>
          El primer centro que realizaremos será el blanco.el más sencillo de
          hacer, puesto que no vamos a romper nada que ya tengamos hecho, ni
          tenemos que construirlo en ningún lugar en especial. En este paso
          simplemente tendremos que agrupar las cuatro piezas centrales blancas.
          Para ello haremos dos líneas blancas emparejando las piezas de dos en
          dos (cada 2 piezas formarán una línea) y las juntaremos en el mismo
          centro.
        </p>
        <h2>Segundo centro</h2>
        <p>
          Nosotros te recomendamos que el siguiente centro que hagas después del
          blanco sea su opuesto, es decir, el amarillo.
        </p>
        <p>
          Para resolver este centro seguiremos el mismo método que en el centro
          anterior. Sin embargo,ahora debemos tener en cuenta que, si hacemos
          algún movimiento que modifique las piezas de la cara blanca que hemos
          puesto anteriormente,tendremos que recuperar ese giro después de
          emparejar las piezas que queramos unir formando una línea. Por
          ejemplo, si subo la cara derecha para juntar dos piezas amarillas,
          tras este movimiento, deberé proteger las dos piezas que he unido y
          devolver el giro de la capa derecha para recuperar el centro blanco.
        </p>
        <p>
          Posteriormente, deberemos insertar la línea en el centro
          correspondiente. Por ejemplo, tenemos una línea amarilla en una cara
          lateral y queremos subirla a la cara opuesta al blanco. Lo primero que
          debemos hacer es, con el centro blanco abajo, poner la línea de forma
          vertical a nuestra vista, subir el centro a la capa superior, proteger
          girando la capa dos veces y devolver el primer movimiento. Lo verás
          más claro en la siguiente imagen.
        </p>
        <p>
          No te preocupes por rotar las capas exteriores, no destruirán lo que
          tenemos ya hecho.
        </p>
        <p>
          Ya tenemos la primera línea en el centro opuesto. Ahora realizaremos
          la segunda emparejando los colores y, para subirla, haremos el mismo
          algoritmo que en el apartado anterior, pero la pondremos debajo de la
          línea que ya tenemos hecha (línea por línea), de manera que cuando
          giremos la capa superior dos veces y devolvamos el movimiento, el
          centro se quede hecho. Lo verás mejor en la siguiente imagen.
        </p>
        <h2>Tercer centro</h2>
        <p>
          Una vez que hemos hecho los dos primeros centros, colocamos el cubo de
          lado, de manera que se queden a nuestra derecha e izquierda el color
          blanco y amarillo, respectivamente.
        </p>
        <p>
          El tercer centro que hagamos podría ser cualquiera. El que veamos que
          tenemos más fácil de construir. Si todos te parecen difíciles ponte un
          objetivo y olvídate del resto. Por ejemplo empieza por el azul.
          Empareja dos piezas azules y luego otras dos, de manera que tengas dos
          líneas; recuerda poner las líneas hechas en vertical a tu vista, para
          no romperlas cuando gires el cubo. Posteriormente, sitúalas en el
          mismo centro.
        </p>
        <p>
          Aún no tenemos que preocuparnos por la posición de los colores, éste
          es el primero.
        </p>
        <p>
          Para ésto no hay algoritmos, es simple intuición. No te preocupes, con
          la práctica lo verás todo mucho más sencillo.
        </p>
        <h2>Cuarto centro</h2>
        <p>
          Llegado a este punto sí tenemos que considerar la posición de los
          colores. Debes tener en cuenta cuál has construido para colocar los
          siguientes centros en su correcta posición. Por ejemplo, si has
          construido el azul, debes tener en cuenta que, con la cara blanca
          hacia arriba, a su izquierda va el rojo y a su derecha el naranja.
        </p>
        <p>En este caso vamos a hacer el centro rojo.</p>
        <p>
          Volvemos a poner el cubo de forma que el centro blanco y amarillo
          queden a nuestra derecha e izquierda.
        </p>
        <p>
          Buscamos dos piezas rojas de manera que podamos hacer una línea. No os
          preocupéis por rotar las capas externas. No romperán nada que tengamos
          hecho, al contrario que ocurre con las internas.
        </p>
        <p>
          Realizamos la primera línea y la llevamos a su posición correcta junto
          al color azul. Vamos a explicar como hacerlo más extensamente al final
          de este párrafo, pero resumiendo: con el centro blanco a nuestra
          derecha y la línea roja a nuestra izquierda,subimos la línea derecha
          azul de forma que quede un centro por debajo de dónde se encuentra la
          línea roja. Después, giramos la capa donde se encuentra la línea roja,
          de manera que su posición sea línea junto a línea y devolvemos el
          centro azul. Ahora tendremos el centro azul otra vez construido y una
          línea roja en su posición correcta.
        </p>
        <p>
          Al colocar las líneas en el cuarto centro nos podemos encontrar con
          tres casos:{" "}
        </p>
        <ul>
          <li>
            Primer caso: la línea roja se encuentra en el centro que le
            corresponde. Simplemente gira la capa exterior para dejarla a tu
            izquierda y pasa al siguiente paso.
          </li>
          <li>
            Segundo caso: la línea roja está en la cara opuesta a la azul. En
            esta situación el algoritmo a seguir sería (con el centro blanco a
            nuestra derecha):
          </li>
          <ul>
            <li>Coloca la linea roja a tu izquierda</li>
            <li>
              Realiza el algoritmo: Rw, B2, Rw&apos;. Dónde Rw sube la línea
              derecha azul un centro por encima; B2 gira la línea roja de
              izquierda a derecha, para ponerla junto a la azul y Rw&apos;
              devuelve el movimiento de la línea azul y a su vez baja la roja a
              su posición. Cuando esté en su centro, gira la capa dónde se
              encuentra la línea roja para colocarla a nuestra izquierda (U2).
            </li>
          </ul>
          <li>
            Tercer caso: si la línea roja se encuentra situada junto a la cara
            azul pero en el centro que corresponde al centro naranja, deberemos
            hacer el mismo algoritmo que en el caso anterior. Sin embargo,en
            esta ocasión, en vez de girar la capa derecha una vez, lo haremos
            dos veces. Rw2, B2, Rw2, U2.
          </li>
        </ul>

        <p>
          Para colocar la línea que falta haremos lo mismo, con cuidado de ir
          protegiendo y devolviendo los movimientos que impliquen romper algún
          centro que tengamos hecho. Una vez formada la línea utilizamos el
          algoritmo que hemos hecho con la primera línea.
        </p>
        <p>Por si no te acuerdas bien, te recordamos cómo era ese algoritmo:</p>
        <p>
          Con el centro blanco a nuestra derecha: Colocamos la línea roja a
          nuestra izquierda en la capa que se encuentre, subimos la línea
          derecha azul (una o dos veces, dependiendo de dónde se encuentre la
          línea roja -debe quedar un centro por debajo de nuestra línea roja-),
          giramos la capa de la línea roja dos veces para que quede línea con
          línea; y finalmente, devolvemos el movimiento.
        </p>

        <h2>Centros 5 y 6</h2>
        <p>
          Ya sólo nos quedan dos centros por hacer. Para resolver los dos
          últimos centros, haremos el verde y, por descarte, el naranja también
          quedará hecho. ¡Ánimo, pronto tendremos resuelto el cubo de rubik 4x4!
        </p>
        <p>
          Para hacer este centro, en primer lugar haremos una línea verde y
          posteriormente la introduciremos junto al centro rojo. Si ya está
          colocada en su posición correcta,haremos como anteriormente: lo
          ponemos a nuestra izquierda y formamos la siguiente fila verde.
        </p>
        <p>
          Sin embargo, nos encontramos con que está en el centro que corresponde
          al naranja, utilizamos el algoritmo que ya sabemos: Rw, B2, Rw&apos;.
          Dicho de otro modo, con el centro blanco a nuestra derecha y la línea
          verde en vertical a nuestra izquierda, subimos la capa derecha una
          vez, giramos dos veces dónde se encuentra la línea verde y devolvemos
          el primer movimiento. Una vez lo tengamos hecho, colocamos esta fila a
          nuestra izquierda y hacemos la siguiente línea.
        </p>
        <p>
          Si conseguimos que la última línea vuelva a su posición correcta a la
          primera... ¡genial, ya tenemos resueltos todos los centros!
        </p>
        <p>
          Si no es así, repetiremos los movimientos anteriores. Recuerda, . con
          el centro blanco a nuestra derecha y la línea verde en vertical a
          nuestra izquierda, subimos la capa derecha una vez, giramos dos veces
          dónde se encuentra la línea verde y devolvemos el primer movimiento.
          Apunta bien el algoritmo: Rw, B2, Rw&apos;.
        </p>
        <p>
          Y....¡Listo! Ya hemos hecho todos los centros. Veamos ahora cómo
          resolver las aristas.
        </p>
        <h2>Resolución de las aristas</h2>
        <p>
          Este paso es el más complicado, pues nos encontraremos las temidas
          paridades que caracterizan a los cubos pares, como es el caso del
          rubik 4x4. Pero no te preocupes, te guiaremos paso a paso para que
          consigas resolverlo.
        </p>
        <p>
          En primer lugar, para hacer las esquinas, es muy importante vamos a
          tener en cuenta que las buscaremos en sentido horizontal, no en
          vertical.
        </p>
        <p>
          Nuestro primer objetivo será encontrar dos aristas enfrentadas una a
          otra, pero de manera que no se encuentren en la misma línea; como
          mostramos en la siguiente imagen.
        </p>

        <p>
          Caso de aristas enfrentadas en distintas líneas[/caption] Si nos
          encontramos dos aristas pero en la misma posición (como en la
          siguiente imagen) debemos aplicar este algoritmo para solucionarlo:
          (R, U, R&apos;, U&apos;) F&apos;, U, F
        </p>
        <p>
          Tenemos dos aristas enfrentadas una a otra, pero de manera que no se
          encuentren en la misma línea, es decir, situadas a derecha e
          izquierda. En este caso realizaremos el siguiente algoritmo: (R, U,
          R&apos;, U&apos;) F&apos;, U, F.
        </p>

        <h2>Primeras aristas</h2>
        <p>Las primeras aristas son las más fáciles de resolver.</p>
        <p>
          Comenzaremos colocando el cubo en una posición de referencia, para que
          nos sea más cómodo de mover. Nuestra posición de referencia será la
          cara blanca hacia arriba y la amarilla hacia abajo. De esta forma, las
          aristas que iremos resolviendo estarán de forma horizontal a nosotros
          en el resto de caras del cubo.
        </p>
        <p>
          Para empezar, iremos guardando las aristas que vayamos haciendo en la
          cara blanca y amarilla. Esta parte es la más sencilla y poco a poco se
          irá complicando.
        </p>
        <p>
          Colocamos las aristas en el caso que anteriormente hemos explicado que
          nos interesa, una frente a la otra pero en líneas diferentes; las
          juntamos y subimos arriba para guardar. Lo haremos de la siguiente
          manera:
        </p>
        <ul>
          <li>
            Para juntar, sólo tendremos que girar las dos capas superiores o
            inferiores hacia un lado.
          </li>
          <li>
            Para subir giramos la capa exterior derecha o izquierda (depende de
            dónde tengamos la arista) hacia arriba; protegemos el movimiento y
            devolvemos.
          </li>
        </ul>
        <p>
          Depende de donde guardemos la arista, realizaremos un algoritmo u
          otro:
        </p>
        <p>A la derecha: Uw&apos;, R, U, R&apos;, Uw.</p>
        <p>A la izquierda: Dw&apos;, L&apos;, U, L, Dw</p>
        <p>
          En la siguiente imagen te mostramos un ejemplo de cómo sería si
          guardásemos la arista a la derecha con el algoritmo Uw&apos;, R, U,
          R&apos;, Uw
        </p>
        <p>
          Repetiremos estos mismos movimientos hasta que hagamos toda la capa
          del centro blanco con aristas que tengamos bien colocadas. Para ello
          cuando subamos, debemos procurar siempre bajar una arista que esté mal
          hecha.
        </p>
        <p>
          Cuando tengamos la capa superior con el centro blanco con cuatro
          aristas correctas hechas, voltearemos el cubo. e forma, ahora la capa
          del centro amarillo esté arriba y la del centro blanco abajo.
        </p>
        <p>
          Seguiremos haciendo aristas como hemos explicado y colocándolas en la
          capa superior (en este caso la del centro amarillo). No te preocupes
          por desarmar el cubo, como las aristas las vamos a seguir buscando en
          las capas centrales, no romperemos lo que ya tenemos hecho.
        </p>
        <p>
          Cuando completes las aristas de esta capa empezará lo más complicado.
          Ahora, relájate. Hazlo tranquilamente, tómate tu tiempo para buscar
          las piezas en la posición que te interesa e ir colocando las aristas
          y, sobre todo, no te rindas. Todo es cuestión de práctica.
        </p>
        <h2>Aristas centrales</h2>
      </div>
    </div>
  );
}

export default Metodo4x4Page;
