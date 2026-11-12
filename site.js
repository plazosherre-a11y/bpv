document.addEventListener("DOMContentLoaded", async () => {
  let datos = null;
  try {
    const guardado = localStorage.getItem("bpv-datos");
    if (guardado) datos = JSON.parse(guardado);
  } catch (e) {}
  if (!datos) {
    try {
      const res = await fetch("datos.json");
      if (res.ok) datos = await res.json();
    } catch (e) {}
  }
  if (!datos) return;

  if (datos.colores) {
    for (const [clave, valor] of Object.entries(datos.colores)) {
      document.documentElement.style.setProperty("--" + clave, valor);
    }
  }

  if (datos.fuentes) {
    const f = datos.fuentes;
    const fam = (s) => encodeURIComponent(s).replace(/%20/g, "+");
    const esScript = ["Pinyon Script", "Great Vibes", "Dancing Script"].includes(f.display);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=" + fam(f.display) + ":" + (esScript ? "wght@400" : "wght@400;600;700") + "&family=" + fam(f.body) + ":wght@300;400;500&display=swap";
    document.head.appendChild(link);
    document.documentElement.style.setProperty("--font-display", '"' + f.display + '", Georgia, serif');
    document.documentElement.style.setProperty("--font-body", '"' + f.body + '", system-ui, sans-serif');
  }

  const textos = datos.textos || {};
  if (textos.titulo) document.title = textos.titulo;

  document.querySelectorAll("[data-campo]").forEach((el) => {
    const clave = el.dataset.campo;
    if (textos[clave] === undefined) return;
    if (el.tagName === "A" && clave.startsWith("email")) {
      el.href = "mailto:" + textos[clave];
    }
    el.textContent = textos[clave];
  });

  document.querySelectorAll("[data-mapa]").forEach((el) => {
    const clave = el.dataset.mapa;
    if (textos[clave]) {
      el.href =
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(textos[clave]);
    }
  });
});
