const CAMPOS_TEXTO = [
  ["titulo", "Título de la pestaña"],
  ["marca", "Nombre en el menú y pie"],
  ["nombre1", "Nombre 1"],
  ["nombre2", "Nombre 2"],
  ["fecha", "Fecha en la portada"],
  ["fechaLarga", "Fecha en el pie de página"],
  ["hashtag", "Hashtag"],
  ["lugaresHero", "Lugares en la portada"],
  ["lugarCeremonia", "Lugar de la ceremonia"],
  ["horaCeremonia", "Hora de la ceremonia"],
  ["lugarCelebracion", "Lugar de la celebración"],
  ["horaCelebracion", "Hora de la celebración"],
  ["dresscode", "Código de vestimenta"],
  ["textoDresscode", "Texto de código de vestimenta"],
  ["textoNosotros", "Texto de 'Nosotros'"],
  ["textoRsvp", "Texto de 'Confirma tu asistencia'"],
  ["emailVictoria", "Email de contacto 1"],
  ["emailPedro", "Email de contacto 2"]
];

const CAMPOS_COLOR = [
  ["bg", "Fondo principal"],
  ["bg-alt", "Fondo de secciones alternas"],
  ["accent", "Color de acento (botones y enlaces)"],
  ["accent-dark", "Acento oscuro (hover)"],
  ["ink", "Color del texto"]
];

let datos = null;

const formulario = document.getElementById("formulario");
const vista = document.getElementById("vista");

async function cargar() {
  const res = await fetch("datos.json");
  datos = await res.json();
  construirFormulario();
}

function construirFormulario() {
  formulario.innerHTML = "";

  const grupoTextos = document.createElement("fieldset");
  grupoTextos.innerHTML = "<legend>Textos</legend>";
  for (const [clave, etiqueta] of CAMPOS_TEXTO) {
    const label = document.createElement("label");
    label.textContent = etiqueta;
    label.htmlFor = "campo-" + clave;
    const input = document.createElement("input");
    input.type = "text";
    input.id = "campo-" + clave;
    input.value = datos.textos[clave] || "";
    input.addEventListener("input", () => {
      datos.textos[clave] = input.value;
      actualizarVista();
    });
    grupoTextos.append(label, input);
  }
  formulario.append(grupoTextos);

  const grupoColores = document.createElement("fieldset");
  grupoColores.innerHTML = "<legend>Colores</legend>";
  for (const [clave, etiqueta] of CAMPOS_COLOR) {
    const fila = document.createElement("div");
    fila.className = "fila-color";
    const label = document.createElement("label");
    label.textContent = etiqueta;
    label.htmlFor = "color-" + clave;
    const input = document.createElement("input");
    input.type = "color";
    input.id = "color-" + clave;
    input.value = datos.colores[clave] || "#000000";
    input.addEventListener("input", () => {
      datos.colores[clave] = input.value;
      actualizarVista();
    });
    fila.append(label, input);
    grupoColores.append(fila);
  }
  formulario.append(grupoColores);
}

let temporizador = null;
function actualizarVista() {
  localStorage.setItem("bpv-datos", JSON.stringify(datos));
  clearTimeout(temporizador);
  temporizador = setTimeout(() => {
    vista.src = "index.html?r=" + Date.now();
  }, 300);
}

document.getElementById("descargar").addEventListener("click", () => {
  localStorage.setItem("bpv-datos", JSON.stringify(datos));
  const blob = new Blob([JSON.stringify(datos, null, 2)], {
    type: "application/json"
  });
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(blob);
  enlace.download = "datos.json";
  enlace.click();
  URL.revokeObjectURL(enlace.href);
});

document.getElementById("restaurar").addEventListener("click", () => {
  localStorage.removeItem("bpv-datos");
  cargar().then(() => {
    vista.src = "index.html?r=" + Date.now();
  });
});

cargar();
