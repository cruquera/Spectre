# Bounded Contexts

Ver plano arquitetural para mapa completo. Contextos implementados:

| Context | Pacote |
|---------|--------|
| Identity | `backend/modules/identity` |
| Institutions | `backend/modules/institutions` |
| Accounts | `backend/modules/accounts` |
| Assets | `backend/modules/assets` |
| Portfolio | `backend/modules/portfolio` |
| Allocation | `backend/modules/allocation` |
| Valuation | `backend/modules/valuation` |
| MarketData | `backend/modules/market-data` |
| Transactions | (em portfolio) |
| BrokerageNotes | `backend/modules/brokerage-notes` |
| Documents | `backend/modules/documents` |
| InvestmentBlocks | `backend/modules/investment-blocks` |
| ContributionPlanning | `backend/modules/contribution-planning` |
| Rebalancing | `backend/modules/rebalancing` |
| Strategies | `backend/modules/strategies` |
| PatrimonyHistory | `backend/modules/patrimony-history` |
| Analytics | `backend/modules/analytics` |
| Benchmark | `backend/modules/benchmark` |
| Tax | `backend/modules/tax` (fase 9 — estrutura base) |

## Integração

- **MarketData → Benchmark**: apenas via ACL (`BenchmarkAclPort`)
- **ContributionPlanning → Strategies, Allocation, InvestmentBlocks**
- **Rebalancing → Allocation, Valuation**
