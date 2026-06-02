# Spectre

Desktop offline-first para gestão de investimentos pessoais e familiares.

## Stack

- Angular 21 + Electron + Node (Main Process)
- SQLite + Prisma
- TailwindCSS, Nivo Charts, Zod

## Documentação

Ver [`docs/architecture/overview.md`](docs/architecture/overview.md).

## Desenvolvimento

### Windows — Node no PATH

Se `node` funciona mas `npm` não, o terminal pode estar usando o Node do Cursor. Rode antes de qualquer comando:

```powershell
. .\scripts\setup-path.ps1
```

Ou adicione permanentemente em **Configurações → Sistema → Variáveis de ambiente → Path**:

`C:\Program Files\nodejs` **acima** de entradas do Cursor.

```powershell
npm install
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
