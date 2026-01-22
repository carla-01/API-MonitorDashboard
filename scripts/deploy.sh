#!/usr/bin/env bash
set -euo pipefail

echo "[deploy] Construindo e subindo serviços (compose raiz)..."
docker-compose up -d --build
echo "[deploy] Concluído."