# Fotos de la web

Coloca aquí las imágenes de la galería. La web espera estos nombres exactos:

- `fotos/momento-1.jpg` → "Nuestro primer viaje"
- `fotos/momento-2.jpg` → "La propuesta"
- `fotos/momento-3.jpg` → "Juntos"
- `fotos/momento-4.jpg` → "El día de la foto"
- `fotos/momento-5.jpg` → "Sonrisas"
- `fotos/momento-6.jpg` → "Recuerdos"

## Recomendaciones

- **Formato**: JPG (o WebP si sabes convertirlas). Evita PNG para fotos, pesa mucho.
- **Tamaño**: unos 1200 px de ancho como máximo; la web las recorta cuadradas automáticamente.
- **Peso**: comprímelas antes de subirlas (por ejemplo en squoosh.app o tinypng.com). Ideal: menos de 300 KB cada una para que la web cargue rápido en el móvil.
- **Nombres**: sin espacios ni acentos (usa `momento-1.jpg`, no `Mi foto (1).jpg`).

## Cómo subirlas

```bash
git add fotos/
git commit -m "Añadir fotos de la galería"
git push
```

Si cambias los nombres de archivo, actualiza también los `src` y los `alt` de cada `<img>` en `index.html` (sección "Momentos"). El texto `alt` es la descripción que leerá un lector de pantalla: describe la foto, no pongas solo "foto 1".
