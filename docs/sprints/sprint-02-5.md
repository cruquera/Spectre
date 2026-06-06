# Sprint 2.5 — Estratégias de Construção de Carteira

## Created
- `backend/src/shared/kernel/allocation-tree.ts` — allocation tree abstraction with normalizeAllocation
- `docs/domains/portfolio-strategies.md`
- `docs/domains/onboarding-flow-v2.md`
- `docs/architecture/allocation-tree.md`
- `docs/decisions/ADR-006-portfolio-strategies.md`
- `docs/decisions/ADR-007-allocation-tree.md`
- `tests/unit/allocation-tree.test.ts` — 10 tests
- `tests/integration/strategy-onboarding-flow.test.ts` — 5 tests

## Changed
- `prisma/user-schema.prisma` — added PortfolioStrategy enum, strategy field on PortfolioTemplate, classTargetId on PortfolioAssetTarget
- `data-contracts/src/portfolio-template.ts` — added PORTFOLIO_STRATEGIES, portfolioStrategySchema, labels
- `backend/src/modules/portfolio-template/domain/portfolio-template.ts` — added PortfolioStrategy type
- `backend/src/modules/portfolio-template/application/portfolio-template-service.ts` — accept strategy param
- `backend/src/modules/portfolio-template/application/portfolio-template-repository.ts` — accept strategy param
- `backend/src/modules/portfolio-template/infrastructure/prisma-portfolio-template-repository.ts` — persist strategy
- `backend/src/shared/ipc/register-handlers.ts` — pass strategy to service
- `backend/src/shared/database/migrate.ts` — ADD COLUMN strategy + classTargetId
- `backend/src/shared/database/sql/user-init.sql` — strategy + classTargetId columns
- `backend/src/shared/database/sql/user-migration-001.sql` — strategy column
- `backend/src/shared/database/sql/user-migration-002.sql` — strategy + classTargetId columns
- `apps/angular-app/src/app/features/onboarding/onboarding-wizard.component.ts` — 4 steps, step 2 strategy cards
- `apps/angular-app/src/app/features/onboarding/onboarding-wizard.component.html` — step 2 UI with cards
- `apps/angular-app/src/types/spectre.d.ts` — strategy field in DTOs and API types

## Removed
- (none)

## Impact
- Sprint 3 will build ASSET_CLASS_ALLOCATION UI (hierarchical targets)
- Rebalance engine consumes NormalizedAllocation[]
- Existing FREE_ALLOCATION flow unchanged
