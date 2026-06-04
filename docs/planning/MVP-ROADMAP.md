# Spectre — MVP Roadmap

> Planejamento estratégico para o MVP do sistema de rebalanceamento de carteira por blocos rotativos.

## Stack

| Camada | Tecnologia |
|--------|------------|
| UI | Angular 21 (standalone), Signals, TailwindCSS, Nivo Charts |
| Desktop | Electron 41 |
| Backend | Node.js (Electron Main Process), Clean Architecture + DDD |
| DB | SQLite + Prisma (user + benchmark schemas) |
| Validação | Zod |
| Testes | Jest (unit/integration), Playwright (E2E) |
| Lint/Format | ESLint flat config + Prettier |

## Entregas por Sprint

| Sprint | Nome | Entrega Principal |
|--------|------|-------------------|
| 0.5 | Fundação de Qualidade | Padronização de módulos, script de scaffolding, template de testes, QA retroativo |
| 1 | InvestmentBlocks + Segurança | Contexto isolado de blocos + divisão por zero tratada |
| 2 | Pipeline de Simulação | Fluxo completo: bloco do mês → desvios → sugestões → tabela interativa |
| 3 | Ciclo de Vida do Plano | Simular → Confirmar → Executar com transações automáticas |
| 4 | Dashboard de Blocos | Calendário anual, progresso mensal, visão consolidada |
| 5 | Analytics | Gráfico de evolução da alocação, relatório de impacto dos aportes |

## Critérios de Sucesso do MVP

- [ ] Usuário consegue cadastrar 3 blocos rotativos e associar ativos
- [ ] Usuário consegue agendar qual bloco está ativo em cada mês
- [ ] Usuário vê o bloco do mês corrente com os desvios de alocação
- [ ] Usuário simula um aporte e vê sugestões de distribuição
- [ ] Usuário confirma e executa um plano, gerando transações reais
- [ ] Usuário acompanha o histórico e impacto dos aportes
- [ ] Cobertura de testes: todos os módulos têm testes unitários + integração
- [ ] Lint zero errors em toda a codebase

## Documentos Relacionados

- [Sprint 0.5 — Fundação](sprints/sprint-0.5-foundation.md)
- [Sprint 1 — InvestmentBlocks](sprints/sprint-1-investment-blocks.md)
- [Sprint 2 — Simulação](sprints/sprint-2-simulation.md)
- [Sprint 3 — Ciclo de Vida](sprints/sprint-3-lifecycle.md)
- [Sprint 4 — Dashboard](sprints/sprint-4-dashboard.md)
- [Sprint 5 — Analytics](sprints/sprint-5-analytics.md)
- [Template de Módulo Backend](standards/backend-module-template.md)
- [Template de Módulo Frontend](standards/frontend-module-template.md)
- [Matriz de Testes](standards/testing-matrix.md)
- [Diretrizes Prisma](standards/prisma-guidelines.md)
- [Plano de Testes Retroativos](qa/retroactive-test-plan.md)
- [Critérios de Aceite](qa/acceptance-criteria.md)
- [ADR 0007 — Module Scaffolding](adr/0007-module-scaffolding.md)
