window.onload = function () {
  // Variables
  const numeroCodigos = 6;
  const numDestinosExistentes = 3;

  const desplazamientoJuego = "-1000px";
  const desplazamientoInfoJuego = "-3000px";

  //   Creación de un contenedor temporal para almacenar los nodos y luego agregarlos al DOM
  var fragmento = document.createDocumentFragment();

  //   Referencias a los elementos del DOM
  const contenedorOrigen = document.querySelector(".origen"); //Contenedor de origen
  const contenedorDestinoDiv = document.querySelectorAll(
    ".destino .caja-arrastre"
  ); //Contenedor de destino
  const contenedorDestinoSpan = document.querySelectorAll(".destino span"); //Span propios del destino
  const infoJuego = document.querySelector(".info-juego"); //Contenedor de información del juego. Se crea de forma dinámica

  const inicio = document.querySelector(".inicio"); //Panel con la información del juego que se muestra al inicio.
  const juego = document.querySelector(".juego"); //Panel para colocar origen y destino de los elmentos del juego
  const reiniciar = document.querySelector("header .reiniciar"); //Botón para reiniciar el juego
  const info = document.querySelector("header .informacion"); //Botón para mostrar el panel de información con los lenguajes de programación. Fichas voltaeables. Aparece y desaparece con la acción

  // Evento para iniciar el juego
  let iniciarJuego = document.querySelector(".iniciar-juego");
  iniciarJuego.addEventListener("click", () => {
    // Posicionar los elementos para los efectos de desplazamiento
    inicio.style.top = desplazamientoJuego;
    juego.style.top = "0";
    reiniciar.style.top = "0";
    info.style.top = "0";
    // Mostrar el header
    document.querySelector("header").style.opacity = "1";
    document
      .querySelector("header i")
      .addEventListener("click", reiniciarJuego);
    establecerPanelOrigen();
  });

  // Evento para mostrar la información propia del juego
  document
    .querySelector("header .informacion")
    .addEventListener("click", pintarInformacion);

  // Función para pintar las tarjetas con la información de los lenguajes de programación
  async function pintarInformacion() {
    console.log("Acción info....");

    if (
      infoJuego.style.top == desplazamientoInfoJuego ||
      infoJuego.style.top == ""
    ) {
      let contenidos = await leerJson();
      let infoJuegoHTML = "";

      // Posicionar los elementos para los efectos de desplazamiento
      juego.style.top = desplazamientoJuego;
      infoJuego.style.top = "0";

      for (let contenido of contenidos) {
        infoJuegoHTML += `
          <div class="carta" onclick="rotarFicha(event)">
            <div class="back">
              <h1>${contenido.titulo}</h1>
              <p>${contenido.info}</p>
              <div class="link">
                <a href="#">Details</a>
              </div>
            </div>
            <div 
              class="front" 
              style="
                background-image: url(./imagenes/juego/${contenido.imagen});
                background-repeat: no-repeat;
                background-size: cover;
            ">
              <h1>${contenido.titulo}</h1>
            </div>
          </div>
      `;
      }
      infoJuego.innerHTML = infoJuegoHTML;
      infoJuego.style.display = "flex";
      document.body.classList.remove("establece-scroll");
    } else {
      console.log("Altura... ", infoJuego.offsetHeight);
      juego.style.top = "0";
      infoJuego.style.top = desplazamientoInfoJuego;
      infoJuego.style.display = "none";
      document.body.classList.add("establece-scroll");
    }
  }

  // Variable para contar la cantidad de elementos correctos colocados
  let elementosCorrectosColocados = 0;

  // Función para verificar si el usuario ha ganado
  function verificarVictoria() {
    if (elementosCorrectosColocados === numDestinosExistentes) {
      // Muestra el modal y el botón al ganar
      document.querySelector(".modal").style.display = "block";
      let botonRecargar = document.querySelector(".recargar");
      botonRecargar.addEventListener("click", volverJugar);

      let botonHome = document.querySelector(".volver-inicio");
      botonHome.addEventListener("click", reiniciarJuego);
    }
  }

  // Función para volver a jugar al juego una vez que el usuario ha ganado
  function volverJugar() {
    document.querySelector(".modal").style.display = "none";
    // Limpiar el origen
    contenedorOrigen.innerHTML = "";

    // Limpiar el destino
    for (const destino of contenedorDestinoDiv) {
      destino.innerHTML = ""; //Quita la imagen
      destino.nextElementSibling.textContent = ""; //Quita la información del span
    }
    establecerPanelOrigen();
    elementosCorrectosColocados = 0;
  }

  // Función para reiniciar el juego y recargar la página
  function reiniciarJuego() {
    location.reload();
  }

  //   Función para la lectura de los datos del JSON usando Fetch
  async function leerJson() {
    // Acceder al JSON mediante API fetch
    const respuesta = await fetch("./datos/juego.json");
    return await respuesta.json();
  }

  //   Evento para reiniciar el juego
  reiniciar.addEventListener("click", () => {
    // Limpiar el origen
    contenedorOrigen.innerHTML = "";

    // Limpiar el destino
    for (const destino of contenedorDestinoDiv) {
      destino.innerHTML = ""; //Quita la imagen
      destino.nextElementSibling.textContent = ""; //Quita la información del span
    }
    establecerPanelOrigen();
  });

  //   Estblecer elementos en el panel de origen
  let establecerPanelOrigen = async () => {
    //referencia para pintar los botones ocultos del header
    document.querySelector(".reinicio").style.display = "block";
    document.querySelector("header > i").style.display = "block";

    // Acceso al JSON con api fetch
    let lenguajes = await leerJson();

    // Seleccionamos 6 lugares al azar
    let indices = obtenNumeros(numeroCodigos, lenguajes.length);

    for (const indice of indices) {
      let imagen = document.createElement("img");
      imagen.id = lenguajes[indice].id;
      imagen.setAttribute("draggable", "true");
      imagen.src = `./imagenes/juego/${lenguajes[indice].imagen}`;
      imagen.alt = lenguajes[indice].titulo;
      fragmento.append(imagen);
    }

    contenedorOrigen.append(fragmento);
    establecerPanelDestino();
  };

  //   Establecer elementos en el panel de destino
  function establecerPanelDestino() {
    let nombreelementosdestino = Array.from(
      obtenNumeros(numDestinosExistentes, numeroCodigos)
    ); //Convierte el Set a un Array

    //Colocamos propiedades en elementos destino. Atributo alt de la imagen de los elementos de origen seleccionados a partir de los números aleatorios generados
    for (let indice = 0; indice < numDestinosExistentes; indice++) {
      contenedorDestinoSpan[indice].textContent =
        contenedorOrigen.children[nombreelementosdestino[indice]].alt;
    }

    asignaEventos();
  }

  //Obtener números aleatorios. Se pasa como argumentos números a obtener y límite superior para la obtención
  function obtenNumeros(cantidadNumeros, limiteSuperior) {
    let numeros = new Set(); // Set para evitar los duplicados
    while (numeros.size < cantidadNumeros) {
      numeros.add(Math.floor(Math.random() * limiteSuperior));
    }
    return numeros;
  }

  function asignaEventos() {
    //Asignación eventos para origen
    let lugaresOrigen = document.querySelectorAll(".origen img");
    for (let item of lugaresOrigen) {
      item.addEventListener("dragstart", dragStart);
      item.addEventListener("dragend", dragEnd);
    }

    //Asignación eventos para destino
    for (let item of contenedorDestinoDiv) {
      item.addEventListener("dragenter", dragEnter);
      item.addEventListener("dragover", dragOver);
      item.addEventListener("dragleave", dragLeave);
      item.addEventListener("drop", drop);
    }
  }

  //Funciones de manejo de eventos -> Origen
  // Función que se ejecuta al arrastrar el elemento.
  function dragStart(e) {
    e.target.style.opacity = ".5";
    e.dataTransfer.setData("text/plain", e.target.id);
  }

  //Función que se ejecuta al terminar de arrastrar el elemento.
  function dragEnd(e) {
    e.target.style.opacity = "1";
  }

  //Función que se ejecuta cuando un elemento arrastrable entra en el elemento desde del que se llama.
  function dragEnter(e) {
    e.target.style.backgroundColor = "#DCDCDC";
  }

  //Función que se ejecuta cuando un elemento arrastrable esta sobre el elemento desde del que se llama.
  //Devuelve false si el objeto se puede soltar en ese elemento y true en caso contrario.
  function dragOver(e) {
    e.preventDefault();
  }

  //Función que se ejecuta cuando un elemento arrastrable sale de un posible destino
  function dragLeave(e) {
    e.target.style.backgroundColor = "white";
  }

  function drop(e) {
    e.preventDefault(); // Evita que se ejecute la accion por defecto del elemento soltado.
    e.target.style.backgroundColor = "white";
    let id = e.dataTransfer.getData("text/plain");
    let elementoArrastrado = document.getElementById(id);

    if (elementoArrastrado.alt === e.target.nextElementSibling.textContent) {
      e.target.appendChild(elementoArrastrado);
      elementosCorrectosColocados++;
      verificarVictoria(); // Llama a la función para verificar si el usuario ha ganado
    } else e.target.style.backgroundColor = "white";

    e.target.style.opacity = "1";
  }
};
