# Spectre

Desktop offline-first para gestão de investimentos pessoais e familiares.

## Stack

- Angular 21 + Electron + Node (Main Process)
- SQLite + Prisma
- TailwindCSS, Nivo Charts, Zod

## Documentação

Ver [`docs/architecture/overview.md`](docs/architecture/overview.md).

## Desenvolvimento

```bash
npm install
npm run prisma:generate
npm run build
npm run start:dev
```

Produção local:

```bash
npm run build
npm run start
```

## Testes

```bash
npm test
npm run test:e2e
```

## Dados locais

`%USERPROFILE%/spectre-data/`
