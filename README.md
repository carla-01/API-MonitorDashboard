# API-MonitorDashboard

[![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.11-green)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue)](https://docs.docker.com/compose/)
[![Node.js](https://img.shields.io/badge/Node.js-18-green)](https://nodejs.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3-black)](https://flask.palletsprojects.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-7-red)](https://redis.io)

**Sistema fullstack para monitoramento de performance e disponibilidade de APIs públicas.**

![Dashboard Preview](frontend/telaapimonitor.png)

## Recursos

- **Monitoramento em tempo real** de múltiplas APIs
- **Métricas de performance**: response time, uptime, error rate
- **Visualização de conteúdo** das APIs monitoradas
- **Sistema de alertas** configurável
- **Gráficos e histórico** de métricas
- **Containerizado** com Docker Compose

## Arquitetura
Frontend (React) → API Gateway (Node.js) → Monitor Service (Flask) → PostgreSQL + Redis



## Como Rodar

```bash
cp .env.example .env
# Edite o .env com valores 

docker-compose up --build

Serviços:
# Frontend: http://localhost:4173
# API Gateway: http://localhost:3001
# Monitor Service: http://localhost:5000
# PostgreSQL: http://localhost:5432
# Redis: http://localhost:6379