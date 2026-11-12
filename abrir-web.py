#!/usr/bin/env python3
"""abrir-web.py — lleva la web de la boda al Escritorio y abre index.html.

Funciona en Windows, macOS y Linux.

Uso:
    python3 abrir-web.py
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


def main() -> int:
    DESKTOP.mkdir(parents=True, exist_ok=True)

    if (DEST / ".git").is_dir():
        print(f"==> Ya existe {DEST}: actualizando desde GitHub...")
        subprocess.run(["git", "-C", str(DEST), "pull", "--ff-only"], check=True)
    elif DEST.is_dir():
        print(f"==> Ya existe la carpeta {DEST} (sin repositorio git); se usa tal cual.")
    else:
        zips = sorted(DESKTOP.glob("bpv*.zip"))
        if zips:
            zip_path = zips[0]
            print(f"==> Descomprimiendo {zip_path.name}...")
            with zipfile.ZipFile(zip_path) as zf:
                zf.extractall(DESKTOP)
            extracted = DESKTOP / "bpv-main"
            if extracted.is_dir() and not DEST.exists():
                extracted.rename(DEST)
        else:
            if shutil.which("git") is None:
                print("ERROR: no hay git instalado y tampoco un ZIP descargado.", file=sys.stderr)
                print("Descarga el ZIP desde GitHub (botón Code -> Download ZIP) y vuelve a ejecutar.", file=sys.stderr)
                return 1
            print(f"==> Clonando {REPO_URL} en {DEST}...")
            subprocess.run(["git", "clone", REPO_URL, str(DEST)], check=True)

    index = DEST / "index.html"
    if not index.is_file():
        print(f"ERROR: no se encuentra {index}", file=sys.stderr)
        return 1

    print(f"==> Abriendo {index} en el navegador...")
    webbrowser.open(index.as_uri())
    return 0


if __name__ == "__main__":
    sys.exit(main())
