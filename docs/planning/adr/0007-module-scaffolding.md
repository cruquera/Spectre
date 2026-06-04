# ADR 0007: Module Scaffolding Automation

**Status:** Accepted  
**Date:** 2026-06-04  
**Context:** Backend module structure, Frontend feature structure, Consistency

## Decision

We will implement a `scripts/generate-module.mjs` script that automatically generates
the complete directory structure, boilerplate code, and registration wiring for new
backend modules and frontend features.

## Motivation

- Ensure all modules follow the same 3-layer DDD pattern
- Reduce onboarding time for new developers
- Eliminate manual boilerplate (IPC handlers, routes, IpcService getters)
- Guarantee every new module ships with test skeletons

## What the script generates

### Backend
```
backend/src/modules/<name>/
  domain/<name>.ts
  application/<name>-repository.ts
  application/<name>-service.ts
  infrastructure/prisma-<name>-repository.ts
  infrastructure/<name>.unit.test.ts
```

### Frontend
```
apps/angular-app/src/app/features/<name>/
  <name>.component.ts
  <name>.component.html
  <name>.component.spec.ts
```

### Integration tests
```
tests/integration/<name>.test.ts
```

### Wiring (automatic)
- IPC handler in `register-handlers.ts`
- Service instantiation in `createServices()`
- Route in `app.routes.ts`
- Getter in `IpcService`
- Preload API entry in `preload.ts`

## Usage

```bash
npm run generate:module -- --name investment-blocks
npm run generate:module -- --name my-module --feature false
```

## Consequences

- (+) Consistent module structure across the codebase
- (+) Faster development of new features
- (+) Test coverage from day one
- (-) Script must be maintained as patterns evolve
- (-) Generated files need manual business logic filling
