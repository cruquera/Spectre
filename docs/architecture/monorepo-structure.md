# Monorepo Structure

```
spectre/
├── apps/
│   ├── angular-app/         # Angular 21 frontend
│   ├── electron-main/       # Electron main process
│   └── electron-preload/    # Context bridge
├── backend/                 # Domain logic
│   └── src/
│       ├── modules/         # Domain modules (Clean Architecture)
│       ├── shared/          # Shared kernel
│       │   ├── database/    # Prisma factory, migrations
│       │   ├── ipc/         # IPC handler registration
│       │   └── kernel/      # Result, Money, Percentage, etc.
│       └── index.ts         # Public API
├── data-contracts/          # Shared Zod validation
├── prisma/                  # Prisma schemas
│   ├── user-schema.prisma   # User data models
│   └── benchmark-schema.prisma  # Benchmark cache models
├── docs/                    # Documentation
├── tests/                   # Tests
└── scripts/                 # Dev tooling
```
