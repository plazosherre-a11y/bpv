#!/usr/bin/env bash
# abrir-web.sh — lleva la web de la boda al Escritorio y la abre en el navegador.
# Uso: ./abrir-web.sh
set -euo pipefail

REPO_URL="https://github.com/plazosherre-a11y/bpv.git"
DESKTOP="$HOME/Desktop"
DEST="$DESKTOP/bpv"

mkdir -p "$DESKTOP"
cd "$DESKTOP"

if [ -d "$DEST/.git" ]; then
  echo "==> Ya existe $DEST: actualizando desde GitHub..."
  git -C "$DEST" pull --ff-only
elif [ -d "$DEST" ]; then
  echo "==> Ya existe la carpeta $DEST (sin repositorio git); se usa tal cual."
else
  ZIP="$(ls "$DESKTOP"/bpv*.zip 2>/dev/null | head -n 1 || true)"
  if [ -n "$ZIP" ]; then
    echo "==> Descomprimiendo $ZIP..."
    unzip -o "$ZIP" -d "$DESKTOP"
    if [ -d "$DESKTOP/bpv-main" ] && [ ! -d "$DEST" ]; then
      mv "$DESKTOP/bpv-main" "$DEST"
    fi
  else
    echo "==> Clonando $REPO_URL en $DEST..."
    git clone "$REPO_URL" "$DEST"
  fi
fi

INDEX="$DEST/index.html"
if [ ! -f "$INDEX" ]; then
  echo "ERROR: no se encuentra $INDEX" >&2
  exit 1
fi

echo "==> Abriendo $INDEX en el navegador..."
if command -v open >/dev/null 2>&1; then
  open "$INDEX"
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$INDEX"
else
  echo "No se encontró 'open' ni 'xdg-open'. Abre manualmente: $INDEX"
fi
