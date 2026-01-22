# Arquitetura

O projeto segue uma arquitetura de serviços com um frontend (React + TypeScript), um API Gateway (Node.js + Express) e um serviço de monitoramento (Flask + Python).

## Visão Geral
- Frontend (`frontend/`): Dashboard para visualização do estado das APIs monitoradas.
- API Gateway (`api-gateway/`): Orquestra requisições, autenticação, rate limiting e roteamento.
- Monitor Service (`monitor-service/`): Executa verificações de saúde e latência nas APIs alvo.
- Shared (`shared/`): Configurações e contratos compartilhados entre serviços.

## Comunicação
- Gateway expõe endpoints REST.
- Monitor é acessado pelo Gateway via HTTP interno.
- Frontend consome o Gateway.

## Infraestrutura
- Docker Compose para desenvolvimento e execução local.
- Variáveis de ambiente via `.env`.

## Observabilidade
- Logs padronizados por serviço.
- Health checks em `/health` de cada serviço.