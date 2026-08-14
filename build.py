#!/usr/bin/env python3
"""Build the formal project PDF with XeLaTeX and Biber."""

from __future__ import annotations

import os
import shutil
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent
MAIN = ROOT / "product-design.tex"
JOB_NAME = "shuzhiyouzong-docs"
BUILD_DIR = ROOT / ".latex-build"
OUTPUT = ROOT / f"{JOB_NAME}.pdf"


def find_tool(name: str) -> str:
    executable = f"{name}.exe" if os.name == "nt" else name
    located = shutil.which(executable) or shutil.which(name)
    if located:
        return located

    if os.name == "nt":
        local_app_data = os.environ.get("LOCALAPPDATA")
        if local_app_data:
            candidate = (
                Path(local_app_data)
                / "Programs"
                / "MiKTeX"
                / "miktex"
                / "bin"
                / "x64"
                / executable
            )
            if candidate.is_file():
                return str(candidate)

    raise FileNotFoundError(
        f"Required tool '{name}' was not found. Install XeLaTeX/Biber or add it to PATH."
    )


def run(command: list[str], cwd: Path) -> None:
    printable = " ".join(f'"{part}"' if " " in part else part for part in command)
    print(f"> {printable}", flush=True)
    subprocess.run(command, cwd=cwd, check=True)


def main() -> int:
    xelatex = find_tool("xelatex")
    biber = find_tool("biber")

    if BUILD_DIR.exists():
        shutil.rmtree(BUILD_DIR)
    BUILD_DIR.mkdir()

    # Biber resolves the local database from its working directory.
    shutil.copy2(ROOT / "reference.bib", BUILD_DIR / "reference.bib")

    xelatex_command = [
        xelatex,
        "-interaction=nonstopmode",
        "-halt-on-error",
        "-file-line-error",
        f"-jobname={JOB_NAME}",
        f"-output-directory={BUILD_DIR}",
        MAIN.name,
    ]

    try:
        run(xelatex_command, ROOT)
        run([biber, JOB_NAME], BUILD_DIR)
        run(xelatex_command, ROOT)
        run(xelatex_command, ROOT)

        generated = BUILD_DIR / f"{JOB_NAME}.pdf"
        if not generated.is_file():
            raise FileNotFoundError(f"Expected PDF was not generated: {generated}")
        shutil.copy2(generated, OUTPUT)
    except Exception:
        print(f"Build failed; diagnostics were retained in {BUILD_DIR}", file=sys.stderr)
        raise
    else:
        shutil.rmtree(BUILD_DIR)

    print(f"Built {OUTPUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
