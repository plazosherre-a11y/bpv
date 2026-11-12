# Web de la boda — Victoria & Pedro (26.06.2027)

Web estática (HTML/CSS/JS) publicada con GitHub Pages.

- **Web pública**: https://plazosherre-a11y.github.io/bpv/
- **Panel de edición**: https://plazosherre-a11y.github.io/bpv/panel.html (usuario `victoria` o `pedro`, contraseña pedida al entrar)

## Archivos

| Archivo | Función |
|---|---|
| `index.html` | La web pública |
| `styles.css` | Estilos (responsive, menú fijo) |
| `site.js` | Aplica `datos.json` a la web |
| `datos.json` | Textos, colores y tipografías editables |
| `fondo.svg` | Patrón de fondo |
| `fotos/` | Imágenes (ver `fotos/README.md`) |
| `panel.html` + `panel.js` | Editor visual (bloques + colores/fuentes), protegido con contraseña |
| `abrir-web.py` | Script local: descarga la web al Escritorio y la abre |

## Flujo de trabajo

### 1. Ver la web en local

```bash
python3 abrir-web.py
```

Descarga/actualiza el repo en `~/Desktop/bpv` (o descomprime el ZIP si lo hay) y abre `index.html` en el navegador.

### 2. Editar la web (sin programar)

1. Entra en `/panel.html` e inicia sesión.
2. Pestaña **Bloques**: añadir, rellenar, ordenar y quitar secciones.
3. Pestaña **Colores y tipografías**: cambiar fondo, acentos y fuentes.
4. La previsualización de la derecha se actualiza sola.

### 3. Publicar los cambios en GitHub

**Opción A (automática)**: en el panel, descarga `index.html`, `datos.json` y `publicar.py`. Pon los tres archivos en una carpeta y ejecuta:

```bash
python3 publicar.py
```

Hace `git pull`, copia los archivos, `commit` y `push` a `main`. Requiere tener `git` instalado y sesión iniciada.

**Opción B (manual, sin git)**: entra en el repo en GitHub → `Add file` → `Upload files` → sube los archivos descargados reemplazando los anteriores → `Commit changes`.

### 4. Esperar el despliegue

GitHub Pages publica `main` automáticamente en 1–2 minutos. Refresca con Ctrl+F5 para saltar la caché.

## Fotos

Coloca las imágenes en `fotos/` con los nombres indicados en `fotos/README.md` y súbelas a GitHub (misma opción A o B).

## Nota de seguridad

El acceso al panel usa una contraseña guardada en el código cliente: es una barrera simbólica, no seguridad real (el código es público). Para restringir el acceso de verdad, usar Cloudflare Access sobre Cloudflare Pages.
