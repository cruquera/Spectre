# Módulo: Allocation

## 1. Objetivo

Calcular alocação real vs alvo por categoria e ativo (ADR-0006).

## 2. Escopo

- `CategoryAllocation`, `AssetTargetAllocation`
- Desvios e flag `needsRebalance` por limiar

## 3. Regras de negócio

- % categoria = parcela do portfolio total
- % ativo = parcela dentro da categoria
- Sugestão de rebalanceamento somente se `|desvio| >= threshold`

## 9. Testes

- `tests/unit/allocation-calculator.test.ts`
