# Technical Architecture

## Stack

- **Desktop Shell:** Electron
- **Frontend:** Angular 21+ (standalone components)
- **State:** Angular Signals
- **Styling:** TailwindCSS
- **Database:** SQLite (better-sqlite3)
- **ORM:** Prisma ORM
- **Validation:** Zod (shared data contracts)
- **Monorepo:** npm workspaces

## Architecture Pattern

Clean Architecture / DDD per backend module:

```
modules/{context}/
  domain/           # Pure types
  application/      # Use cases + repository interfaces
  infrastructure/   # Prisma implementations
```

## Data Flow

```
Angular (renderer)
  → IPC (contextBridge)
  → Electron Main Process
  → Backend Modules
  → SQLite (per user)
```

## Monorepo Packages

| Package | Role |
|---------|------|
| `@spectre/angular-app` | Angular 21 UI |
| `@spectre/electron-main` | Electron shell |
| `@spectre/electron-preload` | Context bridge |
| `@spectre/backend` | Domain logic + IPC handlers |
| `@spectre/data-contracts` | Shared Zod schemas |
