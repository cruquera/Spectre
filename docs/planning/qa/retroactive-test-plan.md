# Plano de Testes Retroativos

> Implementar todos os testes abaixo para garantir a cobertura mínima dos sprints anteriores.

## Sprint 1 — InvestmentBlocks + Segurança

### Unitários

| # | Teste | Arquivo | Mock |
|---|-------|---------|------|
| 1 | createBlock(nome, [assetIds]) → retorna InvestmentBlock com id e assets | investment-blocks/infrastructure/investment-block.unit.test.ts | Repository mock |
| 2 | createBlock com assetIds vazio → erro de validação | investment-blocks/infrastructure/investment-block.unit.test.ts | N/A (Zod) |
| 3 | getMonthlyBlock(mês sem schedule) → null | contribution-planning/.../contribution.unit.test.ts | Repository mock |
| 4 | setMonthlyBlock(year, month, blockId) → upsert sem duplicar | investment-blocks/infrastructure/investment-block.unit.test.ts | Repository mock |
| 5 | calculateAssetDeviations com catTotal = 0 → realPercent = 0, deviation = -targetPercent | llocation/domain/allocation-calculator.test.ts | N/A (função pura) |
| 6 | percentOf(0, 0) → 0 | (já existe em percentage.test.ts) | N/A |

### Integração

| # | Teste | Arquivo |
|---|-------|---------|
| 1 | CRUD completo de bloco via Prisma | 	ests/integration/investment-blocks.test.ts |

## Sprint 2 — Pipeline de Simulação

### Unitários

| # | Teste | Arquivo |
|---|-------|---------|
| 1 | simulate com amount=1000, brokerageCost=10 → sugestões somam ≤ 990 | contribution-planning/.../contribution.unit.test.ts |
| 2 | simulate com amount < brokerageCost → sugestões vazias | contribution-planning/.../contribution.unit.test.ts |
| 3 | getAvailableCash soma posições FIXED_INCOME → resultado ≥ 0 | aluation/.../valuation.unit.test.ts |

### Componente (Frontend)

| # | Teste | Arquivo |
|---|-------|---------|
| 1 | Formulário de aporte com amount = 0 → botão desabilitado | contributions.component.spec.ts |
| 2 | Tabela de sugestões exibe dados após simulação | contributions.component.spec.ts |

## Sprint 3 — Ciclo de Vida

### Unitários

| # | Teste | Arquivo |
|---|-------|---------|
| 1 | confirmPlan(planId) com SIMULATED → status EXECUTED | contribution-planning/.../contribution.unit.test.ts |
| 2 | confirmPlan(planId) com EXECUTED → erro "Plano já executado" | contribution-planning/.../contribution.unit.test.ts |
| 3 | confirmPlan(planId) com CANCELLED → erro | contribution-planning/.../contribution.unit.test.ts |

### Integração

| # | Teste | Arquivo |
|---|-------|---------|
| 1 | Transação BUY criada a partir de sugestão → quantidade correta | 	ests/integration/contribution-lifecycle.test.ts |
| 2 | Rollback em caso de falha no  | 	ests/integration/contribution-lifecycle.test.ts |

## Sprint 4 — Dashboard

### Unitários

| # | Teste | Arquivo |
|---|-------|---------|
| 1 | getSchedule(year) → array com 12 meses | investment-blocks/.../investment-block.unit.test.ts |
| 2 | setMonthlyBlock sobrescreve schedule sem duplicar | investment-blocks/.../investment-block.unit.test.ts |

### Componente

| # | Teste | Arquivo |
|---|-------|---------|
| 1 | lock-calendar renderiza 12 meses | lock-calendar.component.spec.ts |

## Sprint 5 — Analytics

### Integração

| # | Teste | Arquivo |
|---|-------|---------|
| 1 | contributionImpact(portfolioId) cruza planos + snapshots | 	ests/integration/analytics-contribution.test.ts |
| 2 | Snapshot sem plano → não quebra gráfico | 	ests/integration/analytics-contribution.test.ts |

---

## Resumo

| Sprint | Unitários | Integração | Componente |
|--------|-----------|------------|------------|
| Sprint 1 | 6 | 1 | 0 |
| Sprint 2 | 3 | 0 | 2 |
| Sprint 3 | 3 | 2 | 0 |
| Sprint 4 | 2 | 0 | 1 |
| Sprint 5 | 0 | 2 | 0 |
| **Total** | **14** | **5** | **3** |
