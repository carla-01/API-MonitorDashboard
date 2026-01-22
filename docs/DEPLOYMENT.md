# Deploy

Este documento descreve o processo de deploy local usando Docker Compose.

## Pré-requisitos
- Docker e Docker Compose instalados
- Arquivo `.env` configurado (baseado em `.env.example`)

## Passos
1. Construir e subir serviços:
```bash
docker-compose up -d --build
```
2. Ver logs:
```bash
docker-compose logs -f
```
3. Parar serviços:
```bash
docker-compose down
```

## Variáveis de Ambiente
Consulte `.env.example` para a lista de variáveis suportadas.

# terminal 1 (gateway)
cd api-gateway
npm install
npm run dev

# terminal 2 (frontend)
cd frontend
npm install
npm run dev
