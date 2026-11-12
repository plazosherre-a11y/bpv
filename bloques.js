const TIPOS = {
  portada: {
    nombre: "Portada",
    campos: [
      ["nombre1", "Nombre 1"],
      ["nombre2", "Nombre 2"],
      ["fecha", "Fecha"],
      ["lugares", "Lugares"]
    ]
  },
  texto: {
    nombre: "Sección de texto",
    campos: [
      ["titulo", "Título"],
      ["cuerpo", "Texto"]
    ]
  },
  galeria: {
    nombre: "Galería de fotos",
    campos: [["titulo", "Título"]]
  },
  lugar: {
    nombre: "Lugar del evento",
    campos: [
      ["titulo", "Título (Ceremonia / Celebración)"],
      ["hora", "Hora"],
      ["nombre", "Nombre del lugar"],
      ["fotos", "Fotos (nombres de archivo separados por coma)"]
    ]
  },
  preguntas: {
    nombre: "Preguntas frecuentes",
    campos: [
      ["titulo", "Título"],
      ["items", "Preguntas, una por línea con formato: pregunta | respuesta"]
    ]
  },
  formulario: {
    nombre: "Formulario de asistencia",
    campos: [
      ["titulo", "Título"],
      ["texto", "Texto introductorio"]
    ]
  },
  contacto: {
    nombre: "Contacto",
    campos: [
      ["titulo", "Título"],
      ["email1", "Email 1"],
      ["email2", "Email 2"]
    ]
  }
};

let datosBase = { textos: {} };

async function cargarDatos() {
  try {
    const res = await fetch("datos.json");
    if (res.ok) datosBase = await res.json();
  } catch (e) {}
}

function porDefecto() {
  const t = datosBase.textos || {};
  return [
    { tipo: "portada", campos: { nombre1: t.nombre1 || "Victoria", nombre2: t.nombre2 || "Pedro", fecha: t.fecha || "26 . 06 . 2027", lugares: t.lugaresHero || "" } },
    { tipo: "galeria", campos: { titulo: "Nosotros" } },
    { tipo: "lugar", campos: { titulo: "Ceremonia", hora: t.horaCeremonia || "18:00", nombre: t.lugarCeremonia || "", fotos: "fotos/ceremonia-1.jpg, fotos/ceremonia-2.jpg" } },
    { tipo: "lugar", campos: { titulo: "Celebración", hora: t.horaCelebracion || "20:00", nombre: t.lugarCelebracion || "", fotos: "fotos/celebracion-1.jpg, fotos/celebracion-2.jpg" } },
    { tipo: "preguntas", campos: { titulo: "Preguntas frecuentes", items: "¿Dónde aparco? | Habrá parking habilitado.\n¿Hay transporte? | Sí, habrá autobuses entre los dos lugares.\n¿Puedo llevar niños? | ¡Por supuesto!" } },
    { tipo: "formulario", campos: { titulo: "Confirma tu asistencia", texto: t.textoRsvp || "" } },
    { tipo: "contacto", campos: { titulo: "Contacto", email1: t.emailVictoria || "", email2: t.emailPedro || "" } }
  ];
}

let bloques = porDefecto();

function escapar(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function navHtml() {
  const enlaces = bloques
    .map((b, i) => `<li><a href="#sec${i + 1}">${escapar(b.campos.titulo || TIPOS[b.tipo].nombre)}</a></li>`)
    .join("");
  const marca = escapar((datosBase.textos && datosBase.textos.marca) || "Nuestra boda");
  return `<nav class="topnav" aria-label="Navegación principal">
    <div class="nav-inner">
      <a class="brand" href="#inicio">${marca}</a>
      <ul class="nav-links" role="list"><li><a href="#inicio">Inicio</a></li>${enlaces}</ul>
    </div>
  </nav>`;
}

function bloqueHtml(b, i) {
  const f = b.campos;
  const id = "sec" + (i + 1);
  switch (b.tipo) {
    case "portada":
      return `<header class="hero" id="inicio">
    <p class="hero-date">${escapar(f.fecha)}</p>
    <h1 class="hero-names">${escapar(f.nombre1)} <span class="amp">&amp;</span> ${escapar(f.nombre2)}</h1>
    <p class="hero-place">${escapar(f.lugares)}</p>
    <a class="btn btn-primary" href="#rsvp">Confirma asistencia</a>
  </header>`;
    case "texto":
      return `<section class="section" id="${id}">
      <h2>${escapar(f.titulo)}</h2>
      <p class="lead">${escapar(f.cuerpo)}</p>
    </section>`;
    case "galeria": {
      const fotos = [1, 2, 3, 4, 5, 6]
        .map((n) => `<li class="gallery-item"><img src="fotos/momento-${n}.jpg" alt="Foto ${n} de la pareja" loading="lazy" width="600" height="600"></li>`)
        .join("");
      return `<section class="section" id="${id}">
      <h2>${escapar(f.titulo)}</h2>
      <ul class="gallery" role="list">${fotos}</ul>
    </section>`;
    }
    case "lugar": {
      const fotos = String(f.fotos || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((src, n) => `<img src="${escapar(src)}" alt="Foto del lugar ${n + 1}" loading="lazy" width="600" height="450">`)
        .join("");
      const mapa = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(f.nombre || "");
      return `<section class="section section-alt" id="${id}">
      <h2>${escapar(f.titulo)}</h2>
      <div class="cards"><article class="card">
        <h3>${escapar(f.titulo)}</h3>
        <p class="card-time">${escapar(f.hora)}</p>
        <p>${escapar(f.nombre)}</p>
        <p class="card-link"><a href="${mapa}" target="_blank" rel="noopener">Ver en el mapa</a></p>
        <div class="card-photos">${fotos}</div>
      </article></div>
    </section>`;
    }
    case "preguntas": {
      const items = String(f.items || "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
          const [p, r] = l.split("|").map((s) => (s || "").trim());
          return `<details><summary>${escapar(p)}</summary><p>${escapar(r || "")}</p></details>`;
        })
        .join("");
      return `<section class="section" id="${id}">
      <h2>${escapar(f.titulo)}</h2>
      <div class="faq">${items}</div>
    </section>`;
    }
    case "formulario":
      return `<section class="section section-alt" id="rsvp">
      <h2>${escapar(f.titulo)}</h2>
      <p class="lead">${escapar(f.texto)}</p>
      <form class="rsvp-form" action="#" method="post">
        <div class="field"><label for="nombre">Nombre completo</label><input type="text" id="nombre" name="nombre" required></div>
        <div class="field"><label for="email">Correo electrónico</label><input type="email" id="email" name="email" required></div>
        <fieldset class="field"><legend>¿Asistirás?</legend>
          <label class="radio"><input type="radio" name="asistencia" value="si" required> Sí, allí estaré</label>
          <label class="radio"><input type="radio" name="asistencia" value="no"> No podré asistir</label>
        </fieldset>
        <div class="field"><label for="mensaje">Mensaje para los novios</label><textarea id="mensaje" name="mensaje" rows="4"></textarea></div>
        <button class="btn btn-primary" type="submit">Enviar confirmación</button>
      </form>
    </section>`;
    case "contacto":
      return `<section class="section" id="${id}">
      <h2>${escapar(f.titulo)}</h2>
      <p class="contact-line">Contacto 1: <a href="mailto:${escapar(f.email1)}">${escapar(f.email1)}</a></p>
      <p class="contact-line">Contacto 2: <a href="mailto:${escapar(f.email2)}">${escapar(f.email2)}</a></p>
    </section>`;
  }
  return "";
}

function documentoHtml() {
  const cuerpo = bloques.map((b, i) => bloqueHtml(b, i)).join("\n");
  const marca = (datosBase.textos && datosBase.textos.marca) || "Nuestra boda";
  const fecha = (datosBase.textos && datosBase.textos.fechaLarga) || "";
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapar(marca)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  ${navHtml()}
  <main id="contenido">
${cuerpo}
  </main>
  <footer class="footer">
    <p>${escapar(marca)}${fecha ? " · " + escapar(fecha) : ""}</p>
    <p><a href="#inicio">Volver arriba</a></p>
  </footer>
</body>
</html>
`;
}

function renderizar() {
  const paleta = document.getElementById("paleta");
  paleta.innerHTML = "";
  for (const [tipo, def] of Object.entries(TIPOS)) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "+ " + def.nombre;
    btn.addEventListener("click", () => {
      bloques.push({ tipo, campos: Object.fromEntries(def.campos.map(([c]) => [c, ""])) });
      renderizar();
    });
    paleta.append(btn);
  }

  const lista = document.getElementById("lista");
  lista.innerHTML = "";
  bloques.forEach((b, i) => {
    const def = TIPOS[b.tipo];
    const caja = document.createElement("div");
    caja.className = "bloque";
    const cab = document.createElement("div");
    cab.className = "cabecera";
    const titulo = document.createElement("strong");
    titulo.textContent = def.nombre;
    const ops = document.createElement("span");
    ops.className = "ops";
    const subir = document.createElement("button");
    subir.textContent = "↑";
    subir.title = "Subir";
    subir.addEventListener("click", () => {
      if (i > 0) { [bloques[i - 1], bloques[i]] = [bloques[i], bloques[i - 1]]; renderizar(); }
    });
    const bajar = document.createElement("button");
    bajar.textContent = "↓";
    bajar.title = "Bajar";
    bajar.addEventListener("click", () => {
      if (i < bloques.length - 1) { [bloques[i + 1], bloques[i]] = [bloques[i], bloques[i + 1]]; renderizar(); }
    });
    const borrar = document.createElement("button");
    borrar.textContent = "✕";
    borrar.className = "borrar";
    borrar.title = "Eliminar bloque";
    borrar.addEventListener("click", () => { bloques.splice(i, 1); renderizar(); });
    ops.append(subir, bajar, borrar);
    cab.append(titulo, ops);
    caja.append(cab);
    for (const [clave, etiqueta] of def.campos) {
      const label = document.createElement("label");
      label.textContent = etiqueta;
      label.htmlFor = `b${i}-${clave}`;
      const esLargo = clave === "items" || clave === "cuerpo" || clave === "fotos";
      const input = document.createElement(esLargo ? "textarea" : "input");
      if (!esLargo) input.type = "text";
      input.id = `b${i}-${clave}`;
      input.value = b.campos[clave] || "";
      input.addEventListener("input", () => {
        b.campos[clave] = input.value;
        actualizarVista();
      });
      caja.append(label, input);
    }
    lista.append(caja);
  });

  actualizarVista();
}

let temporizador = null;
function actualizarVista() {
  clearTimeout(temporizador);
  temporizador = setTimeout(() => {
    document.getElementById("vista").srcdoc = documentoHtml();
  }, 250);
}

document.getElementById("descargar").addEventListener("click", () => {
  const blob = new Blob([documentoHtml()], { type: "text/html" });
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(blob);
  enlace.download = "index.html";
  enlace.click();
  URL.revokeObjectURL(enlace.href);
});

document.getElementById("reiniciar").addEventListener("click", () => {
  bloques = porDefecto();
  renderizar();
});

cargarDatos().then(renderizar);
