#!/usr/bin/env python3
"""abrir-web.py — lleva la web de la boda al Escritorio y abre index.html.

Funciona en Windows, macOS y Linux.

Uso:
    python abrir-web.py
"""

import shutil
import subprocess
import sys
import webbrowser
import zipfile
from pathlib import Path

REPO_URL = "https://github.com/plazosherre-a11y/bpv.git"
DESKTOP = Path.home() / "Desktop"
DEST = DESKTOP / "bpv"


def asegurar_repositorio() -> None:
    """Deja el código de la web en DEST, clonando, actualizando o descomprimiendo."""
    if (DEST / ".git").is_dir():
        print(f"==> Ya existe {DEST}: actualizando desde GitHub...")
        subprocess.run(["git", "-C", str(DEST), "pull", "--ff-only"], check=True)
        return

    if DEST.is_dir() and any(DEST.iterdir()):
        print(f"==> Ya existe la carpeta {DEST}; se usa tal cual.")
        return

    # Si hay un ZIP descargado de GitHub (bpv-main.zip, bpv-<rama>.zip, etc.)
    zips = sorted(DESKTOP.glob("bpv*.zip"))
    if zips:
        zip_path = zips[0]
        print(f"==> Descomprimiendo {zip_path.name}...")
        with zipfile.ZipFile(zip_path) as zf:
            zf.extractall(DESKTOP)
        if not DEST.exists():
            extraidos = [p for p in DESKTOP.glob("bpv*") if p.is_dir() and p != DEST]
            if not extraidos:
                print("ERROR: el ZIP no contenía ninguna carpeta bpv*.", file=sys.stderr)
                sys.exit(1)
            # La carpeta recién creada es la de fecha de modificación más reciente
            extraidos.sort(key=lambda p: p.stat().st_mtime, reverse=True)
            extraidos[0].rename(DEST)
        return

    # Si no hay ZIP, clonar con git
    if shutil.which("git") is None:
        print("ERROR: no hay git instalado y tampoco un ZIP descargado.", file=sys.stderr)
        print("Descarga el ZIP desde GitHub (botón Code -> Download ZIP),", file=sys.stderr)
        print("déjalo en el Escritorio y vuelve a ejecutar este script.", file=sys.stderr)
        sys.exit(1)
    print(f"==> Clonando {REPO_URL} en {DEST}...")
    subprocess.run(["git", "clone", REPO_URL, str(DEST)], check=True)


def main() -> int:
    DESKTOP.mkdir(parents=True, exist_ok=True)
    asegurar_repositorio()

    index = DEST / "index.html"
    if not index.is_file():
        print(f"ERROR: no se encuentra {index}", file=sys.stderr)
        return 1

    print(f"==> Abriendo {index} en el navegador...")
    webbrowser.open(index.as_uri())
    return 0


if __name__ == "__main__":
    sys.exit(main())
