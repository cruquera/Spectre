# Camadas — Clean Architecture

## Por módulo backend

```
backend/modules/{context}/
├── domain/           # Entidades, VOs, domain services, erros
├── application/      # Use cases, ports (interfaces)
├── infrastructure/   # Prisma, filesystem, adapters HTTP
└── index.ts          # API pública do módulo
```

## Regras de dependência

- **Domain** não importa application nem infrastructure.
- **Application** depende apenas de domain e ports (interfaces).
- **Infrastructure** implementa ports; pode usar Prisma e Node APIs.
- **Angular** depende de `data-contracts` (Zod DTOs) e preload IPC — nunca de Prisma.

## Shared Kernel

`backend/shared/kernel/`:

- `Money`, `Currency`, `Percentage`
- `Result<T, E>`, `DomainError`
- `DateRange`, `Ticker`

## IPC

Handlers em `backend/shared/ipc/` delegam para use cases. Validação Zod na entrada e saída.

## Renderer

- **core/** — guards, shell, serviço IPC
- **shared/** — componentes UI reutilizáveis
- **features/** — um folder por bounded context da UI
