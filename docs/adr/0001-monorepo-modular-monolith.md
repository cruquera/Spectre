# ADR-0001: Monorepo Modular Monolith

## Status

Aceito

## Contexto

Spectre é desktop single-process. Microservices ou cloud aumentariam complexidade sem benefício.

## Decisão

npm workspaces com:

- `apps/` — electron-main, electron-preload, angular-app
- `backend/` — módulos de domínio no Main Process
- `data-contracts/` — Zod compartilhado
- `prisma/` — dois schemas

## Consequências

- Deploy único via electron-builder
- Refactors internos sem rede
- Limitação: escalar horizontalmente não é objetivo
