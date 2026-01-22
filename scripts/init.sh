#!/usr/bin/env bash
set -euo pipefail

echo "[init] Preparando ambiente..."

if [ -f .env ]; then
  echo "[init] .env já existe."
else
  cp .env.example .env
  echo "[init] .env criado a partir de .env.example."
fi

echo "[init] Pronto."