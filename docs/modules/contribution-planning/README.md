# Módulo: Contribution Planning

## 1. Objetivo

Simular distribuição de aportes usando bloco do mês, estratégia e desvios de alocação.

## 3. Regras de negócio

- Pipeline: bloco mensal → estratégia → constraints (lote mínimo, corretagem)
- Primeira estratégia: `weighted-rebalance`

## 9. Testes

- `tests/unit/weighted-rebalance-strategy.test.ts`
