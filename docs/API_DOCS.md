# Documentação de APIs

Este documento descreve os endpoints expostos pelo API Gateway e pelos serviços internos do Monitor.

## Sumário
- Autenticação
- Convenções
- Endpoints do Gateway
- Endpoints do Monitor
- Erros e códigos de status
- Exemplos

## Autenticação
- Tipo: Bearer Token (JWT)
- Header: `Authorization: Bearer <token>`

## Convenções
- `Content-Type: application/json`
- Paginação: `page`, `pageSize`
- Filtros via query string

## Endpoints do Gateway
- `GET /api/health` — status do gateway
- `GET /api/summary` — resumo das métricas (24h)
- `GET /api/distribution` — distribuição de status HTTP (24h)
- `GET /api/percentiles` — percentis de latência (24h)
- `GET /api/over-time` — série temporal de latência/erros (24h)
- `GET /api/proxy?url=...` — testa uma URL pública retornando apenas metadados

## Endpoints do Monitor
- `GET /monitor/health` — status do serviço
- `GET /monitor/results` — resultados das verificações
- `POST /monitor/run` — executa verificação com payload

## Erros
- 400 — Requisição inválida
- 401 — Não autorizado
- 404 — Não encontrado
- 500 — Erro interno

## Exemplos
```http
GET /api/health
200 OK
{
  "status": "ok",
  "uptime": 123.45
}
```

---

## Políticas de Teste Público

- Somente APIs públicas (sem autenticação).
- Respeitamos rate limits com delay entre requests.
- Não armazenamos o conteúdo retornado; apenas metadados (status, tipo e tamanho, duração, headers sanitizados).
- Opt-out disponível para donos de APIs: domínios configurados são recusados.
- Não há scraping de conteúdo — HTML é detectado e o corpo não é retornado.

### Endpoint: `GET /api/proxy?url=...`

Retorna apenas metadados da resposta da URL pública informada.

Resposta:

```json
{
  "request": { "url": "https://api.exemplo.com", "methodUsed": "HEAD" },
  "status": 200,
  "durationMs": 245,
  "contentType": "application/json",
  "contentLength": 1024,
  "headers": { "cache-control": "no-cache" },
  "bodyReturned": false,
  "refusedContent": false,
  "retryAfter": null
}
```

Observações:
- Nunca retornamos o corpo da resposta.
- `refusedContent: true` indica detecção de HTML e não retorno de corpo.
- `retryAfter` reflete cabeçalho em respostas `429` quando presente.

## Opt-out de Domínios

Administradores de APIs podem solicitar opt-out adicionando o domínio à variável de ambiente `OPT_OUT_DOMAINS` (lista separada por vírgula). Exemplo:

```
OPT_OUT_DOMAINS=api.suaempresa.com,privado.exemplo.org
```

Ao entrar em opt-out, qualquer teste via `/api/proxy` para esses domínios retorna `403` com `{ "error": "domain opted-out" }`.