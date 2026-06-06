# Sprint 1 Changelog

## Created

- `backend/src/shared/kernel/allocation-calculator.ts` — extracted from archive
- `backend/src/modules/portfolio-template/` — renamed from portfolio-projects
- `backend/src/modules/onboarding/` — replaces tour module
- `docs/product/vision.md`, `core-loop.md`, `rebalance-engine.md`, `onboarding.md`
- `docs/architecture/technical-architecture.md`, `monorepo-structure.md`, `electron-ipc.md`, `signals-state.md`, `database-schema.md`
- `docs/domains/accounts-domain.md`, `portfolio-template-domain.md`, `ledger-domain.md`, `benchmark-domain.md`
- `docs/decisions/ADR-001-ledger.md`, `ADR-002-rebalancing.md`, `ADR-003-signals.md`
- `docs/sprints/sprint-01.md`
- `docs/changelog/sprint-01.md`
- `apps/angular-app/src/app/core/guards/onboarding.guard.ts`

## Refactored

- `prisma/user-schema.prisma` — new models (PortfolioTemplate, PortfolioAssetTarget, InvestmentPortfolio, LedgerEvent), expanded AssetType enum (17 classes), OnboardingStatus enum, EventType enum
- `backend/src/shared/database/migrate.ts` — updated table detection logic
- `backend/src/shared/database/sql/user-init.sql` — new schema
- `backend/src/shared/database/sql/user-migration-001.sql` — new schema
- `backend/src/shared/database/sql/user-migration-002.sql` — new schema
- `backend/src/shared/ipc/register-handlers.ts` — onboarding + portfolioTemplates channels
- `data-contracts/src/index.ts` — updated exports
- `data-contracts/src/onboarding.ts` — OnboardingState schema
- `data-contracts/src/portfolio-template.ts` — PortfolioTemplate schema with 17 asset types
- `apps/electron-preload/src/preload.ts` — onboarding + portfolioTemplates API
- `apps/angular-app/src/types/spectre.d.ts` — new type definitions
- `apps/angular-app/src/app/app.routes.ts` — new route structure
- `apps/angular-app/src/app/core/services/ipc.service.ts` — onboarding + portfolioTemplates
- `apps/angular-app/src/app/core/layout/shell.component.ts` — onboarding state
- `apps/angular-app/src/app/features/dashboard/` — onboarding references
- `apps/angular-app/src/app/features/auth/profile-select.component.ts` — onboarding redirect
- `apps/angular-app/src/app/features/onboarding/` — renamed from tour, added step 3

## Removed

- `backend/src/modules/_archive/` — 17 archived modules
- `backend/src/modules/tour/` — replaced by onboarding
- `backend/src/modules/portfolio-projects/` — replaced by portfolio-template
- `apps/angular-app/src/app/features/_archive/` — 11 archived features
- `apps/angular-app/src/app/core/guards/tour.guard.ts`
- `data-contracts/src/_archive/` — 12 archived files
- `data-contracts/src/tour.ts`
- `data-contracts/src/portfolio-project.ts`
- `tests/unit/allocation-calculator.test.ts`
- `tests/unit/brokerage-notes-path.test.ts`
- `tests/unit/weighted-rebalance-strategy.test.ts`
- `tests/integration/investment-blocks.test.ts`
- `tests/integration/seed-strategies.test.ts`

## Known Issues

- Onboarding wizard step 2 (portfolio template) and step 3 (first contribution) are placeholders
- Investment portfolio and ledger UIs are placeholders
- Benchmark engine not yet connected
- Dashboard hero (rebalancer) not yet implemented
- Tests for archived code were removed — new tests needed
