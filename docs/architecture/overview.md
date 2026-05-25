# Spectre — Visão Arquitetural

## Objetivo

Spectre é um software desktop **offline-first** para gestão completa de investimentos pessoais e familiares, com foco em privacidade, segurança e controle patrimonial local.

## Princípios

1. **100% local** — sem SaaS, sem cloud, sem sincronização de dados.
2. **Benchmark isolado** — único módulo com acesso à rede (Yahoo Finance, BCB, IBGE).
3. **Multi-usuário local** — um SQLite + pasta `attachments` por familiar.
4. **Regras no backend** — domínio financeiro no Electron Main Process.
5. **Clean Architecture + DDD** — modular monolith por bounded context.

## Stack

| Camada | Tecnologia |
|--------|------------|
| UI | Angular 21 (standalone), Signals, TailwindCSS, CDK |
| Desktop | Electron (Windows v1) |
| Backend local | Node.js (Main Process) |
| DB | SQLite + Prisma (dois schemas: user + benchmark) |
| Validação | Zod |
| Gráficos | Nivo Charts |
| Testes | Jest, Playwright |

## Runtime

```
Angular Renderer → Preload (IPC) → Electron Main → Domain Modules → SQLite / FS
```

Benchmark: caminho separado, sem contexto de usuário.

## Dados locais

```
%USERPROFILE%/spectre-data/
├── app/benchmark-cache.db
└── users/{slug}/
    ├── database.db
    └── attachments/
```

Ver [offline-first.md](./offline-first.md) e [security.md](./security.md).
