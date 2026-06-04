# 🏃 Sprint 4: Dashboard de Blocos Rotativos + Automação Mensal

**Objetivo da Sprint:** Interface completa de acompanhamento dos 3 blocos rotativos com progresso mensal e visão consolidada da estratégia de aportes.

---

## 🎨 UX/UI

- Dashboard visual com:
  - Timeline anual mostrando bloco por mês
  - Indicador de progresso do mês corrente
  - Cards com resumo de cada bloco (ativos, % alocada, desvio médio)
- Tooltips e glossário ("Bloco 1: Cripto+Global → ativos de maior risco")

## ⚙️ Backend

- Endpoint investment-blocks:getSchedule(year) que retorna o calendário anual de blocos
- StrategyRegistry ganha suporte a múltiplas estratégias (ixed-value, weighted-rebalance)
- Configuração de bloco por mês via planejamento anual (template de rotação)

## 💻 Frontend

- Componente lock-calendar com rotulagem e cor por bloco (em shared/components/)
- Configurador de rotação: wizard "Planeje seu ano" que atribui blocos a cada mês
- **Padronização:** Usar Signals, Tailwind spectre classes, provideComponentStore se necessário

## 🛡️ QA

- Cenário: Rotação anual — configurar bloco 1 em jan, bloco 2 em fev, validar retorno
- Cenário: Sobrescrever bloco de um mês já configurado → upsert sem duplicar
