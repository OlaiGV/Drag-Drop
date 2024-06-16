window.onload = async function () {
  await ponCategorias();
  await ponCursos();
};

//Función para la lectura del JSON con Fetch. Se retorna JSON con los datos
async function leeJSON() {
  //Acceso al JSON con API Fetch
  const respuesta = await fetch("../datos/cursos.json");
  return await respuesta.json();
}

async function ponCursos() {
  let articleCursos = document.querySelector(".cursos");
  let cursos = await leeJSON();
  let cursosHTML = "";
  for (let curso of cursos) {
    cursosHTML += `
        <div class="carta" onclick="rotarFicha(event)">
          <div class="back">
            <h1>${curso.titulo}</h1>
            <p>${curso.info}</p>
            <div class="link">
              <a href="#">Details</a>
            </div>
          </div>
          <div 
            class="front" 
            style="
              background-image: url(../imagenes/cursos/${curso.imagen});
              background-repeat: no-repeat;
              background-size: cover;
          ">
            <h1>${curso.titulo}</h1>
          </div>
        </div>
    `;
  }
  articleCursos.innerHTML = cursosHTML;
  document.body.append(articleCursos);
}

async function ponCategorias() {
  let articleCategorias = document.querySelector(".categorias-cursos");
  let articleVistas = document.querySelector(".vista-cursos");

  let categorias = await leeJSON();
  let contenidoHTML = `<button class="categoria">All</button>`;

  let p = document.createElement("p");
  p.textContent = "Categorías";

  // Crear buscador por categorias para los cursos
  let i = document.createElement("i");
  i.classList.add = "fa-solid fa-magnifying-glass";

  let divBotonesCategorias = document.createElement("div");
  divBotonesCategorias.classList.add("buttons-categorias");

  for (let categoria of categorias) {
    contenidoHTML += `
      <button class="categoria">${categoria.titulo}</button>
    `;
  }
  divBotonesCategorias.innerHTML = contenidoHTML;
  articleCategorias.append(p, divBotonesCategorias);
  document.body.append(articleCategorias);

  let vistasHTML = `
      <p class="lista"><i class="fa-solid fa-list"></i></p>
      <p class="columna"><i class="fa-solid fa-table-columns"></i></p>
  `;
  articleVistas.innerHTML = vistasHTML;
  document.body.append(articleVistas);

  let lista = document.querySelector(".lista");
  let columna = document.querySelector(".columna");

  // Método que al cambiar el CSS a vista carrusel
  lista.addEventListener("click", cambiarVista);
  columna.addEventListener("click", cambiarVista);
}

async function cambiarVista() {
  // Separamos elementos del href. El CSS está en la última posición
  let hrefEstilos = document.querySelector("#estilos-galeria");
  let hojaCss = hrefEstilos.href.split("/");
  console.log("Actual: " + hojaCss[hojaCss.length - 1]);
  switch (hojaCss[hojaCss.length - 1]) {
    case "cursos.css": // Pasar a vista carrusel
      // Iniciar el carrusel
      carruselInit();
      console.log("DENTRO");
      // Cambiamos estilos
      console.log("Actual: " + hojaCss[hojaCss.length - 1]);
      hrefEstilos.href = "../css/cursos-carrusel.css";
      break;
    case "cursos-carrusel.css": // Pasar a vista galería
      // Detener Carrusel
      carruselStop();
      console.log("Entro");

      // Cambiamos estilos
      hrefEstilos.href = "../css/cursos.css";
      break;
  }
}
