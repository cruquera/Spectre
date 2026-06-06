# Sprint 3 — Portfolio Template Builder

## Created
- `backend/src/shared/database/sql/user-migration-002.sql` — description, baseCurrency, isDefault, BenchmarkType columns
- `apps/angular-app/src/app/core/stores/portfolio-template.store.ts` — Signals store with validation, flattenTargets, canFinish
- `tests/unit/effective-allocation.test.ts` — 10 tests
- `tests/integration/portfolio-template-validation.test.ts` — 15 tests
- `docs/adr/0007-benchmark-type.md`
- `docs/adr/0008-portfolio-template-store.md`

## Changed
- `prisma/user-schema.prisma` — added BenchmarkType enum, description, baseCurrency, isDefault on PortfolioTemplate
- `data-contracts/src/portfolio-template.ts` — added BENCHMARKS, benchmarkSchema, benchmarkLabel; benchmark uses enum validation
- `backend/src/modules/portfolio-template/domain/portfolio-template.ts` — added description, baseCurrency, isDefault, benchmark fields
- `backend/src/modules/portfolio-template/application/portfolio-template-service.ts` — accept all new fields, classTargetId passthrough
- `backend/src/modules/portfolio-template/application/portfolio-template-repository.ts` — classTargetId on target types
- `backend/src/modules/portfolio-template/infrastructure/prisma-portfolio-template-repository.ts` — all new columns + classTargetId
- `backend/src/shared/ipc/register-handlers.ts` — pass new fields to service
- `backend/src/shared/database/migrate.ts` — detect description, baseCurrency, isDefault
- `backend/src/shared/database/sql/user-init.sql` — new columns
- `backend/src/shared/database/sql/user-migration-001.sql` — new columns
- `apps/angular-app/src/app/features/onboarding/onboarding-wizard.component.ts` — uses store, 4 steps (step 4 = summary)
- `apps/angular-app/src/app/features/onboarding/onboarding-wizard.component.html` — step 4 summary with effective preview
- `apps/angular-app/src/types/spectre.d.ts` — benchmark, new fields, classTargetId in DTOs/API types

## Removed
- (none)

## Impact
- Sprint 4 will wire rebalance engine to read templates from DB
- Portfolio Template Builder is fully functional for both strategies
- Effective allocation preview shows real % for ASSET_CLASS_ALLOCATION
