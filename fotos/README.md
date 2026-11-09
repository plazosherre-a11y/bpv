# Fotos de la web

Coloca aquí las imágenes. La web espera estos nombres exactos:

## Galería principal (sección "Momentos")

- `fotos/momento-1.jpg` → "Nuestro primer viaje"
- `fotos/momento-2.jpg` → "La propuesta"
- `fotos/momento-3.jpg` → "Juntos"
- `fotos/momento-4.jpg` → "El día de la foto"
- `fotos/momento-5.jpg` → "Sonrisas"
- `fotos/momento-6.jpg` → "Recuerdos"

## Fotos de los lugares (tarjetas "El gran día")

- `fotos/ceremonia-1.jpg` → exterior de la Iglesia Catedral Castrense
- `fotos/ceremonia-2.jpg` → interior de la Iglesia Catedral Castrense
- `fotos/celebracion-1.jpg` → exterior de Finca Prados Moros
- `fotos/celebracion-2.jpg` → jardín o salón de Finca Prados Moros

## Recomendaciones

- **Formato**: JPG (o WebP si sabes convertirlas). Evita PNG para fotos, pesa mucho.
- **Tamaño**: unos 1200 px de ancho como máximo; la web las recorta automáticamente (cuadradas en la galería, 4:3 en las tarjetas).
- **Peso**: comprímelas antes de subirlas (por ejemplo en squoosh.app o tinypng.com). Ideal: menos de 300 KB cada una para que la web cargue rápido en el móvil.
- **Nombres**: sin espacios ni acentos (usa `ceremonia-1.jpg`, no `Iglesia (1).jpg`).

## Cómo subirlas

```bash
git add fotos/
git commit -m "Añadir fotos de la galería y de los lugares"
git push
```

Si cambias los nombres de archivo, actualiza también los `src` y los `alt` de cada `<img>` en `index.html`. El texto `alt` es la descripción que leerá un lector de pantalla: describe la foto, no pongas solo "foto 1".
