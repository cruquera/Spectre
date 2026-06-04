# 🏃 Sprint 5: Analytics de Contribuições + Relatórios

**Objetivo da Sprint:** O usuário enxerga o impacto dos aportes na alocação ao longo do tempo e pode exportar relatórios.

---

## 🎨 UX/UI

- Gráfico de linha "Evolução da Alocação" (Nivo Line) mostrando a curva de cada categoria/ativo vs. alvo ao longo dos meses
- Relatório mensal: "Em janeiro você aportou R$ 1.000, reduzindo o desvio de Cripto de -15% para -8%"

## ⚙️ Backend

- Módulo nalytics ganha contributionImpact(portfolioId) que cruza ContributionPlan + PatrimonySnapshot para medir redução de desvio por aporte
- Endpoint para exportar relatório em JSON estruturado

## 💻 Frontend

- Nivo Line Chart com overlay de aportes mensais
- Tabela comparativa "antes vs. depois do aporte"

## 🛡️ QA

- Cenário: Executar 3 aportes em meses consecutivos e verificar redução de desvio
- Cenário: Snapshot sem plano naquele mês → gráfico não quebra (linha contínua sem ponto de aporte)
