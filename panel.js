const TIPOS = {
  portada: {
    nombre: "Inicio (portada)",
    campos: [["nombre1", "Nombre 1"], ["nombre2", "Nombre 2"], ["fecha", "Fecha"], ["lugares", "Lugares"]]
  },
  texto: {
    nombre: "Sección de texto",
    campos: [["titulo", "Título"], ["cuerpo", "Texto"]]
  },
  galeria: { nombre: "Galería de fotos", campos: [["titulo", "Título"]] },
  lugar: {
    nombre: "Lugar del evento",
    campos: [["titulo", "Título (Ceremonia / Celebración)"], ["hora", "Hora"], ["nombre", "Nombre del lugar"], ["fotos", "Fotos (archivos separados por coma)"]]
  },
  preguntas: {
    nombre: "Preguntas",
    campos: [["titulo", "Título"], ["items", "Una por línea: pregunta | respuesta"]]
  },
  localizacion: {
    nombre: "Localización y horarios",
    campos: [
      ["titulo", "Título"],
      ["ceremoniaLugar", "Lugar de la ceremonia"],
      ["ceremoniaHora", "Hora de la ceremonia"],
      ["celebracionLugar", "Lugar de la celebración"],
      ["celebracionHora", "Hora de la celebración"]
    ]
  },
  lista: {
    nombre: "Lista de bodas",
    campos: [["titulo", "Título"], ["texto", "Texto"], ["enlace", "Enlace (URL)"]]
  },
  protocolo: {
    nombre: "Normas de protocolo",
    campos: [
      ["titulo", "Título"],
      ["mujerCiviles", "Mujer - Civiles"],
      ["mujerArmada", "Mujer - Armada"],
      ["mujerTierra", "Mujer - Ejército de Tierra"],
      ["mujerAire", "Mujer - Ejército del Aire"],
      ["mujerCuerpos", "Mujer - Cuerpos Comunes"],
      ["hombreCiviles", "Hombre - Civiles"],
      ["hombreArmada", "Hombre - Armada"],
      ["hombreTierra", "Hombre - Ejército de Tierra"],
      ["hombreAire", "Hombre - Ejército del Aire"],
      ["hombreCuerpos", "Hombre - Cuerpos Comunes"],
      ["normas", "Normas (una por línea, sin título)"]
    ]
  },
  formulario: {
    nombre: "Confirma tu asistencia",
    campos: [["titulo", "Título"], ["texto", "Texto introductorio"]]
  },
  contacto: {
    nombre: "Contacto",
    campos: [["titulo", "Título"], ["email1", "Email 1"], ["email2", "Email 2"]]
  }
};

const CAMPOS_COLOR = [
  ["bg", "Fondo principal"], ["bg-alt", "Fondo de secciones alternas"],
  ["accent", "Color de acento (botones y enlaces)"], ["accent-dark", "Acento oscuro (hover)"],
  ["ink", "Color del texto"]
];

const FUENTES_TITULAR = ["Pinyon Script", "Cormorant Garamond", "Playfair Display", "Great Vibes", "Dancing Script"];
const FUENTES_TEXTO = ["Jost", "Lato", "Montserrat", "Open Sans"];
const FUENTES_SCRIPT = ["Pinyon Script", "Great Vibes", "Dancing Script"];

function fam(f) {
  return encodeURIComponent(f).replace(/%20/g, "+");
}

function fuentesUrl(f) {
  const pesoDisplay = FUENTES_SCRIPT.includes(f.display) ? "wght@400" : "wght@400;600;700";
  return "https://fonts.googleapis.com/css2?family=" + fam(f.display) + ":" + pesoDisplay + "&family=" + fam(f.body) + ":wght@300;400;500&display=swap";
}

let datos = { textos: {}, colores: {} };
let bloques = [];

function escapar(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

async function cargar() {
  try {
    const res = await fetch("datos.json");
    if (res.ok) datos = await res.json();
  } catch (e) {}
  bloques = porDefecto();
  renderizarBloques();
  renderizarFormulario();
  actualizarVista();
}

function porDefecto() {
  const t = datos.textos || {};
  return [
    { tipo: "portada", campos: { nombre1: t.nombre1 || "Victoria", nombre2: t.nombre2 || "Pedro", fecha: t.fecha || "", lugares: t.lugaresHero || "" } },
    { tipo: "localizacion", campos: { titulo: "Localización y horarios", ceremoniaLugar: t.lugarCeremonia || "", ceremoniaHora: t.horaCeremonia || "", celebracionLugar: t.lugarCelebracion || "", celebracionHora: t.horaCelebracion || "" } },
    { tipo: "protocolo", campos: { titulo: "Normas de protocolo", mujerCiviles: "Vestido largo", mujerArmada: "Diario modalidad B", mujerTierra: "Etiqueta", mujerAire: "Gala", mujerCuerpos: "Gala modalidad B", hombreCiviles: "Traje corbata", hombreArmada: "Diario modalidad B", hombreTierra: "Etiqueta", hombreAire: "Diario", hombreCuerpos: "Gala modalidad B", normas: "Se recomienda acudir con los hombros cubiertos así como mantener el decoro durante toda la ceremonia religiosa.\nA fin de poder comenzar con puntualidad se ruega llegar al lugar de la ceremonia con 20 minutos de antelación sobre la hora prevista de comienzo." } },
    { tipo: "lista", campos: { titulo: "Lista de bodas", texto: "Vuestra presencia es nuestro mejor regalo. Si aun así queréis contribuir, aquí tenéis nuestra lista:", enlace: "#" } },
    { tipo: "preguntas", campos: { titulo: "Preguntas", items: "¿Dónde aparco? | Habrá parking habilitado.\n¿Hay transporte entre los lugares? | Sí, habrá autobuses.\n¿Puedo llevar niños? | ¡Por supuesto!" } },
    { tipo: "contacto", campos: { titulo: "Contacto", email1: t.emailVictoria || "", email2: t.emailPedro || "" } },
    { tipo: "formulario", campos: { titulo: "Confirma tu asistencia", texto: t.textoRsvp || "" } }
  ];
}

function navHtml() {
  const enlaces = bloques
    .map((b, i) => ({ b, i }))
    .filter(({ b }) => b.tipo !== "portada")
    .map(({ b, i }) => `<li><a href="#sec${i + 1}">${escapar(b.campos.titulo || TIPOS[b.tipo].nombre)}</a></li>`)
    .join("");
  return `<nav class="topnav" aria-label="Navegación principal">
    <div class="nav-inner">
      <a class="brand" href="#inicio">${escapar(datos.textos.marca || "Nuestra boda")}</a>
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
    <a class="btn btn-primary" href="#rsvp">Confirma tu asistencia</a>
  </header>`;
    case "texto":
      return `<section class="section" id="${id}"><h2>${escapar(f.titulo)}</h2><p class="lead">${escapar(f.cuerpo)}</p></section>`;
    case "galeria": {
      const fotos = [1, 2, 3, 4, 5, 6]
        .map((n) => `<li class="gallery-item"><img src="fotos/momento-${n}.jpg" alt="Foto ${n} de la pareja" loading="lazy" width="600" height="600"><span>Momento ${n}</span></li>`)
        .join("");
      return `<section class="section" id="${id}"><h2>${escapar(f.titulo)}</h2><ul class="gallery" role="list">${fotos}</ul></section>`;
    }
    case "lugar": {
      const fotos = String(f.fotos || "").split(",").map((s) => s.trim()).filter(Boolean)
        .map((src, n) => `<img src="${escapar(src)}" alt="Foto del lugar ${n + 1}" loading="lazy" width="600" height="450">`).join("");
      const mapa = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(f.nombre || "");
      return `<section class="section section-alt" id="${id}"><h2>${escapar(f.titulo)}</h2>
      <div class="cards"><article class="card">
        <h3>${escapar(f.titulo)}</h3>
        <p class="card-time">${escapar(f.hora)}</p>
        <p>${escapar(f.nombre)}</p>
        <p class="card-link"><a href="${mapa}" target="_blank" rel="noopener">Ver en el mapa</a></p>
        <div class="card-photos">${fotos}</div>
      </article></div></section>`;
    }
    case "preguntas": {
      const items = String(f.items || "").split("\n").map((l) => l.trim()).filter(Boolean)
        .map((l) => {
          const [p, r] = l.split("|").map((s) => (s || "").trim());
          return `<details><summary>${escapar(p)}</summary><p>${escapar(r || "")}</p></details>`;
        }).join("");
      return `<section class="section" id="${id}"><h2>${escapar(f.titulo)}</h2><div class="faq">${items}</div></section>`;
    }
    case "localizacion": {
      const mapaC = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(f.ceremoniaLugar || "");
      const mapaF = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(f.celebracionLugar || "");
      return `<section class="section section-alt" id="${id}">
      <h2>${escapar(f.titulo)}</h2>
      <div class="cards">
        <article class="card">
          <h3>Ceremonia</h3>
          <p class="card-time">${escapar(f.ceremoniaHora)}</p>
          <p>${escapar(f.ceremoniaLugar)}</p>
          <p class="card-link"><a href="${mapaC}" target="_blank" rel="noopener">Ver en el mapa</a></p>
          <img class="card-photo" src="fotos/ceremonia.jpg" alt="Foto de la Iglesia Catedral Castrense" loading="lazy" width="600" height="400">
        </article>
        <article class="card">
          <h3>Celebración</h3>
          <p class="card-time">${escapar(f.celebracionHora)}</p>
          <p>${escapar(f.celebracionLugar)}</p>
          <p class="card-link"><a href="${mapaF}" target="_blank" rel="noopener">Ver en el mapa</a></p>
          <img class="card-photo" src="fotos/celebracion.jpg" alt="Foto de Finca Prados Moros" loading="lazy" width="600" height="400">
        </article>
      </div>
    </section>`;
    }
    case "lista":
      return `<section class="section section-alt" id="${id}">
      <h2>${escapar(f.titulo)}</h2>
      <p class="lead">${escapar(f.texto)}</p>
      <a class="btn btn-ghost" href="${escapar(f.enlace || "#")}">Ver lista de boda</a>
    </section>`;
    case "protocolo": {
      const normas = String(f.normas || "").split("\n").map((l) => l.trim()).filter(Boolean)
        .map((l) => `<li>${escapar(l)}</li>`).join("");
      const militar = (armada, tierra, aire, cuerpos) => `
      <p style="margin:0.4rem 0 0.2rem;"><strong>Militares:</strong></p>
      <ul style="margin:0;padding-left:1.2rem;">
        <li>Armada: ${escapar(armada)}</li>
        <li>Ejército de Tierra: ${escapar(tierra)}</li>
        <li>Ejército del Aire: ${escapar(aire)}</li>
        <li>Cuerpos Comunes: ${escapar(cuerpos)}</li>
      </ul>`;
      return `<section class="section section-alt" id="${id}">
      <h2>${escapar(f.titulo)}</h2>
      <div class="cards">
        <article class="card" style="text-align:left;">
          <h3>Mujer</h3>
          <p style="margin:0.2rem 0;"><strong>Civiles:</strong> ${escapar(f.mujerCiviles)}</p>
          ${militar(f.mujerArmada, f.mujerTierra, f.mujerAire, f.mujerCuerpos)}
        </article>
        <article class="card" style="text-align:left;">
          <h3>Hombre</h3>
          <p style="margin:0.2rem 0;"><strong>Civiles:</strong> ${escapar(f.hombreCiviles)}</p>
          ${militar(f.hombreArmada, f.hombreTierra, f.hombreAire, f.hombreCuerpos)}
        </article>
      </div>
      <div class="card" style="margin-top:1.5rem;text-align:left;">
        <ul style="margin:0;padding-left:1.2rem;">${normas}</ul>
      </div>
    </section>`;
    }
    case "formulario":
      return `<section class="section section-alt" id="rsvp"><h2>${escapar(f.titulo)}</h2>
      <p class="lead">${escapar(f.texto)}</p>
      <form class="rsvp-form" action="#" method="post">
        <div class="field"><label for="nombre">Nombre completo</label><input type="text" id="nombre" name="nombre" required></div>
        <div class="field"><label for="email">Correo electrónico</label><input type="email" id="email" name="email" required></div>
        <fieldset class="field"><legend>¿Asistirás?</legend>
          <label class="radio"><input type="radio" name="asistencia" value="si" required> Sí, allí estaré</label>
          <label class="radio"><input type="radio" name="asistencia" value="no"> No podré asistir</label>
        </fieldset>
        <div class="field"><label for="invitados">Número de acompañantes</label><input type="number" id="invitados" name="invitados" min="0" max="10" value="0"></div>
        <div class="field"><label for="alergias">Alergias alimentarias</label><input type="text" id="alergias" name="alergias" placeholder="Ninguna / intolerancia a..."></div>
        <div class="field"><label for="necesidades">Necesidades especiales (movilidad, dieta...)</label><textarea id="necesidades" name="necesidades" rows="3"></textarea></div>
        <div class="field"><label for="mensaje">Mensaje para los novios</label><textarea id="mensaje" name="mensaje" rows="3"></textarea></div>
        <button class="btn btn-primary" type="submit">Enviar confirmación</button>
      </form></section>`;
    case "contacto":
      return `<section class="section" id="${id}"><h2>${escapar(f.titulo)}</h2>
      <p class="contact-line">Contacto 1: <a href="mailto:${escapar(f.email1)}">${escapar(f.email1)}</a></p>
      <p class="contact-line">Contacto 2: <a href="mailto:${escapar(f.email2)}">${escapar(f.email2)}</a></p></section>`;
  }
  return "";
}

function documentoHtml() {
  const cuerpo = bloques.map((b, i) => bloqueHtml(b, i)).join("\n");
  const marca = datos.textos.marca || "Nuestra boda";
  const fecha = datos.textos.fechaLarga || "";
  const fuentes = datos.fuentes || { display: "Cormorant Garamond", body: "Jost" };
  const fontsHref = fuentesUrl(fuentes);
  const vars = Object.entries(datos.colores || {}).map(([k, v]) => `--${k}:${v};`).join("") +
    `--font-display:"${fuentes.display}",Georgia,serif;--font-body:"${fuentes.body}",system-ui,sans-serif;`;
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapar(marca)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontsHref}" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
  <style>:root{${vars}}</style>
</head>
<body>
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  ${navHtml()}
  <main id="contenido">
${cuerpo}
  </main>
  <footer class="footer">
    <p>${escapar(marca)}${fecha ? " · " + escapar(fecha) : ""}</p>
    <p><a href="#inicio">Volver arriba</a> · <a href="panel.html">Panel de edición</a></p>
  </footer>
</body>
</html>
`;
}

function renderizarBloques() {
  const paleta = document.getElementById("paleta");
  paleta.innerHTML = "";
  for (const [tipo, def] of Object.entries(TIPOS)) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "+ " + def.nombre;
    btn.addEventListener("click", () => {
      bloques.push({ tipo, campos: Object.fromEntries(def.campos.map(([c]) => [c, ""])) });
      renderizarBloques();
      actualizarVista();
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
    const mk = (txt, title, fn) => {
      const btn = document.createElement("button");
      btn.textContent = txt; btn.title = title; btn.addEventListener("click", fn);
      return btn;
    };
    ops.append(
      mk("↑", "Subir", () => { if (i > 0) { [bloques[i - 1], bloques[i]] = [bloques[i], bloques[i - 1]]; renderizarBloques(); actualizarVista(); } }),
      mk("↓", "Bajar", () => { if (i < bloques.length - 1) { [bloques[i + 1], bloques[i]] = [bloques[i], bloques[i + 1]]; renderizarBloques(); actualizarVista(); } }),
      Object.assign(mk("✕", "Eliminar bloque", () => { bloques.splice(i, 1); renderizarBloques(); actualizarVista(); }), { className: "borrar" })
    );
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
      input.addEventListener("input", () => { b.campos[clave] = input.value; actualizarVista(); });
      caja.append(label, input);
    }
    lista.append(caja);
  });
}

function renderizarFormulario() {
  const formulario = document.getElementById("formulario");
  formulario.innerHTML = "";
  const gc = document.createElement("fieldset");
  gc.innerHTML = "<legend>Colores</legend>";
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
    input.addEventListener("input", () => { datos.colores[clave] = input.value; actualizarVista(); });
    fila.append(label, input);
    gc.append(fila);
  }
  formulario.append(gc);

  const gf = document.createElement("fieldset");
  gf.innerHTML = "<legend>Tipografías</legend>";
  const filasFuente = [
    ["display", "Títulos", FUENTES_TITULAR],
    ["body", "Texto", FUENTES_TEXTO]
  ];
  datos.fuentes = datos.fuentes || { display: "Cormorant Garamond", body: "Jost" };
  for (const [clave, etiqueta, opciones] of filasFuente) {
    const label = document.createElement("label");
    label.textContent = etiqueta;
    label.htmlFor = "fuente-" + clave;
    const select = document.createElement("select");
    select.id = "fuente-" + clave;
    select.style.cssText = "width:100%;font:inherit;font-size:0.9rem;padding:0.4rem 0.55rem;border:1px solid #d8cdbd;border-radius:7px;";
    for (const op of opciones) {
      const opt = document.createElement("option");
      opt.value = op;
      opt.textContent = op;
      if (datos.fuentes[clave] === op) opt.selected = true;
      select.append(opt);
    }
    select.addEventListener("change", () => {
      datos.fuentes[clave] = select.value;
      actualizarVista();
    });
    gf.append(label, select);
  }
  formulario.append(gf);
}

function reportarEstado(msg) {
  const el = document.getElementById("estado");
  if (el) el.textContent = msg;
}

window.addEventListener("error", (e) => reportarEstado("Error: " + e.message));

let temporizador = null;
function actualizarVista() {
  clearTimeout(temporizador);
  temporizador = setTimeout(() => {
    try {
      document.getElementById("vista").srcdoc = documentoHtml();
      reportarEstado("");
    } catch (e) {
      reportarEstado("Error en la vista previa: " + e.message);
    }
  }, 250);
}

function descargar(nombre, contenido, tipo) {
  const blob = new Blob([contenido], { type: tipo });
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(blob);
  enlace.download = nombre;
  enlace.click();
  URL.revokeObjectURL(enlace.href);
}

const PUBLICAR_PY = [
  "#!/usr/bin/env python3",
  "import shutil, subprocess, sys",
  "from pathlib import Path",
  "",
  'REPO_URL = "https://github.com/plazosherre-a11y/bpv.git"',
  'DEST = Path.home() / "Desktop" / "bpv"',
  "AQUI = Path(__file__).resolve().parent",
  "",
  "def run(cmd):",
  "    subprocess.run(cmd, check=True)",
  "",
  "if (DEST / '.git').is_dir():",
  "    print('==> Actualizando repositorio...')",
  '    run(["git", "-C", str(DEST), "pull", "--ff-only"])',
  "else:",
  '    print("==> Clonando repositorio (rama main)...")',
  '    run(["git", "clone", "--branch", "main", REPO_URL, str(DEST)])',
  "",
  "for nombre in [\"index.html\", \"datos.json\"]:",
  "    origen = AQUI / nombre",
  "    if origen.is_file():",
  "        print(f'==> Copiando {nombre}...')",
  "        shutil.copy(origen, DEST / nombre)",
  "",
  'run(["git", "-C", str(DEST), "add", "-A"])',
  'subprocess.run(["git", "-C", str(DEST), "-c", "user.name=Panel Boda", "-c", "user.email=panel@localhost", "commit", "-m", "Actualizar web desde el panel"], check=False)',
  'run(["git", "-C", str(DEST), "push", "origin", "HEAD"])',
  'print("==> Publicado en GitHub Pages (tarda 1-2 minutos en verse).")',
  "",
  "for nombre in [\"index.html\", \"datos.json\"]:",
  "    f = AQUI / nombre",
  "    if f.is_file():",
  "        f.unlink()",
  '        print(f"==> Borrado {nombre} de la carpeta local (ya publicado).")' 
].join("\n") + "\n";

document.getElementById("desc-html").addEventListener("click", () =>
  descargar("index.html", documentoHtml(), "text/html"));
document.getElementById("desc-json").addEventListener("click", () =>
  descargar("datos.json", JSON.stringify(datos, null, 2), "application/json"));
document.getElementById("desc-script").addEventListener("click", () =>
  descargar("publicar.py", PUBLICAR_PY, "text/x-python"));
document.getElementById("reiniciar").addEventListener("click", async () => {
  const res = await fetch("datos.json");
  if (res.ok) datos = await res.json();
  bloques = porDefecto();
  renderizarBloques();
  renderizarFormulario();
  actualizarVista();
});

const pestBloques = document.getElementById("pest-bloques");
const pestDatos = document.getElementById("pest-datos");
function activarPestana( cual ) {
  pestBloques.classList.toggle("activa", cual === "bloques");
  pestDatos.classList.toggle("activa", cual === "datos");
  document.getElementById("zona-bloques").hidden = cual !== "bloques";
  document.getElementById("zona-datos").hidden = cual !== "datos";
}
pestBloques.addEventListener("click", () => activarPestana("bloques"));
pestDatos.addEventListener("click", () => activarPestana("datos"));

const USUARIOS = ["pedro", "victoria"];
const CLAVE = atob("Q2FkaXotMjE=");

function iniciar() {
  document.getElementById("gate").hidden = true;
  document.getElementById("app").hidden = false;
  cargar();
}

if (sessionStorage.getItem("bpv-panel-ok") === "1") {
  iniciar();
} else {
  document.getElementById("login").addEventListener("submit", (e) => {
    e.preventDefault();
    const u = document.getElementById("usuario").value.trim().toLowerCase();
    const c = document.getElementById("clave").value.trim().replace(/[–—]/g, "-");
    if (USUARIOS.includes(u) && c === CLAVE) {
      sessionStorage.setItem("bpv-panel-ok", "1");
      iniciar();
    } else {
      document.getElementById("error").hidden = false;
      document.getElementById("clave").value = "";
      document.getElementById("clave").focus();
    }
  });
}
