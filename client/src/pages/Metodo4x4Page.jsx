import "./Aprendizaje.css";

function Metodo4x4Page() {
  return (
    <div className="contenedor" id="cont">
      <div className="contenedor">
        <h1 className="titulo font-bold">Método 4x4</h1>
        <h2 className="titulo font-bold">Piezas del cubo de rubik 4x4</h2>

        <p className="texto font-bold">
          Del mismo modo que el cubo de rubik 3x3, el cubo 4x4 se compone
          también de centros, aristas y esquinas. Sin embargo, encontramos
          algunas diferencias: cada centro está compuesto por 4 piezas, las
          aristas por 2 y la esquina será solo una. En total tendremos:
        </p>
        <ul className="texto mt-3 font-bold mb-4">
          <li className="texto">24 piezas centrales</li>
          <li className="texto">24 piezas que compondran las 12 aristas</li>
          <li className="texto">8 esquinas</li>
        </ul>
        <p className="texto font-bold">
          A diferencia de lo que ocurre con los centros en el cubo 3x3, en el
          4x4 Los centros no son fijos. Por lo tanto,debemos tener muy claro
          cuál es su posición correcta para no tener s problemas con su
          resolución.
        </p>
        <h2 className="titulo font-bold">Caras del cubo 4x4</h2>
        <p className="texto font-bold">
          ¿Te has fijado en el color de las caras?? Del mismo modo que en el
          cubo de rubik 3x3 encontramos 6 colores, opuestos entre sí. El opuesto
          del blanco será el amarillo; el opuesto del rojo el naranja y el
          opuesto del verde el azul.
        </p>
        <p className="texto font-bold">
          Recuerda que, para resolver cualquier cubo de rubik debemos tener
          siempre una cara de referencia que, en nuestro caso, será la blanca.
          De este modo, si cogemos el cubo con la cara blanca hacia arriba, el
          color que queda a nuestra derecha es el rojo, cuyo opuesto, como hemos
          mencionado anteriormente, es el naranja. Esta es la combinación de
          colores estándar y es la que encontraremos en la mayoría de los cubos.
        </p>
        <h2 className="titulo font-bold">Notacion para el cubo 4x4</h2>
        <p className="texto font-bold">
          Para realizar el cubo de rubik de 4x4 será necesario saber algo de
          notación, puesto que lo más probable es que nos aparezcan casos de
          paridades que se resolverán aplicando ciertos algoritmos. Para
          ejecutar estos algoritmos deberemos saber qué significa cada
          movimiento. Podemos encontrarnos con:
        </p>
        <ul className="texto mt-3 font-bold mb-4">
          <li className="texto">U (Up): Capa Superior</li>
          <li className="texto">D (Down): Capa Inferior</li>
          <li className="texto">R (Right): Capa Derecha</li>
          <li className="texto">L (Left): Capa Izquierda</li>
          <li className="texto">F (Front): Capa Frontal</li>
          <li className="texto">B (Back): Capa Trasera</li>
        </ul>

        <h2 className="titulo font-bold">
          Giro de capas internas del cubo 4x4
        </h2>
        <p className="texto font-bold">
          En el cubo de rubik 4x4 nos encontramos con la particularidad de que
          podemos girar capas internas. Esto quiere decir que, además de girar
          las capas exteriores, también podemos girar las capas centrales. Para
          ello, deberemos tener en cuenta que, si giramos una capa interna, la
          capa exterior que se encuentra en la misma dirección también girará.
        </p>
        {/*Imagenes de los giros de las capas internas */}

        <h2 className="titulo font-bold">Pasos para resolver el cubo 4x4</h2>
        <p className="texto font-bold">
          El primer paso será el de resolver los centros del cubo 4x4. Para
          ello, vamos a olvidarnos del resto del cubo pues, las piezas centrales
          solo se moverán en los centros, es decir no ocuparán otra
          posición.Deberemos ir agrupando colores de forma que hagamos todos los
          centros. Debemos tener en cuenta, tal y como acabamos de explicar en
          el apartado anterior, la posición de los colores.
        </p>
        <p className="texto font-bold">
          Para hacer los centros no hay un algoritmo específico, se hace por
          intuición. No te desesperes, aunque tardes mucho en juntar las
          piezas...¡acabarás lográndolo! Iremos haciendo líneas de dos piezas
          del mismo color y las colocaremos en vertical a nosotros para no
          romperlas cuando giremos el cubo. Vamos a verlo detenidamente.
        </p>
        <h2 className="titulo font-bold">Primer centro</h2>
        <p className="texto font-bold">
          El primer centro que realizaremos será el blanco.el más sencillo de
          hacer, puesto que no vamos a romper nada que ya tengamos hecho, ni
          tenemos que construirlo en ningún lugar en especial. En este paso
          simplemente tendremos que agrupar las cuatro piezas centrales blancas.
          Para ello haremos dos líneas blancas emparejando las piezas de dos en
          dos (cada 2 piezas formarán una línea) y las juntaremos en el mismo
          centro.
        </p>
        <h2 className="titulo font-bold">Segundo centro</h2>
        <p className="texto font-bold">
          Nosotros te recomendamos que el siguiente centro que hagas después del
          blanco sea su opuesto, es decir, el amarillo.
        </p>
        <p className="texto font-bold">
          Para resolver este centro seguiremos el mismo método que en el centro
          anterior. Sin embargo,ahora debemos tener en cuenta que, si hacemos
          algún movimiento que modifique las piezas de la cara blanca que hemos
          puesto anteriormente,tendremos que recuperar ese giro después de
          emparejar las piezas que queramos unir formando una línea. Por
          ejemplo, si subo la cara derecha para juntar dos piezas amarillas,
          tras este movimiento, deberé proteger las dos piezas que he unido y
          devolver el giro de la capa derecha para recuperar el centro blanco.
        </p>
        <p className="texto font-bold">
          Posteriormente, deberemos insertar la línea en el centro
          correspondiente. Por ejemplo, tenemos una línea amarilla en una cara
          lateral y queremos subirla a la cara opuesta al blanco. Lo primero que
          debemos hacer es, con el centro blanco abajo, poner la línea de forma
          vertical a nuestra vista, subir el centro a la capa superior, proteger
          girando la capa dos veces y devolver el primer movimiento. Lo verás
          más claro en la siguiente imagen.
        </p>
        <p className="texto font-bold">
          No te preocupes por rotar las capas exteriores, no destruirán lo que
          tenemos ya hecho.
        </p>
        <p className="texto font-bold">
          Ya tenemos la primera línea en el centro opuesto. Ahora realizaremos
          la segunda emparejando los colores y, para subirla, haremos el mismo
          algoritmo que en el apartado anterior, pero la pondremos debajo de la
          línea que ya tenemos hecha (línea por línea), de manera que cuando
          giremos la capa superior dos veces y devolvamos el movimiento, el
          centro se quede hecho. Lo verás mejor en la siguiente imagen.
        </p>
        <h2 className="titulo font-bold">Tercer centro</h2>
        <p className="texto font-bold">
          Una vez que hemos hecho los dos primeros centros, colocamos el cubo de
          lado, de manera que se queden a nuestra derecha e izquierda el color
          blanco y amarillo, respectivamente.
        </p>
        <p className="texto font-bold">
          El tercer centro que hagamos podría ser cualquiera. El que veamos que
          tenemos más fácil de construir. Si todos te parecen difíciles ponte un
          objetivo y olvídate del resto. Por ejemplo empieza por el azul.
          Empareja dos piezas azules y luego otras dos, de manera que tengas dos
          líneas; recuerda poner las líneas hechas en vertical a tu vista, para
          no romperlas cuando gires el cubo. Posteriormente, sitúalas en el
          mismo centro.
        </p>
        <p className="texto font-bold">
          Aún no tenemos que preocuparnos por la posición de los colores, éste
          es el primero.
        </p>
        <p className="texto font-bold">
          Para ésto no hay algoritmos, es simple intuición. No te preocupes, con
          la práctica lo verás todo mucho más sencillo.
        </p>
        <h2 className="titulo font-bold">Cuarto centro</h2>
        <p className="texto font-bold">
          Llegado a este punto sí tenemos que considerar la posición de los
          colores. Debes tener en cuenta cuál has construido para colocar los
          siguientes centros en su correcta posición. Por ejemplo, si has
          construido el azul, debes tener en cuenta que, con la cara blanca
          hacia arriba, a su izquierda va el rojo y a su derecha el naranja.
        </p>
        <p className="texto font-bold">
          En este caso vamos a hacer el centro rojo.
        </p>
        <p className="texto font-bold">
          Volvemos a poner el cubo de forma que el centro blanco y amarillo
          queden a nuestra derecha e izquierda.
        </p>
        <p className="texto font-bold">
          Buscamos dos piezas rojas de manera que podamos hacer una línea. No os
          preocupéis por rotar las capas externas. No romperán nada que tengamos
          hecho, al contrario que ocurre con las internas.
        </p>
        <p className="texto font-bold">
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
        <p className="texto font-bold">
          Al colocar las líneas en el cuarto centro nos podemos encontrar con
          tres casos:{" "}
        </p>
        <ul className="texto mt-3 font-bold mb-4">
          <li className="texto">
            Primer caso: la línea roja se encuentra en el centro que le
            corresponde. Simplemente gira la capa exterior para dejarla a tu
            izquierda y pasa al siguiente paso.
          </li>
          <li className="texto">
            Segundo caso: la línea roja está en la cara opuesta a la azul. En
            esta situación el algoritmo a seguir sería (con el centro blanco a
            nuestra derecha):
          </li>
          <ul className="texto mt-3 font-bold mb-4">
            <li className="texto">Coloca la linea roja a tu izquierda</li>
            <li className="texto">
              Realiza el algoritmo: Rw, B2, Rw&apos;. Dónde Rw sube la línea
              derecha azul un centro por encima; B2 gira la línea roja de
              izquierda a derecha, para ponerla junto a la azul y Rw&apos;
              devuelve el movimiento de la línea azul y a su vez baja la roja a
              su posición. Cuando esté en su centro, gira la capa dónde se
              encuentra la línea roja para colocarla a nuestra izquierda (U2).
            </li>
          </ul>
          <li className="texto">
            Tercer caso: si la línea roja se encuentra situada junto a la cara
            azul pero en el centro que corresponde al centro naranja, deberemos
            hacer el mismo algoritmo que en el caso anterior. Sin embargo,en
            esta ocasión, en vez de girar la capa derecha una vez, lo haremos
            dos veces. Rw2, B2, Rw2, U2.
          </li>
        </ul>

        <p className="texto font-bold">
          Para colocar la línea que falta haremos lo mismo, con cuidado de ir
          protegiendo y devolviendo los movimientos que impliquen romper algún
          centro que tengamos hecho. Una vez formada la línea utilizamos el
          algoritmo que hemos hecho con la primera línea.
        </p>
        <p className="texto font-bold">
          Por si no te acuerdas bien, te recordamos cómo era ese algoritmo:
        </p>
        <p className="texto font-bold">
          Con el centro blanco a nuestra derecha: Colocamos la línea roja a
          nuestra izquierda en la capa que se encuentre, subimos la línea
          derecha azul (una o dos veces, dependiendo de dónde se encuentre la
          línea roja -debe quedar un centro por debajo de nuestra línea roja-),
          giramos la capa de la línea roja dos veces para que quede línea con
          línea; y finalmente, devolvemos el movimiento.
        </p>

        <h2 className="titulo font-bold">Centros 5 y 6</h2>
        <p className="texto font-bold">
          Ya sólo nos quedan dos centros por hacer. Para resolver los dos
          últimos centros, haremos el verde y, por descarte, el naranja también
          quedará hecho. ¡Ánimo, pronto tendremos resuelto el cubo de rubik 4x4!
        </p>
        <p className="texto font-bold">
          Para hacer este centro, en primer lugar haremos una línea verde y
          posteriormente la introduciremos junto al centro rojo. Si ya está
          colocada en su posición correcta,haremos como anteriormente: lo
          ponemos a nuestra izquierda y formamos la siguiente fila verde.
        </p>
        <p className="texto font-bold">
          Sin embargo, nos encontramos con que está en el centro que corresponde
          al naranja, utilizamos el algoritmo que ya sabemos: Rw, B2, Rw&apos;.
          Dicho de otro modo, con el centro blanco a nuestra derecha y la línea
          verde en vertical a nuestra izquierda, subimos la capa derecha una
          vez, giramos dos veces dónde se encuentra la línea verde y devolvemos
          el primer movimiento. Una vez lo tengamos hecho, colocamos esta fila a
          nuestra izquierda y hacemos la siguiente línea.
        </p>
        <p className="texto font-bold">
          Si conseguimos que la última línea vuelva a su posición correcta a la
          primera... ¡genial, ya tenemos resueltos todos los centros!
        </p>
        <p className="texto font-bold">
          Si no es así, repetiremos los movimientos anteriores. Recuerda, . con
          el centro blanco a nuestra derecha y la línea verde en vertical a
          nuestra izquierda, subimos la capa derecha una vez, giramos dos veces
          dónde se encuentra la línea verde y devolvemos el primer movimiento.
          Apunta bien el algoritmo: Rw, B2, Rw&apos;.
        </p>
        <p className="texto font-bold">
          Y....¡Listo! Ya hemos hecho todos los centros. Veamos ahora cómo
          resolver las aristas.
        </p>
        <h2 className="titulo font-bold">Resolución de las aristas</h2>
        <p className="texto font-bold">
          Este paso es el más complicado, pues nos encontraremos las temidas
          paridades que caracterizan a los cubos pares, como es el caso del
          rubik 4x4. Pero no te preocupes, te guiaremos paso a paso para que
          consigas resolverlo.
        </p>
        <p className="texto font-bold">
          En primer lugar, para hacer las esquinas, es muy importante vamos a
          tener en cuenta que las buscaremos en sentido horizontal, no en
          vertical.
        </p>
        <p className="texto font-bold">
          Nuestro primer objetivo será encontrar dos aristas enfrentadas una a
          otra, pero de manera que no se encuentren en la misma línea; como
          mostramos en la siguiente imagen.
        </p>

        <p className="texto font-bold">
          Caso de aristas enfrentadas en distintas líneas[/caption] Si nos
          encontramos dos aristas pero en la misma posición (como en la
          siguiente imagen) debemos aplicar este algoritmo para solucionarlo:
          (R, U, R&apos;, U&apos;) F&apos;, U, F
        </p>
        <p className="texto font-bold">
          Tenemos dos aristas enfrentadas una a otra, pero de manera que no se
          encuentren en la misma línea, es decir, situadas a derecha e
          izquierda. En este caso realizaremos el siguiente algoritmo: (R, U,
          R&apos;, U&apos;) F&apos;, U, F.
        </p>

        <h2 className="titulo font-bold">Primeras aristas</h2>
        <p className="texto font-bold">
          Las primeras aristas son las más fáciles de resolver.
        </p>
        <p className="texto font-bold">
          Comenzaremos colocando el cubo en una posición de referencia, para que
          nos sea más cómodo de mover. Nuestra posición de referencia será la
          cara blanca hacia arriba y la amarilla hacia abajo. De esta forma, las
          aristas que iremos resolviendo estarán de forma horizontal a nosotros
          en el resto de caras del cubo.
        </p>
        <p className="texto font-bold">
          Para empezar, iremos guardando las aristas que vayamos haciendo en la
          cara blanca y amarilla. Esta parte es la más sencilla y poco a poco se
          irá complicando.
        </p>
        <p className="texto font-bold">
          Colocamos las aristas en el caso que anteriormente hemos explicado que
          nos interesa, una frente a la otra pero en líneas diferentes; las
          juntamos y subimos arriba para guardar. Lo haremos de la siguiente
          manera:
        </p>
        <ul className="texto mt-3 font-bold mb-4">
          <li className="texto">
            Para juntar, sólo tendremos que girar las dos capas superiores o
            inferiores hacia un lado.
          </li>
          <li className="texto">
            Para subir giramos la capa exterior derecha o izquierda (depende de
            dónde tengamos la arista) hacia arriba; protegemos el movimiento y
            devolvemos.
          </li>
        </ul>
        <p className="texto font-bold">
          Depende de donde guardemos la arista, realizaremos un algoritmo u
          otro:
        </p>
        <p className="texto font-bold">
          A la derecha: Uw&apos;, R, U, R&apos;, Uw.
        </p>
        <p className="texto font-bold">
          A la izquierda: Dw&apos;, L&apos;, U, L, Dw
        </p>
        <p className="texto font-bold">
          En la siguiente imagen te mostramos un ejemplo de cómo sería si
          guardásemos la arista a la derecha con el algoritmo Uw&apos;, R, U,
          R&apos;, Uw
        </p>
        <p className="texto font-bold">
          Repetiremos estos mismos movimientos hasta que hagamos toda la capa
          del centro blanco con aristas que tengamos bien colocadas. Para ello
          cuando subamos, debemos procurar siempre bajar una arista que esté mal
          hecha.
        </p>
        <p className="texto font-bold">
          Cuando tengamos la capa superior con el centro blanco con cuatro
          aristas correctas hechas, voltearemos el cubo. e forma, ahora la capa
          del centro amarillo esté arriba y la del centro blanco abajo.
        </p>
        <p className="texto font-bold">
          Seguiremos haciendo aristas como hemos explicado y colocándolas en la
          capa superior (en este caso la del centro amarillo). No te preocupes
          por desarmar el cubo, como las aristas las vamos a seguir buscando en
          las capas centrales, no romperemos lo que ya tenemos hecho.
        </p>
        <p className="texto font-bold">
          Cuando completes las aristas de esta capa empezará lo más complicado.
          Ahora, relájate. Hazlo tranquilamente, tómate tu tiempo para buscar
          las piezas en la posición que te interesa e ir colocando las aristas
          y, sobre todo, no te rindas. Todo es cuestión de práctica.
        </p>
        <h2 className="titulo font-bold">Aristas centrales</h2>

        <p className="texto font-bold">
          Para resolver las aristas centrales deberemos bajar una de las aristas
          que tenemos hechas al centro del cubo, de forma que podamos seguir
          haciendo aristas como lo venimos haciendo habitualmente y colocándolas
          arriba. Este paso solo lo tendremos que hacer dos veces; las dos
          últimas aristas o bien nos saldrán hechas o se harán de otra forma.
        </p>
        <p className="texto font-bold">
          Las ultimas dos aristas o bien nos las dara hechas o tendremos que
          acabarlas de otra forma
        </p>
        <p className="texto font-bold">
          En este caso, si las dos ultimas aristas no nos las ha dado hechas
          tendremos dos casos:
        </p>

        <ul className="texto mt-3 font-bold mb-4">
          <li className="texto">
            En el primer caso, las aristas se encuentran una frente a otra en
            líneas diferentes. En esta ocasión, al contrario que en el resto del
            proceso, esto no nos interesa.
          </li>
          <li className="texto">
            En el segundo caso, tendremos las dos aristas enfrentadas la una con
            la otra. Esto será lo que iremos buscando.
          </li>
        </ul>

        <p className="texto font-bold">
          Si nos aparece la situación del primer caso, tendremos que aplicar el
          algoritmo de volteo que hemos venido aplicando en estas ocasiones, y
          que está explicado más arriba. Vamos a repetirlo una vez más:
        </p>
        <p className="texto font-bold">
          Con las dos aristas situadas a nuestra derecha e izquierda: R, U,
          R&apos;, U&apos; F&apos;, U, F.
        </p>
        <p className="texto font-bold">
          Haciendo este algoritmo obtendremos el segundo caso, es decir,
          tendremos dos aristas enfrentada la una con la otra (el que nos
          interesa en esta ocasión). Recuerda que para ponerlas enfrentadas
          puedes, si es necesario, girar las capas exteriores. Estos movimientos
          no supondrán ningún cambio ni romperán ningún centro ni arista ya
          hecho.
        </p>
        <p className="texto font-bold">
          Cuando hayamos logrado poner una arista enfrentada a la otra
          aplicaremos un algoritmo que ya conocemos y las tendremos todas
          listas. ¿Preparados? ¡Vamos allá!
        </p>
        <p className="texto font-bold">
          Tendremos que partir las dos capas superiores haciendo Uw y luego
          aplicar el algoritmo de volteo; finalmente devolvemos el movimiento de
          las capas superiores y… voilà. El algoritmo es (con las dos aristas
          situadas a nuestra izquierda y derecha): U&apos;w, (R, U, R&apos;,
          U&apos;) F&apos;, U, F, Uw.
        </p>

        <h2 className="titulo font-bold">Resolucion de pariedades</h2>
        <p className="texto font-bold">
          Ya tenemos hechos todos los centros y todas las aristas. Ahora llega
          la parte más fácil y divertida, pues sólo tendremos que resolver el
          cubo como un 3x3 normal y ya habremos terminado nuestro cubo 4x4.
        </p>
        <p className="texto font-bold">
          Sin embargo, durante el proceso podemos encontrarnos con algún
          problemilla… Te darás cuenta que cuando haces la cruz amarilla no
          consigues que las piezas se coloquen en su posición correcta.¿Por qué
          no te deja terminarlo? Muy sencillo, ¡estás ante un caso de
          paridad!Pero que no cunda el pánico... a continuación vamos a explicar
          qué tienes que hacer para resolverlo.
        </p>
        <p className="texto font-bold">
          Volvamos al principio de esta parte y comencemos de nuevo:
        </p>
        <p className="texto font-bold">
          Cuando ya tenemos los centros y las aristas hechas de nuestro cubo de
          rubik 4x4, debemos de imaginar que nuestro cubo es un 3x3. ¿Sabes
          resolver un 3x3, verdad? Pues bien, aplica tus algoritmos para hacer
          la cruz blanca, luego colocar las esquinas, a continuación las aristas
          centrales y, por último, haz la última capa. Bueno... quizás tu método
          es de otra forma, ¡hazlo como tú sepas y te sea más cómodo!
        </p>
        <p className="texto font-bold">
          Al hacer la última capa pueden darse cuatro casos:
        </p>

        <h3 className="titulo font-bold">1- Caso 1: Pariedad OLL</h3>
        <p className="texto font-bold">
          Estás realizando la cruz amarilla y te encuentras con una arista que
          se encuentra volteada. ¡Te ha salido una paridad de OLL! Cuando
          realizamos la cruz amarilla en un 3x3 nos encontramos cuatro casos: el
          punto, una arista, la línea y una L, que comúnmente se llama "Las 9".
          Pues bien, si quieres reconocer a la primera si vamos a tener que
          realizar un algoritmo de OLL en nuestro 4x4, realizando la cruz
          amarilla nos saldrá orientada o una sola arista o la L; es decir, un
          número impar de aristas orientadas.
        </p>
        <p className="texto font-bold">
          Para resolver el caso de paridad en el mismo momento que lo ves,
          utiliza el algoritmo de Paridad OLL. No importa la arista por la que
          comiences a aplicar el algoritmo, se eliminará lo hagas desde dónde lo
          hagas; pero lo óptimo sería que empezases sobre la arista que tiene
          paridad. El algoritmo es el siguiente:
        </p>
        <p className="texto font-bold">
          Paridad OLL: Rw, U2, (x) Rw, U2, Rw, U2, Rw&apos; U2, Lw, U2, Rw&apos;
          U2, Rw, U2, Rw&apos; U2, Rw&apos;
        </p>

        <h3 className="titulo font-bold">2- Caso 2: Pariedad PLL</h3>
        <p className="texto font-bold">
          Te encuentras dos piezas permutadas entre sí. Esto quiere decir que
          tiene dos aristas bien y dos mal. ¡Otra paridad! En esta ocasión es la
          de PLL y es más sencilla de resolver que la anterior.
        </p>
        <p className="texto font-bold">
          También podemos encontrarnos todas las aristas bien y dos esquinas
          mal. No te preocupes, se resuelve con el mismo algoritmo.
        </p>
        <p className="texto font-bold">
          En conclusión, vas a tener dos piezas permutadas entre sí, ya sean
          aristas o esquinas; y el algoritmo con el que se resuelve es el
          siguiente.
        </p>
        <p className="texto font-bold">
          Paridad PLL: r2, U2, r2, Uw2, r2, Uw2{" "}
        </p>

        <h3 className="titulo font-bold">3- Caso 3: Pariedad Doble</h3>
        <p className="texto font-bold">
          El último caso que podemos encontrarnos será en el que nos aparecen
          los dos tipos de paridades juntas; el de OLL y PLL. No te preocupes,
          los algoritmos son los mismos que acabamos de aprender y se ejecutan
          por el siguiente orden:
        </p>
        <p className="texto font-bold">
          En primer lugar, se realiza el de OLL porque será el que veamos
          primero y, por último, el de PLL. Una vez ejecutados ambos algoritmos
          resolveremos el cubo por nuestro método habitual.
        </p>
        <p className="texto font-bold">
          ¡¡Ya tenemos hecho nuestro 4x4!!. Ahora sólo tendrás que practicar
          mucho y pronto lo resolverás sin problema.
        </p>
      </div>
    </div>
  );
}

export default Metodo4x4Page;
